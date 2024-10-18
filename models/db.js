const { type } = require("express/lib/response");
const mongoose = require("mongoose");
require("dotenv").config();

const { DATABASE_URL } = process.env;
if (!DATABASE_URL) {
    throw new Error("Database connection string is missing in environment variables");
}

async function connectToDatabase() {
    try {
        await mongoose.connect(DATABASE_URL);
        console.log("Successfully connected to the database");
    } catch (e) {
        console.error("Error connecting to database : ", error);
        //process.exit(1);
    }
}


connectToDatabase();


const usersSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensuring email is unique
    },
    password: {
        type: String,
        required: true
    },
    phone_no: {
        type: Number,
        match: /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/
    },
    address: {
        type: String,
        default: "Not provided"
    },
    role: {
        type: String,
        enum: ["user", "admin", "seller"],
        default: "user",
    }
}, { timestamps: true });

const productsSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: "-"
    },
    brand: {
        type: String,
        default: "-"
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        default: "-"
    },
    seller_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    }
}, { timestamps: true });

const cartSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    }
}, { timestamps: true })

const ordersSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    address: {
        type: String,
        required: true
    },
}, { timestamps: true })

const orderItemsSchema = new mongoose.Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Orders",
        required: true
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    }
})


const Users = mongoose.model("Users", usersSchema);
const Products = mongoose.model("Products", productsSchema);
const Cart = mongoose.model("Cart", cartSchema);
const Orders = mongoose.model("Orders", ordersSchema);
const OrderItems = mongoose.model("OrderItems", orderItemsSchema);

module.exports = {
    Users,
    Products,
    Cart,
    Orders,
    OrderItems,
}