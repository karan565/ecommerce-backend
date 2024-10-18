const router = require("express").Router();
const controller_cart = require("../controllers/cart")
const auth = require("../middlewares/auth")


router.get("/", controller_cart.trailCart)
router.post("/add", auth.check_token, auth.checkUserRole("user", "admin"), controller_cart.addProductToCart)
router.get("/total", auth.check_token, auth.checkUserRole("user", "admin"), controller_cart.getCartTotal)
router.delete("/delete", auth.check_token, auth.checkUserRole("user", "admin"), controller_cart.removeProductFromCart)
router.get("/getall", auth.check_token, auth.checkUserRole("user", "Admin"), controller_cart.trailCart)
router.put("/update", auth.check_token, auth.checkUserRole("user", "Admin"), controller_cart.trailCart)
module.exports = router;
