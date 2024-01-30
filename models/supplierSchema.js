const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema({

    supplierName: {
        type: String,
        required: true
    },
    phone:{
        type:Number,
        required:true
    },
    user:[{
        type: mongoose.Types.ObjectId,
        ref:"users"
    }],
    enteries:[{
        type:mongoose.Types.ObjectId,
        ref:"supplierEnteries",
    }]
    // transactions:[{
    //     type:mongoose.Types.ObjectId,
    //     ref:"transactions",
    // }]
   
});

const supplierdb = new mongoose.model("suppliers", SupplierSchema);

module.exports = supplierdb;