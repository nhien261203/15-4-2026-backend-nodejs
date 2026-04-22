const { Op } = require("sequelize");
const { Category, Pet } = require("../models");
const { getPagination, getPagingMeta } = require("../utils/query");
const { badRequest, created, ok, notFound, serverError } = require("../utils/api-response");

exports.createPet = async (req, res) => {
  try {
    const { name, species, price, categoryId } = req.body;

    if (!name || !species || price == null) {
      return badRequest(res, "name, species, price are required");
    }

    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category || category.type !== "pet") {
        return badRequest(res, "Invalid pet category");
      }
    }

    const pet = await Pet.create(req.body);
    return created(res, pet, "Pet created");
  } catch (error) {
    return serverError(res, error);
  }
};

exports.getPets = async (req, res) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const where = {};

    if (req.query.categoryId) where.categoryId = req.query.categoryId;
    if (req.query.species) where.species = req.query.species;
    if (req.query.vaccinated != null) where.vaccinated = req.query.vaccinated === "true";
    if (req.query.minPrice || req.query.maxPrice) {
      where.price = {};
      if (req.query.minPrice) where.price[Op.gte] = Number(req.query.minPrice);
      if (req.query.maxPrice) where.price[Op.lte] = Number(req.query.maxPrice);
    }
    if (req.query.search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${req.query.search.trim()}%` } },
        { breed: { [Op.like]: `%${req.query.search.trim()}%` } },
      ];
    }

    const { rows, count } = await Pet.findAndCountAll({
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

exports.getPetById = async (req, res) => {
  try {
    const pet = await Pet.findByPk(req.params.id, {
      include: [{ model: Category, attributes: ["id", "name", "type"] }],
    });

    if (!pet) {
      return notFound(res, "Pet not found");
    }

    return ok(res, pet);
  } catch (error) {
    return serverError(res, error);
  }
};

exports.updatePet = async (req, res) => {
  try {
    const pet = await Pet.findByPk(req.params.id);

    if (!pet) {
      return notFound(res, "Pet not found");
    }

    await pet.update(req.body);
    return ok(res, pet, "Pet updated");
  } catch (error) {
    return serverError(res, error);
  }
};

exports.deletePet = async (req, res) => {
  try {
    const pet = await Pet.findByPk(req.params.id);

    if (!pet) {
      return notFound(res, "Pet not found");
    }

    await pet.destroy();
    return ok(res, null, "Pet deleted");
  } catch (error) {
    return serverError(res, error);
  }
};