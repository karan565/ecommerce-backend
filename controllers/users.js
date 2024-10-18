const { paginate } = require("../utils/pagination");
const jwt = require("jsonwebtoken");
const model_Users = require("../models/db").Users;
const validate = require("../validations/users");

require("dotenv").config();


const getUserDetails = async (req, res) => {
    try {
        const user_id = req.body.user_id;
        const userDetails = await model_Users.findById(user_id);
        return res.status(200).json({ message: "User data found.", data: { allUsers } })
    } catch (e) {
        return res.status(500).json({ message: "Error in getting user details." });
    }
}


const signUpUser = async (req, res) => {
    try {
        const { full_name, email, password, phone_no, address, role } = validate.validateSignup(req.body);
        const checkIfUserAlreadyExist = await model_Users.findOne({ email })
        if (checkIfUserAlreadyExist) {
            return res.status(400).json({ message: "User with email already exist." });
        }
        const userData = await model_Users.create({ full_name, email, password, phone_no, address, role });
        return res.status(200).json({ message: "User created successfully." });
    } catch (e) {
        return res.status(500).json({ message: "Error signing up user." });
    }
}


const loginUser = async (req, res) => {
    try {
        const { JWT_SECRET } = process.env;
        const { email, password } = validate.validateLogin(req.body);
        const checkIfUserExist = await model_Users.findOne({ email, password })
        if (checkIfUserExist) {
            const token = jwt.sign({
                id: checkIfUserExist.id,
                role: checkIfUserExist.role
            }, JWT_SECRET);
            return res.status(200).json({ message: "Login successfull.", data: { token } })
        }
        else {
            return res.status(400).json({ message: "Incorrect data." });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Error logging in." });
    }
}


const getAllUsers = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const pageSize = 5;
        const skip = paginate(page, pageSize)
        const allUsers = await model_Users.find().skip(skip).limit(pageSize);;
        if (allUsers.length > 0) {
            return res.status(200).json({ message: "Users data found.", data: { allUsers } })
        } else {
            return res.status(200).json({ message: "No users found." })
        }
    } catch (e) {
        return res.status(500).json({ message: "Error in getting all users." });
    }

}


const deleteUserByEmail = async (req, res) => {
    try {
        const { email } = validate.validateDeleteUserByEmail(req.body);
        const deletedData = await model_Users.deleteOne({ email })
        console.log(deletedData);
        if (deletedData.deletedCount == 0) {
            return res.status(400).json({ message: `No user found with the email id ${email}` })
        }
        else {
            return res.status(200).json({ message: "User deleted successfully" })
        }
    } catch (e) {
        return res.status(500).json({ message: "Error in deleting the user by email." });
    }
}


const updateAddressOfUserByEmail = async (req, res) => {
    try {
        const { email, address } = validate.validateUpdateAddressOfUserByEmail(req.body);
        const updatedData = await model_Users.updateOne({ email }, { address })
        if (!updatedData.acknowledged) {
            return res.status(400).json({ message: "No user found with the email id " + email + " ." })
        }
        else {
            return res.status(200).json({ message: "User address updated successfully" })
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Error in updating address of the user using by email." });
    }
}


module.exports = {
    signUpUser,
    loginUser,
    getAllUsers,
    deleteUserByEmail,
    updateAddressOfUserByEmail,
    getUserDetails,
}