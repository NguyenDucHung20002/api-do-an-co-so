const express = require("express");
require("dotenv").config();
var bodyParser = require("body-parser");
const cors = require("cors");
const user = require("./routes/user");
const product = require("./routes/product");
// connect DB
require("./database/connectDB");

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.use("/api", product);
app.use("/api", user);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`server is running on PORT ${PORT}`);
});
