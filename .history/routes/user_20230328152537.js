const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.put("/changepassword", userController.changePassword);
router.get("/user", userController.getAllUser);
router.get("/user/check", userController.checkAuthorization);
router.delete("/user/:id", userController.deleteUser);
router.put("/user/:id", userController.updateUser);
router.get("/cart/user/:id", userController.getCartUser);
router.get("/like/user/:id", userController.getLikeUser);
router.get("/purchase/user/:id", userController.getPurchaseUser);
router.put("/updatecart/user/:id", userController.updateCartUser);
router.put("/updatelike/user/:id", userController.updateLikeUser);

module.exports = router;
