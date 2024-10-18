const model_Products = require("../models/db").Products;
const { paginate } = require("../utils/pagination");
const validate = require("../validations/products");


const createProduct = async (req, res) => {
    try {
        const { product_name, description, brand, price, quantity, category } = validate.validateCreateProduct(req.body);
        const seller_id = req.body.user_id;
        const checkIfProductAlreadyExist = await model_Products.findOne({ product_name, brand, price, seller_id });
        if (checkIfProductAlreadyExist) {
            return res.status(400).json({ message: "Product with such details already exist." });
        }
        const productData = await model_Products.create({ product_name, description, brand, price, quantity, category, seller_id });
        return res.status(200).json({ message: "Product added successfully." })
    } catch (e) {
        return res.status(500).json({ message: "Error adding product." });
    }
}


const getAllProducts = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const pageSize = 5;
        const skip = paginate(page, pageSize)

        const allProducts = await model_Products.find().skip(skip).limit(pageSize);
        if (allProducts.length > 0) {
            return res.status(200).json({ message: "Products' data found.", data: { allProducts } })
        } else {
            return res.status(200).json({ message: "No product found." })
        }
    } catch (e) {
        return res.status(500).json({ message: "Error getting all products." });
    }
}


const getProductById = async (req, res) => {
    try {
        const { product_id } = validate.validateCheckProductId(req.params);
        console.log(product_id);
        const productData = await model_Products.findOne({ _id: product_id })
        console.log(productData);
        if (!productData) {
            return res.status(400).json({ message: "No product found with id " + product_id + " ." })
        } else {
            return res.status(200).json({ message: "Product data found.", data: { productData } })
        }
    } catch (e) {
        return res.status(500).json({ message: "Error fetching product details." });
    }
}


const getProductsByCategory = async (req, res) => {
    try {
        const { category } = validate.getProductsByCategory(req.params);
        const page = req.query.page || 1;
        const pageSize = 5;
        const skip = paginate(page, pageSize)
        const productsAsPerCategory = await model_Products.find({ category }).skip(skip).limit(pageSize);;
        if (productsAsPerCategory.length > 0) {
            return res.status(200).json({ message: "Products found.", data: { Products: productsAsPerCategory } })
        } else {
            return res.status(400).json({ message: "No products found in " + category + " category." })
        }
    } catch (e) {
        return res.status(500).json({ message: "Error getting products by category." });
    }
}


const deleteProductById = async (req, res) => {
    try {
        const { product_id } = validate.validateCheckProductId(req.params);
        const deletedData = await model_Products.deleteOne({ _id: product_id });
        console.log(deletedData);
        if (deletedData.deletedCount == 0) {
            return res.status(400).json({ message: `No product found with the id ${email}.` })
        }
        else {
            return res.status(200).json({ message: "Product deleted successfully." })
        }
    } catch (e) {
        return res.status(500).json({ message: "Error deleting product by id." });
    }
}


const updateProductQuantityById = async (req, res) => {
    try {
        const { product_id, change } = validate.validateUpdateProductQuantityById(req.params);
        const oldProductData = await model_Products.findById(product_id);
        if (!oldProductData) {
            return res.status(400).json({ message: "No product found." })
        } else {
            const newQuantity = oldProductData.quantity + parseInt(change)
            if (newQuantity < 0) {
                return res.status(400).json({ message: "Product quantity can't be below 0." })
            } else {
                const updatedProductData = await model_Products.findByIdAndUpdate(product_id, { quantity: newQuantity })
                return res.status(200).json({ message: "Product quantity updated successfully." })
            }
        }
    } catch (e) {
        return res.status(500).json({ message: "Error in updating quantity of the product using by ID." });
    }
}


module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    getProductsByCategory,
    deleteProductById,
    updateProductQuantityById
}