const Listing = require("../models/listing.js");
const ExpressErrors = require("../utils/ExpressErrors.js");
const {uploadOnCloudinary} = require("../cloudConfig.js")


module.exports.index = async (req, res)=>{
    const allListing = await Listing.find({});

    res.render("./listings/index.ejs", {allListing});
}

module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("failure", "Listing not found");
    res.redirect("/listings");
  } else {
    res.render("./listings/show.ejs", { listing });
  }
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const currListing = await Listing.findById(id);
  let originalImageUrl = currListing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("./listings/edit.ejs", { currListing, originalImageUrl });

  
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let edited = req.body.listing;
  let updatedListing = await Listing.findByIdAndUpdate(id, edited, { new: true });

  if (typeof req.file !== "undefined") {
    console.log("Recived Updated File")
    console.log(req.file)
    const localFilePath = req.file.path;
    const response = await uploadOnCloudinary(localFilePath);
    updatedListing.image = {
      url: response.secure_url,
      filename: response.public_id,
    };
    await updatedListing.save();
  }
  req.flash("success", "Listing Updated Successfully!");
  res.redirect(`${id}`);
};


module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Deleted Successfully!");
  res.redirect("./");
};


module.exports.createListing = async (req, res, next) => {
  
  if (!req.file) {
    req.flash("failure", "Listing image is required!");
    // return res.redirect("/listings/new");
  }

  const localFilePath = req.file.path;
  const response = await uploadOnCloudinary(localFilePath);

  if (!response) {
    req.flash("failure", "Failed to upload image to Cloudinary");
    // return res.redirect("/listings/new");
    console.log("response not availale");
  }
  else {
    console.log(response)
}
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  newListing.image = {
    url: response.secure_url,
    filename: response.public_id,
  };
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};