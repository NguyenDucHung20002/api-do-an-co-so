const express = require("express");
const router = express.Router();

const productController = require("../controller/productsController");

router.post("/product", productController.addProduct);
router.get("/product", productController.getProduct);
router.get("/count/product", productController.countProduct);

module.exports = router;
