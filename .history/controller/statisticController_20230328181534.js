const Statistic = require("../models/statisticModel");

exports.getAllStatistic = async (req, res) => {
  try {
    const { products, revenue, users, websiteTraffic, order } = req.body;
    if (getData) {
      res.status(200).json({ success: true, data: getData });
    } else {
      res.status(500).json({ success: false, state: "Can not found!" });
    }
  } catch (err) {
    res.status(500).json({ success: false, state: "invalid ID" });
  }
};

exports.getAllStatistic = async (req, res) => {
  try {
    const getData = await Statistic.find();
    if (getData) {
      res.status(200).json({ success: true, data: getData });
    } else {
      res.status(500).json({ success: false, state: "Can not found!" });
    }
  } catch (err) {
    res.status(500).json({ success: false, state: "invalid ID" });
  }
};
