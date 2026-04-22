const express = require("express");
const controller = require("../controllers/category.controller");
const { authRequired, requireAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", controller.getCategories);
router.post("/", authRequired, requireAdmin, controller.createCategory);
router.put("/:id", authRequired, requireAdmin, controller.updateCategory);
router.delete("/:id", authRequired, requireAdmin, controller.deleteCategory);

module.exports = router;