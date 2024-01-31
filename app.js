require("dotenv").config();

const express = require("express");
const app = express()
const connectDB = require("./db/connect");
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5000;

const product_routes = require("./routes/products");


app.get("/", (req, res) => {

    res.send("Hi, I am live ");
});


// Middleware to parse JSON in the request body
app.use(bodyParser.json());


// middleware or to set router
app.use("/api", product_routes);

const start = async() => {
    try {
        await connectDB(process.env.MONGODB_URL);
        app.listen(PORT, () => {
           console.log(`${PORT} Yes I am connected`);
        })
    } catch (error){
        console.log(error);
    }
}
start();