const User = require("../models/userModel");
const Verify = require("../models/verifyModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.register = async (req, res) => {
  const { email, username, password } = req.body;
  // User.create({
  //   username,
  //   password,
  // });

  try {
    const user = new User({
      email,
      username,
      password,
      carts: [],
      admin: 0,
      likes: [],
    });
    await user.save();
    await Verify.findOneAndDelete({ email });
    res.status(200).json({
      success: true,
      data: req.body,
    });
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: `${Object.keys(error.keyValue)} is already existed`,
      });
    }
  }
};

exports.verifyRegister = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    // User.create({
    //   username,
    //   password,
    // });
    const salt = await bcrypt.genSaltSync(12);
    const hashedPassword = await bcrypt.hashSync(password, salt);
    const isEmail = await Verify.findOneAndUpdate(
      { email },
      { email, username, password: hashedPassword }
    );
    if (isEmail) {
      return res.status(200).json({
        success: true,
        message: "Saved",
      });
    }
    const isUsername = await Verify.findOneAndUpdate(
      { username },
      { email, username, password: hashedPassword }
    );
    if (isUsername) {
      return res.status(200).json({
        success: true,
        message: "Saved",
      });
    }

    const user = new Verify({
      email,
      username,
      password: hashedPassword,
    });
    await user.save();
    res.status(200).json({
      success: true,
      message: "Saved",
    });
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: `${Object.keys(error.keyValue)} is already existed`,
      });
    }
  }
};

exports.getVerify = async (req, res) => {
  try {
    const email = req.params.email;
    const data = await Verify.findOne({ email });
    const filterData = {
      email: data.email,
      username: data.username,
      password: data.password,
    };
    console.log("data:", data);
    res.status(200).json({
      success: true,
      data: filterData,
    });
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: `${Object.keys(error.keyValue)} is already existed`,
      });
    }
  }
};

exports.checkExistUser = async (req, res) => {
  try {
    const { email, username } = req.body;

    if (!email || !username) {
      return res.status(500).json({
        success: false,
        message: "Invalid Input",
      });
    }
    const isEmail = await User.findOne({ email });
    const isUsername = await User.findOne({ username });

    if (isEmail) {
      return res.status(200).json({
        success: false,
        message: "Email already existed!",
      });
    }

    if (isUsername) {
      return res.status(200).json({
        success: false,
        message: "Username already existed!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User allowed!",
    });
  } catch (error) {
    res.status(500).json({ success: false, state: "invalid ID" });
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
  console.log("user:", user);
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
  const key = process.env.KEY;
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
    },
    carts: user.carts,
    purchase: user.purchase,
    token,
  });
};

exports.changePassword = async (req, res) => {
  try {
    const token = req.headers.authentication;
    const { password, newPassword } = req.body;

    if (!token) {
      return res.status(200).json({
        success: false,
        message: "Unauthorization",
      });
    }
    const key = process.env.KEY;
    const user = jwt.verify(token, key);
    if (!user) {
      return res.status(500).json({
        success: false,
        message: "Unauthorization",
      });
    }
    const email = user.email;
    const users = await User.findOne({ email });
    if (!users) {
      return res.status(500).json({
        success: false,
        message: "Invalid User",
      });
    }
    const isMatch = bcrypt.compareSync(password, users.password);
    console.log("isMatch:", isMatch);
    if (!isMatch) {
      return res.status(500).json({
        success: false,
        message: "Incorrect Password",
      });
    }

    const salt = await bcrypt.genSaltSync(12);
    const hashedPassword = await bcrypt.hashSync(newPassword, salt);
    await users.update({ password: hashedPassword });
    res.json({
      success: true,
      data: {
        idUser: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.log("error:", error);
  }
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

exports.getAUser = async (req, res) => {
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
    const email = user.email;
    if (user) {
      const users = await User.findOne({ email });
      res.status(200).json({
        success: true,
        data: users,
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
    const key = process.env.KEY;
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

exports.getLikeUser = async (req, res) => {
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
    if (user) {
      const users = await User.findById(req.params.id);
      res.status(200).json({
        success: true,
        data: users.likes,
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

exports.getUsers = async (req, res) => {
  const limit = 6;
  const page = req.query.page ? Number(req.query.page) * limit - limit : 0;
  const name = req.headers.search;

  if (name) {
    try {
      const users = (await User.find()).reverse();
      const findData = users.filter((val) => {
        return (
          val.username.toLowerCase().includes(name.trim().toLowerCase()) ||
          val.email.toLowerCase().includes(name.trim().toLowerCase()) ||
          val._id.toString() === name.trim()
        );
      });
      if (findData.length !== 0) {
        const ignoreAdmin = findData.filter((val) => val.admin === 0);
        const getLimit = ignoreAdmin.slice(page, page + limit);

        return res.status(200).json({
          success: true,
          data: getLimit,
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
      const users = (await User.find()).reverse();
      const ignoreAdmin = users.filter((val) => val.admin === 0);
      const usersPage = [...ignoreAdmin.slice(page, page + limit)];
      res.status(200).json({
        success: true,
        data: usersPage,
        length: usersPage.length,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
};

exports.checkAuthorization = async (req, res) => {
  try {
    const token = req.params.authentication;

    if (!token) {
      return res.status(200).json({
        success: false,
        message: "Unauthorization",
      });
    }
    const key = process.env.KEY;
    const user = jwt.verify(token, key);
    const email = user.email;
    if (user) {
      const users = await User.findOne({ email });
      res.status(200).json({
        success: true,
        data: users.admin,
      });
    } else {
      res.status(200).json({
        success: false,
        message: "Unauthorization",
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, state: "Unauthorization", err });
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
    const key = process.env.KEY;
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

exports.updatePurchaseUser = async (req, res) => {
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
    if (user) {
      const users = await User.findOne({ email: user.email });
      // const purchaseUser = await User.findById(req.params.id);
      const purchase = [...users.purchase, req.body];
      await User.findOneAndUpdate({ email: user.email }, { purchase });
      res.status(200).json({
        success: true,
        data: purchase,
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
    const key = process.env.KEY;
    const user = jwt.verify(token, key);
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

exports.updateLikeUser = async (req, res) => {
  try {
    const token = req.headers.authentication;

    if (!token) {
      return res.status(500).json({
        success: false,
        message: "Unauthorization",
      });
    }
    const key = process.env.KEY;
    const user = jwt.verify(token, key);
    if (user) {
      await User.findByIdAndUpdate(req.params.id, req.body);
      const users = await User.findById(req.params.id);
      res.status(200).json({
        success: true,
        data: users.likes,
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
