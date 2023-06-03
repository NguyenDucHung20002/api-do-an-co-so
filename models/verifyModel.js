const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const VerifySchema = new Schema(
  {
    email: {
      type: String,
      require: true,
    },
    username: {
      type: String,
      require: true,
    },

    password: {
      type: String,
      require: true,
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
