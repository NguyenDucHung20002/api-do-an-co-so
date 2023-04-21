const express = require("express");
const router = express.Router();
const statisticController = require("../controller/statisticController");

router.get("/statistic", statisticController.getAllStatistic);
router.post("/statistic", statisticController.addStatistic);
router.put("/statistic", statisticController.updateStatistic);

module.exports = router;
