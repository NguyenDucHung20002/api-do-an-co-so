const mongoose = require("mongoose");
require("dotenv").config();
const URL = process.env.DB_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(URL);
    console.log("DB connected");
  } catch (error) {
    console.log("Error ====");
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
