const express = require("express");
const router = express.Router();
const statisticController = require("../controller/statisticController");

router.get("/product", statisticController.getAllStatistic);

module.exports = router;
