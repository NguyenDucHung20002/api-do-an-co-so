const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    streetAddress: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    datetime: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: Number,
      required: true,
    },
    products: {
      type: Array,
      required: true,
    },
  },

  {
    timestamps: true,
    collection: "orders",
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
  }
);

module.exports = mongoose.model("order", OrderSchema);
