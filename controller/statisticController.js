const Statistic = require("../models/statisticModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const jwt = require("jsonwebtoken");

function monthId() {
  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const d = new Date();
  const getMonth = month[d.getMonth()];
  const getYear = d.getFullYear();
  const monthTime = getMonth + getYear;
  return monthTime;
}

exports.addStatistic = async (req, res) => {
  try {
    const { revenue, month, websiteTraffic, order } = req.body;
    const statistic = new Statistic({
      month,
      revenue,
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
  const token = req.headers.authentication;
  try {
    if (!token) {
      return res.status(200).json({
        success: false,
        message: "Unauthorization",
      });
    }
    const key = process.env.KEY;
    const user = jwt.verify(token, key);
    const users = await User.findOne({ email: user.email });

    if (users && users.admin > 0) {
      const productQuantity = await Product.find();
      const userMember = await User.find({ admin: 0 });
      const month = monthId();
      const others = await Statistic.findOne({ month: month });
      if (others) {
        const statistical = {
          users: userMember.length,
          products: productQuantity.length,
          monthId: others.month,
          revenue: others.revenue,
          websiteTraffic: others.websiteTraffic,
          order: others.order,
        };
        res.status(200).json({
          success: true,
          data: statistical,
        });
      } else {
        const statistic = {
          month: month,
          revenue: 0,
          websiteTraffic: 0,
          order: 0,
        };
        await Statistic.create(statistic);
        const statistical = {
          users: userMember.length,
          products: productQuantity.length,
          monthId: month,
          revenue: 0,
          websiteTraffic: 0,
          order: 0,
        };
        res.status(200).json({
          success: true,
          data: statistical,
        });
      }
    }
  } catch (err) {
    console.log("err:", err);
    res.status(200).json({
      success: false,
      message: "Error message",
    });
  }
};

exports.statisticsRevenueMonth = async (req, res) => {
  const token = req.headers.authentication;
  try {
    if (!token) {
      return res.status(200).json({
        success: false,
        message: "Unauthorization",
      });
    }
    const key = process.env.KEY;
    const user = jwt.verify(token, key);
    const users = await User.findOne({ email: user.email });

    if (users && users.admin > 0) {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const d = new Date();

      const statistics = await Statistic.find();
      const revenue = months.map((val) => {
        const month = val + d.getFullYear();
        const getStatistic = statistics.filter((val) => month === val.month);
        if (getStatistic[0]?.revenue) {
          return getStatistic[0]?.revenue;
        } else {
          return 0;
        }
      });

      res.status(200).json({
        success: true,
        data: revenue,
      });
    }
  } catch (err) {
    console.log("err:", err);
    res.status(200).json({
      success: false,
      message: "Error message",
    });
  }
};

exports.bestSelling = async (req, res) => {
  const token = req.headers.authentication;
  const limit = req.query.limit ? Number(req.query.limit) : 0;
  const page = req.query.page ? Number(req.query.page) * limit - limit : 0;
  try {
    if (!token) {
      return res.status(200).json({
        success: false,
        message: "Unauthorization",
      });
    }
    const key = process.env.KEY;
    const user = jwt.verify(token, key);
    const users = await User.findOne({ email: user.email });

    if (users && users.admin > 0) {
      const statistics = await Product.find();
      statistics.sort((a, b) => b.sold - a.sold);
      const productsPage = [...statistics.slice(page, page + limit)];
      res.status(200).json({
        success: true,
        data: productsPage,
      });
    }
  } catch (err) {
    console.log("err:", err);
    res.status(200).json({
      success: false,
      message: "Error message",
    });
  }
};

exports.updateStatistic = async (req, res) => {
  const token = req.headers.authentication;
  try {
    if (!token) {
      return res.status(200).json({
        success: false,
        message: "Unauthorization",
      });
    }
    const key = process.env.KEY;
    const user = jwt.verify(token, key);
    const users = await User.findOne({ email: user.email });

    if (users) {
      const monthTime = monthId();
      // const monthTime = "Mar2023";

      const statistic = await Statistic.findOne({ month: monthTime });
      if (!statistic) {
        const { revenue, websiteTraffic, order } = req.body;
        const statistic = {
          month: monthTime,
          revenue: revenue || 0,
          websiteTraffic: websiteTraffic || 0,
          order: order || 0,
        };
        await Statistic.create(statistic);
        return res.status(200).json({ success: true, data: statistic });
      } else {
        const {
          revenue: getRevenue,
          websiteTraffic: getWebsiteTraffic,
          order: getOrder,
        } = req.body;
        const updateStatistic = {
          revenue: getRevenue
            ? statistic.revenue + getRevenue
            : statistic.revenue,
          websiteTraffic: getWebsiteTraffic
            ? statistic.websiteTraffic + getWebsiteTraffic
            : statistic.websiteTraffic,
          order: getOrder ? statistic.order + getOrder : statistic.order,
        };

        await Statistic.findOneAndUpdate({ month: monthTime }, updateStatistic);
        return res.status(200).json({ success: true, data: statistic });
      }
    } else {
      return res.status(200).json({
        success: false,
        message: "Unauthorization",
      });
    }
  } catch (err) {
    console.log("err:", err);
    res.status(500).json({ success: false, state: "invalid ID" });
  }
};
