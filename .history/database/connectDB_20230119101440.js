const mongoose = require("mongoose");

const URL = process.env.DB_URL;

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("connect sucsess");
  })
  .catch(() => {
    console.log("connect fail");
  });
