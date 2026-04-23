const { Category } = require("../models");
const { badRequest, created, ok, serverError } = require("../utils/api-response");

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    return ok(res, categories);
  } catch (error) {
    return serverError(res, error);
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!name || !type) {
      return badRequest(res, "name and type are required");
    }

    const category = await Category.create({ name, type });
    return created(res, category, "Category created");
  } catch (error) {
    return serverError(res, error);
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return badRequest(res, "Category not found");
    }

    await category.update({ name, type });
    return ok(res, category, "Category updated");
  } catch (error) {
    return serverError(res, error);
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      return badRequest(res, "Category not found");
    }

    await category.destroy();
    return ok(res, null, "Category deleted");
  } catch (error) {
    return serverError(res, error);
  }
};