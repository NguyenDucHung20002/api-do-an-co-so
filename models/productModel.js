const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    imgBg: {
      type: String,
      required: true,
    },
    detail: {
      type: Array,
    },
    rating: {
      type: Number,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      required: true,
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
