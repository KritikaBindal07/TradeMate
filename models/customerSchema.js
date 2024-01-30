const mongoose = require("mongoose");
// const userdb = require("../models/userSchema");

const customerSchema = new mongoose.Schema({

    customerName: {
        type: String,
        required: true
    },
    user:[{
        type: mongoose.Types.ObjectId,
        ref:"users"
    }],
    transactions:[{
        type:mongoose.Types.ObjectId,
        ref:"transactions",
    }]
   
});

const customerdb = new mongoose.model("customers", customerSchema);

module.exports = customerdb;