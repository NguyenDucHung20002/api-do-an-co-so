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
    res.status(500).json({ state: "invalid username" });
  }
};
