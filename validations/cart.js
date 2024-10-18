const Joi = require("joi");

const validateData = (data, schema) => {
    const { error, value } = schema.validate(data, { abortEarly: false });
    if (error) {
        throw new Error(error.details.map((e) => e.message).join(','));
    }
    return value;
};

const addProductToCartSchema = Joi.object({
    product_id: Joi.string().alphanum().length(24).hex().required(),
    quantity: Joi.number().min(1).default(1)
}).unknown(true);

const removeProductFromCartSchema = Joi.object({
    product_id: Joi.string().alphanum().length(24).hex().required(),
    quantity: Joi.number().min(1).default(1),
    deleteProduct: Joi.boolean().default(false)
}).unknown(true);


module.exports = {
    validateAddProductToCart: (data) => validateData(data, validateaddProductToCart),
    validateRemoveProductFromCart: (data) => validateData(data, validateRemoveProductFromCart)
}

