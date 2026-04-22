const { Op } = require("sequelize");
const sequelize = require("../config/database");
const { Order, OrderItem, Product, Pet, User } = require("../models");
const { getPagination, getPagingMeta } = require("../utils/query");
const { badRequest, created, ok, notFound, forbidden, serverError } = require("../utils/api-response");

async function resolveItem(item, transaction) {
  if (item.itemType === "product") {
    const product = await Product.findByPk(item.itemId, { transaction, lock: true });
    if (!product) throw new Error(`Product #${item.itemId} not found`);
    if (product.quantity < item.quantity) throw new Error(`Product ${product.name} out of stock`);

    product.quantity -= item.quantity;
    await product.save({ transaction });

    return {
      itemName: product.name,
      unitPrice: product.price,
      quantity: item.quantity,
      lineTotal: product.price * item.quantity,
    };
  }

  if (item.itemType === "pet") {
    const pet = await Pet.findByPk(item.itemId, { transaction, lock: true });
    if (!pet) throw new Error(`Pet #${item.itemId} not found`);
    if (pet.stock < item.quantity) throw new Error(`Pet ${pet.name} out of stock`);

    pet.stock -= item.quantity;
    await pet.save({ transaction });

    return {
      itemName: pet.name,
      unitPrice: pet.price,
      quantity: item.quantity,
      lineTotal: pet.price * item.quantity,
    };
  }

  throw new Error(`Unsupported itemType ${item.itemType}`);
}

exports.createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { shippingAddress, note, items } = req.body;

    if (!shippingAddress || !Array.isArray(items) || items.length === 0) {
      await transaction.rollback();
      return badRequest(res, "shippingAddress and items are required");
    }

    const order = await Order.create(
      {
        userId: req.user.id,
        shippingAddress,
        note,
      },
      { transaction }
    );

    const itemPayload = [];
    let totalAmount = 0;

    for (const item of items) {
      if (!item.itemType || !item.itemId || !item.quantity || item.quantity < 1) {
        throw new Error("Each item must include itemType, itemId, quantity >= 1");
      }

      const detail = await resolveItem(item, transaction);
      totalAmount += detail.lineTotal;

      itemPayload.push({
        orderId: order.id,
        itemType: item.itemType,
        itemId: item.itemId,
        ...detail,
      });
    }

    await OrderItem.bulkCreate(itemPayload, { transaction });
    await order.update({ totalAmount }, { transaction });

    await transaction.commit();

    const result = await Order.findByPk(order.id, {
      include: [{ model: OrderItem }],
    });

    return created(res, result, "Order created successfully");
  } catch (error) {
    await transaction.rollback();
    return badRequest(res, error.message);
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const where = { userId: req.user.id };
    if (req.query.status) where.status = req.query.status;

    const { rows, count } = await Order.findAndCountAll({
      where,
      include: [{ model: OrderItem }],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return ok(res, {
      items: rows,
      pagination: getPagingMeta({ page, limit, count }),
    });
  } catch (error) {
    return serverError(res, error);
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: OrderItem },
        { model: User, attributes: ["id", "fullName", "email", "phone"] },
      ],
    });

    if (!order) {
      return notFound(res, "Order not found");
    }

    const isOwner = order.userId === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return forbidden(res, "You do not have access to this order");
    }

    return ok(res, order);
  } catch (error) {
    return serverError(res, error);
  }
};

exports.getAllOrdersForAdmin = async (req, res) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const where = {};

    if (req.query.status) where.status = req.query.status;
    if (req.query.dateFrom || req.query.dateTo) {
      where.createdAt = {};
      if (req.query.dateFrom) where.createdAt[Op.gte] = new Date(req.query.dateFrom);
      if (req.query.dateTo) where.createdAt[Op.lte] = new Date(req.query.dateTo);
    }

    const { rows, count } = await Order.findAndCountAll({
      where,
      include: [
        { model: OrderItem },
        { model: User, attributes: ["id", "fullName", "email", "phone"] },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return ok(res, {
      items: rows,
      pagination: getPagingMeta({ page, limit, count }),
    });
  } catch (error) {
    return serverError(res, error);
  }
};

exports.getOrderSummary = async (_req, res) => {
  try {
    const [summaryRows] = await sequelize.query(`
      SELECT
        COUNT(*) AS totalOrders,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pendingOrders,
        SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) AS paidOrders,
        SUM(CASE WHEN status = 'shipping' THEN 1 ELSE 0 END) AS shippingOrders,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completedOrders,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelledOrders,
        COALESCE(SUM(totalAmount), 0) AS revenue
      FROM orders;
    `);

    return ok(res, summaryRows[0]);
  } catch (error) {
    return serverError(res, error);
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowStatuses = ["pending", "paid", "shipping", "completed", "cancelled"];

    if (!allowStatuses.includes(status)) {
      return badRequest(res, `status must be one of: ${allowStatuses.join(", ")}`);
    }

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return notFound(res, "Order not found");
    }

    await order.update({ status });
    return ok(res, order, "Order status updated");
  } catch (error) {
    return serverError(res, error);
  }
};