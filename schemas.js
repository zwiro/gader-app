const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.postSchema = Joi.object({
    post: Joi.object({
        text: Joi.string().required(),
        date: Joi.date(),
        image: Joi.array().max(1)
    }).required(),
    deleteImage: Joi.array()
});

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        text: Joi.string().required(),
        date: Joi.date()
    }).required()
})

module.exports.userSchema = Joi.object({
    user: Joi.object({
        email: Joi.string().required(),
        image: Joi.array().max(1),
        location: Joi.string(),
        age: Joi.number(),
        firstName: Joi.string(),
        lastName: Joi.string()
    }).required(),
    deleteImage: Joi.array()
})

module.exports.updateUserSchema = Joi.object({
    user: Joi.object({
        image: Joi.array().max(1),
        location: Joi.string().allow(''),
        age: Joi.number().min(0).allow(''),
        firstname: Joi.string().allow(''),
        lastname: Joi.string().allow('')
    }),
    deleteImage: Joi.array()
})