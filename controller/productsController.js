const Product = require("../models/productModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
exports.addProduct = async (req, res) => {
  try {
    const token = req.headers.authentication;

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
      const { name, img, imgBg, detail, state, price, rating } = req.body;
      const product = {
        name,
        img,
        imgBg,
        detail,
        state,
        price,
        rating,
        sold: 0,
      };
      await Product.create(product);
      const getAllProduct = await Product.find();

      res.status(200).json({
        success: true,
        data: getAllProduct,
      });
    } else {
      res.status(200).json({
        success: false,
        message: "Unauthorization",
      });
    }
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
    res.status(500).json({ state: "can't add product" });
  }
};

exports.getProduct = async (req, res) => {
  // const skip = req.query.skip ? Number(req.query.skip) : 0;
  const limit = req.query.limit ? Number(req.query.limit) : 0;
  let page = req.query.page ? Number(req.query.page) * limit - limit : 0;
  const name = req.headers.search;
  if (name) {
    // page = page + limit;
    try {
      const product = (await Product.find()).reverse();
      const findData = product.filter((val) => {
        return (
          val?.name.toLowerCase().includes(name.toLowerCase()) ||
          val?.price.toString() === name
        );
      });
      if (findData.length !== 0) {
        const getLinit = findData.slice(page, page + limit);

        return res.status(200).json({
          success: true,
          data: getLinit,
          length: findData.length,
        });
      } else {
        return res
          .status(200)
          .json({ success: false, state: "Input not found!" });
      }
    } catch (err) {
      res.status(500).json({ success: false, state: "Something wrong!" });
    }
  } else {
    try {
      const lengthALLProduct = await Product.count();
      const products = (await Product.find()).reverse();
      const productsPage = [...products.slice(page, page + limit)];
      res.status(200).json({
        success: true,
        data: productsPage,
        length: lengthALLProduct,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const token = req.headers.authentication;
    const page =
      req.headers.page && req.headers.page > 1
        ? (+req.headers.page - 1) * 6
        : 6;

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
      const getProduct = await Product.findByIdAndRemove(req.params.id);
      if (getProduct) {
        const getAllProduct = (await Product.find()).reverse();
        const getProductPage = [...getAllProduct.splice(0, page)];
        res.status(200).json({ success: true, data: getProductPage });
      } else {
        res.status(500).json({ success: false, state: "invalid ID" });
      }
    } else {
      res.status(200).json({
        success: false,
        message: "Unauthorization",
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, state: "invalid ID" });
  }
};

exports.countProduct = async (req, res) => {
  try {
    const products = await Product.count();
    res.status(200).json({ length: products });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getAProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.status(200).json({
        success: true,
        data: product,
      });
    } else {
      res.status(500).json({ success: false, state: "invalid ID" });
    }
  } catch (err) {
    res.status(500).json({ success: false, state: "invalid ID" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const token = req.headers.authentication;
    const page =
      req.headers.page && req.headers.page > 1
        ? (+req.headers.page - 1) * 6
        : 6;
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
      const getProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body
      );
      if (getProduct) {
        const getAllProduct = (await Product.find()).reverse();
        const getProductPage = [...getAllProduct.splice(0, page)];
        res.status(200).json({ success: true, data: getProductPage });
      } else {
        res.status(200).json({ success: false, state: "invalid ID" });
      }
    }
  } catch (err) {
    res.status(500).json({ success: false, state: "invalid ID" });
  }
};

exports.updateAllProduct = async (req, res) => {
  try {
    const getUpdate = await Product.updateMany({ rating: 4 });
    const getProduct = (await Product.find()).reverse();
    if (getProduct) {
      res.status(200).json({ success: true, data: getProduct });
    } else {
      res.status(500).json({ success: false, state: "invalid ID" });
    }
  } catch (err) {
    res.status(500).json({ success: false, state: "invalid ID" });
  }
};

exports.checkExistProduct = async (req, res) => {
  try {
    const token = req.headers.authentication;

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
      const carts = users.carts.map((val) => val._id);
      const getProduct = await Product.find({ _id: carts });
      const identify = getProduct.map((val) => `${val._id}`);
      let getCarts = [];
      identify.forEach((val) => {
        users.carts.forEach((cart) => {
          if (val === cart._id) {
            getCarts.push(cart);
          }
        });
      });
      res.status(200).json({ data: getCarts });
    }
  } catch (err) {
    res.status(500).json({ success: false, state: "invalid ID" });
  }
};

exports.updateSoldProduct = async (req, res) => {
  const sold = req.body;

  if (!sold || sold?.sold?.length === 0) {
    return res.status(200).json({ success: false });
  }
  sold.sold.forEach(async (val) => {
    const products = await Product.findById(val.id);
    const sold = products.sold + val.quantity;
    await Product.findByIdAndUpdate(val.id, { sold });
  });

  res.status(200).json({ success: true });
};
