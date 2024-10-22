const { default: mongoose, Mongoose } = require("mongoose");
const { paginate, paginateArray } = require("../utils/pagination");
const model_Cart = require("../models/db").Cart;
const model_Products = require("../models/db").Products;



const countCartTotal = async (req) => {
    try {
        const { user_id } = (req.body);

        const cartDetails = await model_Cart.aggregate([
            {
                $match: { user_id: new mongoose.Types.ObjectId(user_id) } // Step 1: Match cart items for the given user_id
            },
            {
                $lookup: {
                    from: 'products', // Step 2: Join the products collection
                    localField: 'product_id',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            {
                $unwind: '$productDetails' // Step 3: Unwind the product details array
            },
            {
                $project: { // Step 4: Select only the necessary fields and calculate total price for each cart item
                    product_id: '$productDetails._id',
                    product_name: '$productDetails.product_name',
                    price: '$productDetails.price',
                    quantity: '$quantity',
                    total_price: { $multiply: ['$quantity', '$productDetails.price'] }
                }
            }
        ]);
        // Calculate the total cart amount (if needed)
        const totalCartAmount = cartDetails.reduce((sum, item) => sum + item.total_price, 0);
        // console.log(cartDetails, totalCartAmount);
        return { total: parseFloat(totalCartAmount.toFixed(2)), cartDetails: cartDetails }
    } catch (e) {
        return res.status(500).json({ message: "Error in counting total." });
    }
}


const getCartTotal = async (req, res) => {
    try {
        const { total, cartDetails } = await countCartTotal(req);
        const page = req.query.page || 1;
        const pageSize = 5;
        paginatedCartDetails = paginateArray(cartDetails, page, pageSize)
        return res.status(200).json({ message: "Total calculated sucessfully.", data: { total: total, cartDetails: paginatedCartDetails } })
    } catch (e) {
        return res.status(500).json({ message: "Error in viewing total." });
    }
}


const addProductToCart = async (req, res) => {
    try {
        const { user_id, product_id, quantity = 1 } = req.body;
        const checkProductData = await model_Products.findById(product_id);
        if (!checkProductData) {
            res.status(400).json({ message: "No product found." })
        }
        const addOrUpdateToCart = await model_Cart.findOneAndUpdate({ user_id, product_id },
            { $inc: { quantity: quantity } },
            { new: true, upsert: true }
        );
        const { total } = await countCartTotal(req);
        console.log(total);
        res.json({ message: "Product added to cart.", data: { "updated product in cart": addOrUpdateToCart, total: total } });
    } catch (e) {
        return res.status(500).json({ message: "Error adding product to cart." });
    }
}


const removeProductFromCart = async (req, res) => {
    try {
        const { user_id, product_id, quantity = 1, deleteProduct = false } = req.body;
        const checkProductInCart = await model_Cart.findOne({ product_id, user_id });
        let negatedQuantity = -quantity;
        if (deleteProduct) {
            negatedQuantity = -checkProductInCart.quantity;
        }
        console.log(negatedQuantity);
        if (!checkProductInCart) {
            return res.status(400).json({ message: "No such product found." })
        } else if (checkProductInCart.quantity < quantity) {
            return res.status(400).json({ message: "Product quantity can't go beyond 0." })
        } else {
            const updateCartItem = await model_Cart.findOneAndUpdate({ product_id, user_id },
                { $inc: { quantity: negatedQuantity } },
                { new: true }
            );
            if (updateCartItem.quantity == 0) {
                const deleteCartItem = await model_Cart.deleteOne({ product_id, user_id })
                return res.status(200).json({ message: "Product removed from cart completely" });
            }
            console.log(updateCartItem);
            const { total } = await countCartTotal(req);
            return res.status(200).json({ message: "Product quantity reduced", data: { "Updated product in cart": updateCartItem, total: total } })
        }
    } catch (e) {
        return res.status(500).json({ message: "Error in removing item from cart." });
    }
}


module.exports = {
    countCartTotal,
    getCartTotal,
    addProductToCart,
    removeProductFromCart,
}







/**
 try {
        const user_id = req.body.user_id;
        const cartItems = await model_Cart.find({ user_id });
        const productIds = cartItems.map(items => items.product_id);
        const products = await model_Products.find({ _id: { $in: productIds } });

        let totalCartAmount = 0;
        const cartDetails = cartItems.map(cartItem => {
            const product = products.find(p => p._id.toString() == cartItem.product_id)
            const totalPriceForProduct = product.price * cartItem.quantity;
            totalCartAmount += totalPriceForProduct;
            console.log("+ " + totalPriceForProduct + "  ( " + product.price + " * " + cartItem.quantity + " )");
            return {
                product_id: product.id,
                product_name: product.product_name,
                price: product.price,
                quantity: cartItem.quantity,
                total_price: totalPriceForProduct
            };
        });
        // console.log(" = " + totalCartAmount);
        return { total: parseFloat(totalCartAmount.toFixed(2)), cartDetails: cartDetails }
    }
 */