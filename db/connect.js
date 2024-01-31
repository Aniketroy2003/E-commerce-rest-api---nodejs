const mongoose = require("mongoose");

// uri = "mongodb+srv://spacelover2003:LencNghYmRDKJeGt@newapi.lcmk04h.mongodb.net/newapi?retryWrites=true&w=majority";

const connectDB = (uri) => {
    console.log("-----db connected")
    return mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

module.exports = connectDB;