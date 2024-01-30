const mongoose = require("mongoose");
// const userdb = require("../models/userSchema");

const transactionSchema = new mongoose.Schema({
    Date: {
        type: Date,
        required: true
    },
    YouGot: {
        type: Number,
        required: true
    },
    YouGave: {
        type: Number,
        required: true
    },
    customer:[{
        type: mongoose.Types.ObjectId,
        ref:"customers"
    }],
});

const transactiondb = new mongoose.model("transactions", transactionSchema);

module.exports = transactiondb;