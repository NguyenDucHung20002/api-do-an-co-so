const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    img: {
      type: String,
      require: true,
    },
    imgBg: {
      type: String,
      require: true,
    },
    detail: {
      type: Array,
    },
    stars: {
      type: Number,
    },
    state: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
  },

  {
    timestamps: true,
    collection: "products",
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
  }
);

module.exports = mongoose.model("product", ProductSchema);
