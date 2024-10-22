const router = require("express").Router();
const controller_cart = require("../controllers/cart")
const auth = require("../middlewares/auth")
const validate = require("../validations/cart");


router.post("/add", auth.check_token, auth.checkUserRole("user", "admin"), validate.validateAddProductToCart,controller_cart.addProductToCart)
router.get("/total", auth.check_token, auth.checkUserRole("user", "admin"),controller_cart.getCartTotal)
router.delete("/delete", auth.check_token, auth.checkUserRole("user", "admin"), validate.validateRemoveProductFromCart,controller_cart.removeProductFromCart)

module.exports = router;

