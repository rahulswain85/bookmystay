const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ratingsSchema = new Schema({
    comment: String,
    ratings:{
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

let Rating = mongoose.model("Rating", ratingsSchema);

module.exports = Rating;