const mongoose = require("mongoose");

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
