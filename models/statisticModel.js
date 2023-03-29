const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const StatisticSchema = new Schema(
  {
    products: {
      type: Number,
    },
    revenue: {
      type: Number,
    },

    users: {
      type: Number,
    },

    websiteTraffic: {
      type: Number,
    },
    order: {
      type: Number,
    },
  },

  {
    timestamps: true,
    collection: "statistics",
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
  }
);

module.exports = mongoose.model("statistic", StatisticSchema);
