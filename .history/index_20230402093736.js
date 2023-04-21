const express = require("express");
require("dotenv").config();
var bodyParser = require("body-parser");
const cors = require("cors");
const user = require("./routes/user");
const product = require("./routes/product");
const statistic = require("./routes/statistic");
const { hello } = require("./test");
// connect DB
require("./database/connectDB");

const app = express();
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.use("/api", user);
app.use("/api", product);
app.use("/api", statistic);
app.get("/api.hello", hello);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`server is running on PORT ${PORT}`);
});
