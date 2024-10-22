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

// Inputs : full_name, email, password, phone_no, address, role 
const signupSchema = Joi.object({
    full_name: Joi.string().required().min(2).max(50).trim(),
    email: Joi.string().email().required(),
    password: Joi.string().min(2).required().trim(),
    phone_no: Joi.number().min(1000000000).max(9999999999).required(),
    address: Joi.string().required().trim(),
    role: Joi.string().valid('admin', 'user').required(),
}).unknown(true);

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(2).required().trim(),
}).unknown(true);

const deleteUserByEmailSchema = Joi.object({
    email: Joi.string().email().required(),
}).unknown(true);

const updateAddressOfUserByEmailSchema = Joi.object({
    email: Joi.string().email().required(),
    address: Joi.string().required().trim(),
}).unknown(true);


module.exports = {
    validateSignup: validateData(signupSchema),
    validateLogin: validateData(loginSchema),
    validateDeleteUserByEmail: validateData(deleteUserByEmailSchema),
    validateUpdateAddressOfUserByEmail: validateData(updateAddressOfUserByEmailSchema),
}