const Statistic = require("../models/statisticModel");

exports.updateAllProduct = async (req, res) => {
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
