const mongoose = require("mongoose");

const transectionSchema = new mongoose.Schema(
  {
    product: {
      type: String,
    },
    quantity: {
      type: String,
    },
    amount: {
      type: String,
      required: [true, "amount is required"],
    },
    status: {
      type: String,
      required: [true, "type is required"],
    },
    category: {
      type: String,
      requires: [true, "cat is required"],
    },
    date: {
      type: Date,
      required: [true, "data is required"],
    },
    description:{
      type: String,
    },
    invoice: {
      type: String,
    },
  },
  { timestamps: true }
);

const transectionModel = mongoose.model("transections", transectionSchema);
module.exports = transectionModel;
