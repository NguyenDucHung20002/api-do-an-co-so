const Product = require("../models/productModel");

exports.addProduct = async (req, res) => {
  const { name, img, imgBg, detail, state, price, rating } = req.body;
  try {
    const product = new Product({
      name,
      img,
      imgBg,
      detail,
      state,
      price,
      rating,
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
  const name = req.headers.search;
  if (name) {
    try {
      const product = await Product.find();
      const findData = product.filter((val) => {
        return val.name.toLowerCase().includes(name.toLowerCase());
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
      const products = await Product.find().skip(page).limit(limit);
      res.status(200).json({
        success: true,
        data: products,
        length: lengthALLProduct,
      });
    } catch (err) {
      res.status(500).json(err);
    }
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

    console.log(product);
  } catch (err) {
    res.status(500).json({ success: false, state: "invalid ID" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const getProduct = await Product.findByIdAndUpdate(req.params.id, req.body);
    if (getProduct) {
      res.status(200).json({ success: true });
    } else {
      res.status(500).json({ success: false, state: "invalid ID" });
    }
  } catch (err) {
    res.status(500).json({ success: false, state: "invalid ID" });
  }
};

exports.updateAllProduct = async (req, res) => {
  try {
    const getUpdate = await Product.updateMany({ rating: 5 });
    const getProduct = await Product.find();
    if (getProduct) {
      res.status(200).json({ success: true });
    } else {
      res.status(500).json({ success: false, state: "invalid ID" });
    }
  } catch (err) {
    res.status(500).json({ success: false, state: "invalid ID" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const getProduct = await Product.findByIdAndRemove(req.params.id);
    if (getProduct) {
      res.status(200).json({ success: true });
    } else {
      res.status(500).json({ success: false, state: "invalid ID" });
    }
  } catch (err) {
    res.status(500).json({ success: false, state: "invalid ID" });
  }
};
