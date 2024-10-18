const model_Cart = require("../models/db").Cart;
const model_Products = require("../models/db").Products;
const model_Orders = require("../models/db").Orders;
const model_OrderItems = require("../models/db").OrderItems;
const { status } = require("express/lib/response");
const { countCartTotal } = require("./cart");
const { getUserDetails } = require("./users");
const { default: mongoose } = require("mongoose");
const { paginate } = require("../utils/pagination");
const validate = require("../validations/orders");


const placeOrder = async (req, res) => {
    try {
        const user_id = req.body.user_id;
        const session = await mongoose.startSession();
        session.startTransaction();

        // 1. Fetch cart data
        const cartData = await countCartTotal(req);
        const cartItems = cartData.cartDetails;
        const cartTotal = cartData.total;

        if (cartItems.length <= 0 && cartTotal <= 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Add items to cart" });
        }

        // 2. Check if products have sufficient stock
        const productIds = cartItems.map(item => item.product_id);
        const products = await model_Products.find({ _id: { $in: productIds } }).session(session);

        // Check if all products have enough quantity
        for (const cartItem of cartItems) {
            const product = products.find(p => p._id.toString() == cartItem.product_id);
            console.log(product);
            if (!product || product.quantity < cartItem.quantity) {
                // If any product does not have sufficient quantity, abort the transaction
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: "Insufficient stock for product: " + cartItem.product_name });
            }
        }

        // 3. Deduct product quantities
        for (const cartItem of cartItems) {
            await model_Products.updateOne(
                { _id: cartItem.product_id },
                { $inc: { quantity: -cartItem.quantity } },
                { session } // Use the session to make sure it's part of the transaction
            );
        }

        // 4. Fetch user details
        const userDetails = await getUserDetails(user_id);
        const user_address = userDetails.address;

        // 5. Create order
        const orderData = await model_Orders.create([{
            user_id,
            amount: cartTotal,
            address: user_address
        }], { session }); // Create order inside the transaction
        const order_id = orderData[0]._id;

        // 6. Insert order items
        const orderItems = cartItems.map(cartItem => {
            return {
                order_id: order_id,
                product_id: cartItem.product_id,
                quantity: cartItem.quantity,
                amount: cartItem.total_price
            };
        });
        await model_OrderItems.insertMany(orderItems, { session }); // Insert order items inside the transaction

        // 7. Empty cart
        await model_Cart.deleteMany({ user_id }, { session }); // Empty cart inside the transaction

        // 8. Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({ message: "Order placed successfully", data: { order_items: cartItems } });

    } catch (error) {
        // Abort transaction in case of error
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ message: "Error placing order" });
    }
}


const getAllOrders = async (req, res) => {
    try {
        const { user_id, user_role } = req.body;
        const page = req.query.page || 1;
        const pageSize = 5;
        const skip = paginate(page, pageSize)
        let allOrders = [];
        if (user_role === "admin") {
            allOrders = await model_Orders.find().skip(skip).limit(pageSize);;
        } else {
            allOrders = await model_Orders.find({ user_id }).skip(skip).limit(pageSize);;
        }
        console.log(allOrders);
        if (allOrders.length == 0) {
            return res.status(400).json({ message: "No orders found." })
        }
        return res.status(200).json({ message: "Orders found", data: { allOrders } })
    } catch (e) {
        return res.status(500).json({ message: "Error getting all orders" });
    }
}


const getOrderById = async (req, res) => {
    try {
        const { order_id } = validate.validateCheckOrderId(req.params);
        const { user_id, user_role } = req.body;
        let orderData = [];
        if (user_role === "admin") {
            orderData = await model_Orders.findOne({ _id: order_id });
        } else {
            orderData = await model_Orders.find({ _id: order_id, user_id });
        }
        if (orderData.length == 0) {
            return res.status(400).json({ message: "No order found." })
        }
        return res.status(200).json({ message: "Order found", data: { orderData } })
    } catch (e) {
        return res.status(500).json({ message: "Error getting that particular order." });
    }
}


const deleteOrder = async (req, res) => {
    try {
        const { order_id } = validate.validateCheckOrderId(req.body);
        const { user_id, user_role } = req.body;
        let isVerifiedOrder = null;
        if (user_role === "user") {
            isVerifiedOrder = await model_Orders.findOne({ user_id, _id: order_id });
        } else {
            isVerifiedOrder = await model_Orders.findOne({ _id: order_id });
        }
        console.log(isVerifiedOrder);
        if (!isVerifiedOrder) {
            return res.status(400).json({ message: "No order found." })
        }

        const session = await mongoose.startSession();
        console.log(order_id);
        session.startTransaction();

        const orderItems = await model_OrderItems.find({ order_id });
        for (const orderItem of orderItems) {
            await model_Products.updateOne(
                { _id: orderItem.product_id },
                { $inc: { quantity: orderItem.quantity } },
                { session } // Use the session to make sure it's part of the transaction
            );
        }
        await model_OrderItems.deleteMany({ order_id }, { session });
        await model_Orders.deleteOne({ _id: order_id }, { session });
        console.log(orderItems);
        await session.commitTransaction();
        session.endSession();
        return res.status(200).json({ message: "Order with id " + order_id + " deleted successfully." })
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Error in deleting order" });
    }
}


module.exports = {
    placeOrder,
    getAllOrders,
    getOrderById,
    deleteOrder,
}
