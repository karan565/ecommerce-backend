const router = require("express").Router();
const controller_cart = require("../controllers/cart")
const auth = require("../middlewares/auth")
const validate = require("../validations/cart");
const rateLimit = require('express-rate-limit');


const rateLimiter = rateLimit({
    // windowMs: 1 * 24 * 60 * 60 * 1000, // 1 Day
    windowMs: 1 * 60 * 1000, // 10 minutes
    limit: 3,
    message: "You have exceeded the limit of API calls, limit will be refreshed in a minute",
})


router.use("/", rateLimiter)// We can apply rate limiter like this in sll the api or it also can be applied separately in different apis. 
router.post("/add", auth.check_token, auth.checkUserRole("user", "admin"), validate.validateAddProductToCart, controller_cart.addProductToCart)
router.get("/total", auth.check_token, auth.checkUserRole("user", "admin"), controller_cart.getCartTotal)
router.delete("/delete", auth.check_token, auth.checkUserRole("user", "admin"), validate.validateRemoveProductFromCart, controller_cart.removeProductFromCart)

module.exports = router;

