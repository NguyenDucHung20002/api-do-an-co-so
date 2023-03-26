const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true,
    },
    username: {
      type: String,
      require: true,
      unique: false,
    },
    password: {
      type: String,
      require: true,
    },
    carts: {
      type: Array,
      require: true,
    },
  },

  {
    timestamps: true,
    collection: "users",
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
  }
);

module.exports = mongoose.model("user", UserSchema);
