const express = require("express");
const controller = require("../controllers/auth.controller");
const { authRequired } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/me", authRequired, controller.profile);

module.exports = router;