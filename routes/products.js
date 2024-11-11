const router = require("express").Router();
const controller_products = require("../controllers/products");
const auth = require("../middlewares/auth");
const validate = require("../validations/products");
const rateLimit = require('express-rate-limit');


const rateLimiter = rateLimit({
    // windowMs: 1 * 24 * 60 * 60 * 1000, // 1 Day
    windowMs: 1 * 60 * 1000, // 10 minutes
    limit: 3,
    message: "You have exceeded the limit of API calls, limit will be refreshed in a minute",
})


router.use("/", rateLimiter)
router.post("/add", auth.check_token, auth.checkUserRole("admin"), validate.validateCreateProduct, controller_products.createProduct)
router.get("/all", auth.check_token, controller_products.getAllProducts)
router.get("/getProduct", auth.check_token, validate.validateCheckProductId, controller_products.getProductById)
router.get("/category", auth.check_token, validate.validateGetProductsByCategory, controller_products.getProductsByCategory)
router.delete("/deleteProduct", auth.check_token, auth.checkUserRole("admin"), validate.validateCheckProductId, controller_products.deleteProductById)
router.put("/:product_id/updateQuantity", auth.check_token, auth.checkUserRole("admin"), validate.validateUpdateProductQuantityById, controller_products.updateProductQuantityById)

module.exports = router;

