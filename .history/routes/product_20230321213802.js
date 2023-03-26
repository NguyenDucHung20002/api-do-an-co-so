const express = require("express");
const router = express.Router();

const productController = require("../controller/productsController");

router.post("/product", productController.addProduct);
router.post("/search/product", productController.searchProduct);
router.get("/product", productController.getProduct);
router.get("/count/product", productController.countProduct);
router.get("/product/:id", productController.getAProduct);
router.put("/product/:id", productController.updateProduct);
router.delete("/product/:id", productController.deleteProduct);

module.exports = router;
