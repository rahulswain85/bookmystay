const Listing = require("./models/listing")
const Rating = require("./models/ratings.js");
const ExpressErrors = require("./utils/ExpressErrors.js");
const { listingSchema } = require("./schema.js");
const { ratingSchema } = require("./schema.js");
const multer = require("multer")

module.exports.isLoggedIn = (req, res, next) => {
  
  
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("failure", "You Must Be Logged In!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {

  if (req.session.redirectUrl) {
      res.locals.redirectUrl = req.session.redirectUrl;
  }
  next()
  
}


module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing.owner.equals(res.locals.currUser._id)) {
      req.flash("failure", "You are not a owner!");
      return res.redirect(`/listings/${id}`);
  }
  
  next();
}


module.exports.validateListing = (req, res, next)=>{
     let {error} = listingSchema.validate(req.body);
        console.log(error);
        if(error){
            throw new ExpressErrors(400, error)
        }
        else{
            next();
        }
}

module.exports.validateRating = (req, res, next)=>{
     let {error} = ratingSchema.validate(req.body);
        console.log(error);
        if(error){
            throw new ExpressErrors(400, error)
        }
        else{
            next();
        }
}

module.exports.isReviewAuthor = async (req, res, next) => {
  let { reviewId } = req.params;
  let rating = await Rating.findById(reviewId);

  if (!rating.author.equals(res.locals.currUser._id)) {
    req.flash("failure", "You are not a author!");
    return res.redirect(`/listings/${reviewId}`);
  }

  next();
};


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

module.exports.upload = multer({ storage });
