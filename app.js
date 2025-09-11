const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const Listing = require("./models/listing.js");
const methodOverride = require("method-override");

const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
const ejsmate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressErrors = require("./utils/ExpressErrors.js");

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



//Show All Listings
app.get("/listings", async (req, res)=>{
    const allListing = await Listing.find({});

    res.render("./listings/index.ejs", {allListing});
});

//Add new listing form
app.get("/listings/new", (req, res)=>{
    res.render("./listings/new.ejs");
});


//Edit Form
app.get("/listings/:id/edit",wrapAsync(async (req, res)=>{
    
        let {id} = req.params;
        const currListing = await Listing.findById(id);
        res.render("./listings/edit.ejs", {currListing});
    
}) );


//Show Listing
app.get("/listings/:id",wrapAsync(async (req, res)=>{

        let {id} = req.params;
        let listing = await Listing.findById(id);
        res.render("./listings/show.ejs", {listing});
    
}));

app.post("/listings",wrapAsync(async (req, res, next) => {

    if(!req.body.listing)throw new ExpressErrors(400, "Bad Request!");

        const newListing = new Listing(req.body.listing);
    
        await newListing.save();
        res.redirect("/listings");
}));

app.put("/listings/:id",wrapAsync(async(req, res)=>{
    if(!req.body.listing)throw new ExpressErrors(400, "Bad Request!");
    let {id} = req.params;
    let edited = req.body.listing;

    await Listing.findByIdAndUpdate(id, edited, {new: true})
    
        res.redirect(`/listings/${id}`)
    }));


app.delete("/listings/:id", wrapAsync(async(req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");

}) );

app.use((req, res, next) => {
    next(new ExpressErrors(404, "Page Not Found! Error 404"));
});


app.use((err, req, res, next)=>{
    let {statusCode=500, message="Something went wrong!"} = err;
    // res.status(statusCode).send(message);

    res.render("./errors/error.ejs", {statusCode, message});
});

app.listen(port, (req, res)=>{console.log(`listening to port 3000`)});
