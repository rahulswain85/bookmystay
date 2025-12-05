const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Rating = require("../models/ratings.js");
const reviewController = require("../controllers/reviews.js");


const {
  validateRating,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");




//POST A REVIEW 
router.post("/",isLoggedIn, validateRating, wrapAsync(reviewController.postReview));


//DELETE A REVIEW

router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview))


module.exports = router;