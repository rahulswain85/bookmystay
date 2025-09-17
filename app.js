const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
const ejsmate = require("ejs-mate");
const ExpressErrors = require("./utils/ExpressErrors.js");
const listingRoute = require("./routes/listingRoute.js");
const reviewRoute = require("./routes/reviewRoute.js");


main().then(()=>{console.log("connected to db")}).catch(err=>{console.log(err)});

async function main(){
    await mongoose.connect(mongo_url);
}

const app = express();

const port = 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res)=>{
    res.send("working!");
});
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);


app.use("/listings", listingRoute);

app.use("/listings/:id/reviews", reviewRoute)

app.use((req, res, next) => {
    next(new ExpressErrors(404, "Page Not Found! Error 404"));
});


app.use((err, req, res, next)=>{
    let {statusCode=500, message="Something went wrong!"} = err;
    res.render("./errors/error.ejs", {statusCode, message});
});

app.listen(port, (req, res)=>{console.log(`listening to port 3000`)});
