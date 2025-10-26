const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Rating = require("../models/ratings.js");
const {
  validateRating,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");




//POST A REVIEW 
router.post("/",isLoggedIn, validateRating, wrapAsync(async(req, res)=>{
    let id = req.params.id;
    let {ratings, comment} = req.body;
    let review = new Rating({
        comment: comment, ratings: ratings
    });

    review.author = req.user._id;
    let listing = await Listing.findById(id);
    console.log(listing.reviews);
    listing.reviews.push(review);
    await review.save();
    console.log(review);
    
    await listing.save();

    req.flash("success", "Added Review!");
    
    res.redirect(`./`);
}));


//DELETE A REVIEW

router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(async(req, res)=>{
    let {id, reviewId} = req.params;

    await Rating.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: {reviews: reviewId}});
    req.flash("success", "Review Deleted!");
    res.redirect(`../`);
}))


module.exports = router;