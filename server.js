//Bring in dependencies
const express = require("express");
const logger = require("morgan");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
//Set the port
const PORT = process.env.PORT || 8000;

//Initiate express
const app = express();
app.use(logger("dev"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("public"));

//Set handlebars as the view engine
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

//Connect to MONGODB
let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsScraper";
mongoose.connect(MONGODB_URI, {useNewUrlParser:true});

//Bring in the routes
const routes = require("./routes/routes")
app.use(routes);

//Fire off the port
app.listen(PORT, () => {
    console.log("Magic is happening at http://localhost:" + PORT)
});

