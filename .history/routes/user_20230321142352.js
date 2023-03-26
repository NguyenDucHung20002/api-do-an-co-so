const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/changepassword", userController.changePassword);
router.get("/user", userController.getAllUser);
router.delete("/user/:id", userController.deleteUser);
router.put("/user/:id", userController.updateUser);
router.get("/cart/user/:id", userController.getCartUser);
router.get("/addcart/user/:id", userController.addCartUser);

module.exports = router;
