const express = require("express");
const controller = require("../controllers/pet.controller");
const { authRequired, requireAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", controller.getPets);
router.get("/:id", controller.getPetById);
router.post("/", authRequired, requireAdmin, controller.createPet);
router.put("/:id", authRequired, requireAdmin, controller.updatePet);
router.delete("/:id", authRequired, requireAdmin, controller.deletePet);

module.exports = router;