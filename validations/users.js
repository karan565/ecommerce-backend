const Joi = require("joi");

const validateData = (data, schema) => {
    const { error, value } = schema.validate(data);
    if (error) {
        throw new Error(error.details.map((e) => e.message).join(','));
    }
    return value;
};

// Inputs : full_name, email, password, phone_no, address, role 
const signupSchema = Joi.object({
    full_name: Joi.string().required().min(2).max(50),
    email: Joi.string().email().required(),
    password: Joi.string().min(2).required(),
    phone_no: Joi.number().min(1000000000).max(9999999999).required(),
    address: Joi.string().required(),
    role: Joi.string().valid('admin', 'user').required(),
}).unknown(true);

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(2).required(),
}).unknown(true);

const deleteUserByEmailSchema = Joi.object({
    email: Joi.string().email().required(),
}).unknown(true);

const updateAddressOfUserByEmailSchema = Joi.object({
    email: Joi.string().email().required(),
    address: Joi.string().required(),
}).unknown(true);


module.exports = {
    validateSignup: (data) => validateData(data, signupSchema),
    validateLogin: (data) => validateData(data, loginSchema),
    validateDeleteUserByEmail: (data) => validateData(data, deleteUserByEmailSchema),
    validateUpdateAddressOfUserByEmail: (data) => validateData(data, updateAddressOfUserByEmailSchema),
}