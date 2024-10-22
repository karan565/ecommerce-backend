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

const addProductToCartSchema = Joi.object({
    product_id: Joi.string().alphanum().length(24).hex().required().trim(),
    quantity: Joi.number().min(1).default(1)
}).unknown(true);

const removeProductFromCartSchema = Joi.object({
    product_id: Joi.string().alphanum().length(24).hex().required().trim(),
    quantity: Joi.number().min(1).default(1),
    deleteProduct: Joi.boolean().default(false)
}).unknown(true);


module.exports = {
    validateAddProductToCart: validateData(addProductToCartSchema),
    validateRemoveProductFromCart: validateData(removeProductFromCartSchema),
}