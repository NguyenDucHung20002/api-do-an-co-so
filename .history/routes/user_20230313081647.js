const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.post("/user", userController.register);
router.get("/user", userController.getAllUser);
router.delete("/user/:id", userController.deleteUser);
router.put("/user/:id", userController.updateUser);
router.get("/user/:id", userController.getAUser);

module.exports = router;
