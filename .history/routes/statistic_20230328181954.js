const express = require("express");
const router = express.Router();
const statisticController = require("../controller/statisticController");

router.get("/product", statisticController.getAllStatistic);
router.post("/product", statisticController.addStatistic);

module.exports = router;
