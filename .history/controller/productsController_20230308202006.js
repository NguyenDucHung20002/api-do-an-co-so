const Product = require("../models/productModel");

exports.addProduct = async (req, res) => {
  const { name, img, imgBg, state, price } = req.body;
  try {
    const product = new Product({
      name,
      img,
      imgBg,
      state,
      price,
    });
    await product.save();
    res.status(200).json({
      success: true,
      data: req.body,
    });
    console.log("data:", req.body);
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
    res.status(500).json({ state: "can't add product" });
  }
};

exports.getProduct = async (req, res) => {
  // const skip = req.query.skip ? Number(req.query.skip) : 0;
  const limit = req.query.limit ? Number(req.query.limit) : 0;
  const page = req.query.page ? Number(req.query.page) * limit - limit : 0;

  try {
    const products = await Product.find().skip(page).limit(limit);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.countProduct = async (req, res) => {
  try {
    const products = await Product.count();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getAProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json({
      success: true,
      data: product,
    });
    console.log(product);
  } catch (err) {
    res.status(500).json({ success: false, state: "invalid ID" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, state: "invalid ID" });
  }
};
