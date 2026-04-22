const express = require("express");
const router = express.Router();

// const productController = require("../controllers/product.controller");
const controller = require("../controllers/product.controller");
const { authRequired, requireAdmin } = require("../middlewares/auth.middleware");

// router.post("/", productController.createProduct);
// router.get("/", productController.getProducts);
router.get("/", controller.getProducts);
router.get("/:id", controller.getProductById);
router.post("/", authRequired, requireAdmin, controller.createProduct);
router.put("/:id", authRequired, requireAdmin, controller.updateProduct);
router.delete("/:id", authRequired, requireAdmin, controller.deleteProduct);

module.exports = router;