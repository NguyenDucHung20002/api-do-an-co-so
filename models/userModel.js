const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: false,
    },

    password: {
      type: String,
      required: true,
    },
    admin: {
      type: Number,
      required: true,
    },
    carts: {
      type: Array,
      required: true,
    },

    likes: {
      type: Array,
      required: true,
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
