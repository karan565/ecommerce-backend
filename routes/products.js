const router = require("express").Router();
const controller_products = require("../controllers/products");
const auth = require("../middlewares/auth");


router.post("/add", auth.check_token, auth.checkUserRole("admin"), controller_products.createProduct)
router.get("/all", auth.check_token, controller_products.getAllProducts)
router.get("/:product_id", auth.check_token, controller_products.getProductById)
router.get("/category/:category", auth.check_token, controller_products.getProductsByCategory)
router.delete("/delete/:product_id", auth.check_token, auth.checkUserRole("admin"), controller_products.deleteProductById)
router.put("/:product_id/updateQuantity/:change", auth.check_token, auth.checkUserRole("admin"), controller_products.updateProductQuantityById)

module.exports = router;

