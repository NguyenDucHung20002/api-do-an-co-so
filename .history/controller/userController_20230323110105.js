const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.register = async (req, res) => {
  const { email, username, password } = req.body;
  // User.create({
  //   username,
  //   password,
  // });
  const salt = await bcrypt.genSaltSync(12);
  hashedPassword = await bcrypt.hashSync(password, salt);
  console.log("hashedPassword:", hashedPassword);
  try {
    const user = new User({
      email,
      username,
      password: hashedPassword,
      carts: [],
      purchase: [],
      admin: 0,
    });
    await user.save();
    res.status(200).json({
      success: true,
      data: req.body,
    });
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
    console.log();
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: `${Object.keys(error.keyValue)} is already existed`,
      });
    }
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(500).json({
      success: false,
      message: "Invalid Input",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(500).json({
      success: false,
      message: "Invalid User",
    });
  }
  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.status(500).json({
      success: false,
      message: "Invalid User",
    });
  }
  const key = "afawrfaefgaiada";
  const token = await jwt.sign(
    {
      email: user.email,
      username: user.username,
    },
    key,
    {
      expiresIn: "1d",
    }
  );
  res.json({
    success: true,
    data: {
      idUser: user._id,
      email: user.email,
      username: user.username,
      carts: user.carts,
    },
    token,
  });
};

exports.changePassword = async (req, res) => {
  const { email, password, newPassword } = req.body;

  if (!email || !password) {
    return res.status(500).json({
      success: false,
      message: "Invalid Input",
    });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(500).json({
      success: false,
      message: "Invalid User",
    });
  }
  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.status(500).json({
      success: false,
      message: "Invalid User",
    });
  }
  const salt = await bcrypt.genSaltSync(12);
  hashedPassword = await bcrypt.hashSync(newPassword, salt);
  await user.update({ password: hashedPassword });
  res.json({
    success: true,
    data: {
      idUser: user._id,
      email: user.email,
      username: user.username,
    },
  });
};

exports.getAllUser = async (req, res) => {
  // const skip = req.query.skip ? Number(req.query.skip) : 0;
  const limit = req.query.limit ? Number(req.query.limit) : 0;
  const page = req.query.page ? Number(req.query.page) * limit - limit : 0;

  try {
    const users = await User.find().skip(page).limit(limit);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndRemove(req.params.id);
    res.status(200).json({ success: true });
    console.log("thanh cong");
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
exports.getCartUser = async (req, res) => {
  try {
    const token = req.headers.authentication;

    if (!token) {
      return res.status(200).json({
        success: false,
        message: "Unauthorization",
      });
    }
    const key = "afawrfaefgaiada";
    const user = jwt.verify(token, key);
    if (user) {
      const users = await User.findById(req.params.id);
      res.status(200).json({
        success: true,
        data: users.carts,
      });
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

exports.getPurchaseUser = async (req, res) => {
  try {
    const token = req.headers.authentication;

    if (!token) {
      return res.status(200).json({
        success: false,
        message: "Unauthorization",
      });
    }
    const key = "afawrfaefgaiada";
    const user = jwt.verify(token, key);
    if (user) {
      const users = await User.findById(req.params.id);
      res.status(200).json({
        success: true,
        data: users.purchase,
      });
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

exports.updateCartUser = async (req, res) => {
  try {
    const token = req.headers.authentication;

    if (!token) {
      return res.status(500).json({
        success: false,
        message: "Unauthorization",
      });
    }
    const key = "afawrfaefgaiada";
    const user = jwt.verify(token, key);
    console.log("user:", user);
    if (user) {
      await User.findByIdAndUpdate(req.params.id, req.body);
      const users = await User.findById(req.params.id);
      res.status(200).json({
        success: true,
        data: users.carts,
      });
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

exports.hello = (req, res) => {
  //   console.log(name, email, password);
  res.status(200).json({
    success: true,
    content: "hello",
  });
};
