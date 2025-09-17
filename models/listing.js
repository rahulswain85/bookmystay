const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Rating = require("./ratings.js")

const listingSchema = new Schema({
    title: {
        type:String,
        required: true
    },
    description: String,
    image: {
        type: String,
        default: "https://images.unsplash.com/photo-1530076886461-ce58ea8abe24?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set: (v) => v === "" ? "https://images.unsplash.com/photo-1530076886461-ce58ea8abe24?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Rating"
        }
    ]
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing) await Rating.deleteMany({_id: {$in: listing.reviews}});
})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;