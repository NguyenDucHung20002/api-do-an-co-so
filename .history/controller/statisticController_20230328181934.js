const Statistic = require("../models/statisticModel");

exports.addStatistic = async (req, res) => {
  try {
    const { products, revenue, users, websiteTraffic, order } = req.body;
    const statistic = new Statistic({
      products,
      revenue,
      users,
      websiteTraffic,
      order,
    });
    await statistic.save();
    res.status(200).json({
      success: true,
      data: req.body,
    });
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
