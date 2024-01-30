const mongoose = require("mongoose");
// const userdb = require("../models/userSchema");

const supplierEnteriesSchema = new mongoose.Schema({
    Date: {
        type: Date,
        required: true
    },
    Item: {
        type: String,
        required: true
    },
    Unit: {
        type: Number,
        required: true
    },
    supplier:[{
        type: mongoose.Types.ObjectId,
        ref:"suppliers"
    }],
});

const supplierEnteriesdb = new mongoose.model("supplierEnteries", supplierEnteriesSchema);

module.exports = supplierEnteriesdb;