const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const Listing = require("./models/listing.js");
const methodOverride = require("method-override");

const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
const ejsmate = require("ejs-mate");

main().then(()=>{console.log("connected to db")}).catch(err=>{console.log(err)});
async function main(){
    await mongoose.connect(mongo_url);
}

const app = express();

const port = 3000;

app.listen(port, (req, res)=>{console.log(`listening to port 3000`)});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res)=>{
    res.send("working!");
});
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);




app.get("/listings", async (req, res)=>{
    const allListing = await Listing.find({});

    res.render("./listings/index.ejs", {allListing});
});

app.get("/listings/new", (req, res)=>{
    res.render("./listings/new.ejs");
});

app.get("/listings/:id/edit", async (req, res)=>{
    let {id} = req.params;
    
    const currListing = await Listing.findById(id);

    res.render("./listings/edit.ejs", {currListing});
});

app.get("/listings/:id", async (req, res)=>{
    let {id} = req.params;

    let listing = await Listing.findById(id);

    res.render("./listings/show.ejs", {listing});
})

app.post("/listings", async (req, res) => {

    const newListing = new Listing(req.body.listing);
    
    newListing.save().then(result=>{
        console.log(result);
        res.redirect("/listings");
    }).catch(err => {console.log(err);
        res.send("Failed to ADD");
    });

});

app.put("/listings/:id", async(req, res)=>{
    let {id} = req.params;
    let edited = req.body.listing;

    Listing.findByIdAndUpdate(id, edited, {new: true}).then(result => {
        console.log(result);
        res.redirect(`/listings/${id}`)})
        .catch(err=>{
        res.send(`Problem updating the listing : ${err}`);
    });
});


//Delete

app.delete("/listings/:id", async(req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id).then(res.redirect("/listings"));

});



