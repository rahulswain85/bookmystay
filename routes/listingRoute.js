const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");





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
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const currListing = await Listing.findById(id);
    res.render("./listings/edit.ejs", { currListing });
  })
);


//Show Listing
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({path:"reviews", populate:{path: "author"}}).populate("owner");
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
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("listings");
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isOwner,
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
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing)
    req.flash("success", "Deleted Successfully!");
    res.redirect("./");
  })
);


module.exports = router;