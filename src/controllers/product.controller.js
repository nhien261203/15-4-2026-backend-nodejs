// const Product = require("../models/product.model");
const { Op } = require("sequelize");
const { Category, Product } = require("../models");
const { getPagination, getPagingMeta } = require("../utils/query");
const { badRequest, created, ok, notFound, serverError } = require("../utils/api-response");

// CREATE
exports.createProduct = async (req, res) => {
  try {
    const { name, price, categoryId } = req.body;

    if (!name || price == null) {
      return badRequest(res, "name and price are required");
    }

    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category || category.type !== "product") {
        return badRequest(res, "Invalid product category");
      }
    }

    const product = await Product.create(req.body);
    // res.json(product);
    return created(res, product, "Product created");
  } catch (error) {
    // res.status(500).json({ error: error.message });
    return serverError(res, error);
  }
};

// GET ALL
exports.getProducts = async (req, res) => {
//   const products = await Product.findAll();
//   res.json(products);
// };
  try {
    const { page, limit, offset } = getPagination(req.query);
    const where = {};

    if (req.query.categoryId) where.categoryId = req.query.categoryId;
    if (req.query.brand) where.brand = req.query.brand;
    if (req.query.minPrice || req.query.maxPrice) {
      where.price = {};
      if (req.query.minPrice) where.price[Op.gte] = Number(req.query.minPrice);
      if (req.query.maxPrice) where.price[Op.lte] = Number(req.query.maxPrice);
    }
    if (req.query.inStock === "true") where.quantity = { [Op.gt]: 0 };
    if (req.query.search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${req.query.search.trim()}%` } },
        { description: { [Op.like]: `%${req.query.search.trim()}%` } },
      ];
    }

    const { rows, count } = await Product.findAndCountAll({
      where,
      include: [{ model: Category, attributes: ["id", "name", "type"] }],
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

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category, attributes: ["id", "name", "type"] }],
    });

    if (!product) {
      return notFound(res, "Product not found");
    }

    return ok(res, product);
  } catch (error) {
    return serverError(res, error);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return notFound(res, "Product not found");
    }

    await product.update(req.body);
    return ok(res, product, "Product updated");
  } catch (error) {
    return serverError(res, error);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return notFound(res, "Product not found");
    }

    await product.destroy();
    return ok(res, null, "Product deleted");
  } catch (error) {
    return serverError(res, error);
  }
};