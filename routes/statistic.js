const express = require("express");
const router = express.Router();
const statisticController = require("../controller/statisticController");

router.get("/statistic", statisticController.getAllStatistic);
router.get("/revenues", statisticController.statisticsRevenueMonth);
router.get("/bestselling", statisticController.bestSelling);
// router.post("/statistic", statisticController.addStatistic);
router.post("/statistic", statisticController.updateStatistic);

module.exports = router;
