const Product = require("../models/productModel");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const jwt = require("jsonwebtoken");

function authentication(req) {
  const token = req.headers.authentication;

  if (!token) {
    return res.status(200).json({
      success: false,
      message: "Unauthorization",
    });
  }
  const key = process.env.KEY;
  const user = jwt.verify(token, key);
  return user;
}

exports.addOrder = async (req, res) => {
  try {
    const user = authentication(req);
    console.log("user:", user);
    const users = await User.findOne({ email: user.email });

    if (users && users.admin === 0) {
      const {
        fullName,
        streetAddress,
        city,
        datetime,
        phone,
        email,
        orderId,
        total,
        products,
      } = req.body;
      const renameId = products.map((val) => {
        return {
          ProductId: val._id,
          imgBg: val.imgBg,
          name: val.name,
          price: val.price,
          state: val?.state,
          total: val.total,
          quantity: val.quantity,
        };
      });

      const order = new Order({
        userId: users._id,
        fullName,
        streetAddress,
        city,
        datetime,
        phone,
        email,
        orderId,
        total,
        products: renameId,
      });
      await order.save();
    } else {
      res.status(200).json({
        success: false,
        message: "Unauthorization",
      });
    }
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
    res.status(500).json({ state: "can't add" });
  }
};

exports.getUserOrder = async (req, res) => {
  try {
    const user = authentication(req);
    console.log("user:", user);
    const users = await User.findOne({ email: user.email });

    if (users) {
      const order = (await Order.find({ userId: users._id })).reverse();

      return res.status(200).json({
        success: true,
        data: order,
      });
    } else {
      return res.status(200).json({
        success: false,
      });
    }
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ state: "can't add" });
  }
};

exports.recentOrders = async (req, res) => {
  const limit = 6;
  const page = req.query.page ? Number(req.query.page) * limit - limit : 0;
  try {
    const user = authentication(req);
    const users = await User.findOne({ email: user.email });

    if (users && users.admin > 0) {
      const orders = (await Order.find()).reverse();
      const ordersPage = [...orders.slice(page, page + limit)];
      return res.status(200).json({
        success: true,
        data: ordersPage,
      });
    } else {
      return res.status(200).json({
        success: false,
      });
    }
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ state: "can't add" });
  }
};

exports.searchOrders = async (req, res) => {
  try {
    const limit = 6;
    const page = req.query.page ? Number(req.query.page) * limit - limit : 0;
    const orderId = req.headers.code;
    const date = req.query.dateTime;

    const user = authentication(req);
    const users = await User.findOne({ email: user.email });

    if (users && users.admin > 0) {
      const orders = (await Order.find()).reverse();
      let data = [];

      if (orderId) {
        // page = page + limit;
        data = orders.filter((val) => {
          return val?.orderId.toString() === orderId;
        });
      } else if (date) {
        data = orders.filter((val) => {
          return val?.datetime.toLowerCase().includes(date.toLowerCase());
        });
      } else {
        data = [...orders];
      }
      if (data.length !== 0) {
        const getLimit = data.slice(page, page + limit);

        return res.status(200).json({
          success: true,
          data: getLimit,
          length: data.length,
        });
      } else {
        return res
          .status(200)
          .json({ success: false, state: "Input not found!" });
      }
    } else {
      return res.status(200).json({
        success: false,
        message: "Unauthorization",
      });
    }
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ state: "can't add" });
  }
};
