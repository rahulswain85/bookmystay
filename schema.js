const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        country: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().required().min(0),
        
    }
    ).required()
});

module.exports.ratingSchema = Joi.object({
  comment: Joi.string().required(),
  ratings: Joi.number().required().min(1).max(5),
});
