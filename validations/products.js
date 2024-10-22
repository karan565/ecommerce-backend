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

// fields : product_name, description, brand, price, quantity, category
const createProductSchema = Joi.object({
    product_name: Joi.string().required().trim(),
    description: Joi.string().required().trim(),
    brand: Joi.string().required().trim(),
    price: Joi.number().positive().required(),
    category: Joi.string().required().trim(),
    quantity: Joi.number().integer().positive().required(),
}).unknown(true);

const checkProductIdSchema = Joi.object({
    product_id: Joi.string().alphanum().length(24).hex().required().trim(),
}).unknown(true);

const getProductsByCategorySchema = Joi.object({
    category: Joi.string().required().trim(),
}).unknown(true);

const updateProductQuantityByIdSchema = Joi.object({
    product_id: Joi.string().alphanum().length(24).hex().required().trim(),
    change: Joi.number().integer().required()
}).unknown(true);


module.exports = {
    validateCreateProduct: validateData(createProductSchema),
    validateCheckProductId: validateData(checkProductIdSchema),
    validateGetProductsByCategory: validateData(getProductsByCategorySchema),
    validateUpdateProductQuantityById: validateData(updateProductQuantityByIdSchema),
};