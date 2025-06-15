const express = require("express");
const mongoose = require("mongoose");
const eventRoute = require("./controller/eventRoute");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;

db.on("open", () => console.log("Connected to DB"));
db.on("error", (error) => console.log("Error occurred!", error));

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors());

app.use('/eventRoute', eventRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started at port ${port}.`);
});