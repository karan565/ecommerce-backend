const Joi = require("joi");

const validateData = (data, schema) => {
    const { error, value } = schema.validate(data, { abortEarly: false });
    if (error) {
        throw new Error(error.details.map((e) => e.message).join(','));
    }
    return value;
};

// fields : product_name, description, brand, price, quantity, category
const createProductSchema = Joi.object({
    product_name: Joi.string().required(),
    description: Joi.string().required(),
    brand: Joi.string().required(),
    price: Joi.number().positive().required(),
    category: Joi.string().required(),
    quantity: Joi.number().integer().positive().required(),
}).unknown(true);

const checkProductIdSchema = Joi.object({
    product_id: Joi.string().alphanum().length(24).hex().required(),
}).unknown(true);

const getProductsByCategorySchema = Joi.object({
    category: Joi.string().required(),
}).unknown(true);

const updateProductQuantityByIdSchema = Joi.object({
    product_id: Joi.string().alphanum().length(24).hex().required(),
    change: Joi.number().integer().required()
}).unknown(true);


module.exports = {
    validateCreateProduct: (data) => validateData(data, createProductSchema),
    validateCheckProductId: (data) => validateData(data, checkProductIdSchema),
    validateGetProductsByCategory: (data) => validateData(data, getProductsByCategorySchema),
    validateUpdateProductQuantityById: (data) => validateData(data, updateProductQuantityByIdSchema)
};