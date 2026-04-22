const express = require("express");
const controller = require("../controllers/order.controller");
const { authRequired, requireAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", authRequired, controller.createOrder);
router.get("/my-orders", authRequired, controller.getMyOrders);
router.get("/admin/list", authRequired, requireAdmin, controller.getAllOrdersForAdmin);
router.get("/admin/summary", authRequired, requireAdmin, controller.getOrderSummary);
router.get("/:id", authRequired, controller.getOrderById);
router.patch("/:id/status", authRequired, requireAdmin, controller.updateOrderStatus);

module.exports = router;