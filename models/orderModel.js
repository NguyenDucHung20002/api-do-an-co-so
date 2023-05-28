const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    userId: {
      type: String,
      require: true,
    },
    fullName: {
      type: String,
      require: true,
    },
    streetAddress: {
      type: String,
      require: true,
    },
    city: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    datetime: {
      type: String,
      require: true,
    },
    orderId: {
      type: String,
      require: true,
    },
    total: {
      type: Number,
      require: true,
    },
    status: {
      type: Number,
      require: true,
    },
    products: {
      type: Array,
      require: true,
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
