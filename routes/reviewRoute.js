const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Rating = require("../models/ratings.js");
const ExpressErrors = require("../utils/ExpressErrors.js");
const {ratingSchema} = require("../schema.js");


const validateRating = (req, res, next)=>{
     let {error} = ratingSchema.validate(req.body);
        console.log(error);
        if(error){
            throw new ExpressErrors(400, error)
        }
        else{
            next();
        }
}


//POST A REVIEW 
router.post("/",validateRating, wrapAsync(async(req, res)=>{
    let id = req.params.id;
    let {ratings, comment} = req.body;
    let review = new Rating({
        comment: comment, ratings: ratings
    });

    let listing = await Listing.findById(id);
    console.log(listing.reviews);
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    
    res.redirect(`./`);
}));


//DELETE A REVIEW

router.delete("/:reviewId", wrapAsync(async(req, res)=>{
    let {id, reviewId} = req.params;

    await Rating.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: {reviews: reviewId}});
    res.redirect(`../`);
}))


module.exports = router;