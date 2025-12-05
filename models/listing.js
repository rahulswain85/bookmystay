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
        url: String,
        filename: String
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Rating"
        }
    ],

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing) await Rating.deleteMany({_id: {$in: listing.reviews}});
})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;