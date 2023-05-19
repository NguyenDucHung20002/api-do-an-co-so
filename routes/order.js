const express = require("express");
const router = express.Router();

const ordeController = require("../controller/orderController");

router.post("/order", ordeController.addOrder);
router.get("/order", ordeController.getUserOrder);
router.get("/recentorders", ordeController.recentOrders);
router.get("/searchorder", ordeController.searchOrders);

module.exports = router;
