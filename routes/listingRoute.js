const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const ExpressErrors = require("../utils/ExpressErrors.js");
const {listingSchema} = require("../schema.js");
const { isLoggedIn } = require("../middleware.js");


const validateListing = (req, res, next)=>{
     let {error} = listingSchema.validate(req.body);
        console.log(error);
        if(error){
            throw new ExpressErrors(400, error)
        }
        else{
            next();
        }
}


//Show All Listings
router.get("/", async (req, res)=>{
    const allListing = await Listing.find({});

    res.render("./listings/index.ejs", {allListing});
});

//Add new listing form
router.get("/new", isLoggedIn, (req, res) => {
    
    res.render("./listings/new.ejs");
});




//Edit Form
router.get("/:id/edit", isLoggedIn,wrapAsync(async (req, res)=>{
    
        let {id} = req.params;
        const currListing = await Listing.findById(id);
        res.render("./listings/edit.ejs", {currListing});
    
}) );


//Show Listing
router.get(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      req.flash("failure", "Listing not found");
      res.redirect("/listings");
    } else {
      res.render("./listings/show.ejs", { listing });
    }
  })
);

router.post(
  "/",
  validateListing,
  isLoggedIn,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("listings");
  })
);

router.put(
  "/:id",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let edited = req.body.listing;

    await Listing.findByIdAndUpdate(id, edited, { new: true });

    res.redirect(`${id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Deleted Successfully!");
    res.redirect("./");
  })
);


module.exports = router;