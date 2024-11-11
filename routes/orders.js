const router = require("express").Router();
const controller_orders = require("../controllers/orders")
const auth = require("../middlewares/auth")
const validate = require("../validations/orders");
const rateLimit = require('express-rate-limit');


const rateLimiter = rateLimit({
    // windowMs: 1 * 24 * 60 * 60 * 1000, // 1 Day
    windowMs: 1 * 60 * 1000, // 10 minutes
    limit: 3,
    message: "You have exceeded the limit of API calls, limit will be refreshed in a minute",
})


router.use("/", rateLimiter)
router.post("/place", auth.check_token, auth.checkUserRole("user", "admin"), controller_orders.placeOrder)
router.get("/all", auth.check_token, auth.checkUserRole("user", "admin"), controller_orders.getAllOrders)
router.delete("/delete", auth.check_token, auth.checkUserRole("user", "admin"), validate.validateCheckOrderId, controller_orders.deleteOrder)
router.get("/getOrder", auth.check_token, auth.checkUserRole("user", "admin"), validate.validateCheckOrderId, controller_orders.getOrderById)

module.exports = router;
