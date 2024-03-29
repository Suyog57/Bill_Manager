const transectionModel = require("../models/transectionModel");
const moment = require("moment");

const getAllTransection = async (req, res) => {
  try {

    const { frequency, selectedDate, status } = req.body;
    const query = {};

    if (frequency !== "custom") {
      query.date = {
        $gt: moment().subtract(Number(frequency), "d").toDate(),
      };
    } else {
      query.date = {
        $gte: selectedDate[0],
        $lte: selectedDate[1],
      };
    }

    if (status === "paid") {
      query.status = "paid";
    } else if (status === "unpaid") {
      query.status = "unpaid";
    }

    const transections = await transectionModel.find(query);

    res.status(200).json(transections);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const deleteTransection = async (req, res) => {
  try {
    await transectionModel.findOneAndDelete({ _id: req.body.transacationId });
    res.status(200).send("Transaction Deleted!");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const editTransection = async (req, res) => {
  try {
    await transectionModel.findOneAndUpdate(
      { _id: req.body.transacationId },
      req.body.payload
    );
    res.status(200).send("Edit Successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const addTransection = async (req, res) => {
  console.log("I am request body", req.body);
  try {
    const newTransection = new transectionModel(req.body);
    await newTransection.save();
    res.status(201).json({ message: "Transaction Created" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  getAllTransection,
  addTransection,
  editTransection,
  deleteTransection,
};
