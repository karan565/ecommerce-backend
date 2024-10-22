const Joi = require("joi");

const validateData = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ errors: error.details.map((e) => e.message.replace(/\"/g, "")).join(' ,') });
            // throw new Error(error.details.map((e) => e.message).join(','));
        }
        req.body = value;
        next();
    }
};

const checkOrderIdSchema = Joi.object({
    order_id: Joi.string().alphanum().length(24).hex().required().trim(),
}).unknown(true);


module.exports = {
    validateCheckOrderId: validateData(checkOrderIdSchema),
};