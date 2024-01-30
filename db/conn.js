const mongoose = require("mongoose");

const DB = "mongodb+srv://Kritika:gnJnaVlkM5CpnBXl@cluster0.qbub6ym.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(DB,{
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(()=> console.log("DataBase Connected")).catch((errr)=>{
    console.log(errr);
})