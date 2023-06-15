const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const VerifySchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
  },

  {
    timestamps: true,
    collection: "verify-users",
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
  }
);

module.exports = mongoose.model("verify-user", VerifySchema);
