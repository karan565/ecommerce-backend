const router = require("express").Router();
const controller_products = require("../controllers/products");
const auth = require("../middlewares/auth");
const validate = require("../validations/products");



router.post("/add", auth.check_token, auth.checkUserRole("admin"), validate.validateCreateProduct, controller_products.createProduct)
router.get("/all", auth.check_token, controller_products.getAllProducts)
router.get("/getProduct", auth.check_token, validate.validateCheckProductId, controller_products.getProductById)
router.get("/category", auth.check_token, validate.validateGetProductsByCategory, controller_products.getProductsByCategory)
router.delete("/deleteProduct", auth.check_token, auth.checkUserRole("admin"), validate.validateCheckProductId, controller_products.deleteProductById)
router.put("/:product_id/updateQuantity", auth.check_token, auth.checkUserRole("admin"), validate.validateUpdateProductQuantityById, controller_products.updateProductQuantityById)

module.exports = router;

