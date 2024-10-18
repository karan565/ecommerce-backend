const Joi = require("joi");

const validateData = (data, schema) => {
    const { error, value } = schema.validate(data, { abortEarly: false });
    if (error) {
        throw new Error(error.details.map((e) => e.message).join(','));
    }
    return value;
};

const checkOrderIdSchema = Joi.object({
    order_id: Joi.string().alphanum().length(24).hex().required(),
}).unknown(true);


module.exports = {
    validateCheckOrderId: (data) => validateData(data, checkOrderIdSchema),
};