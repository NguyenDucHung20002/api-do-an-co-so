const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/logout", userController.logout);
router.get("/user", userController.getAllUser);
router.delete("/user/:id", userController.deleteUser);
router.put("/user/:id", userController.updateUser);
router.get("/cart/user/:id", userController.getCartUser);

module.exports = router;
