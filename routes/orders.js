const router = require("express").Router();
const controller_orders = require("../controllers/orders")
const auth = require("../middlewares/auth")
const validate = require("../validations/orders");



router.post("/place", auth.check_token, auth.checkUserRole("user", "admin"), controller_orders.placeOrder)
router.get("/all", auth.check_token, auth.checkUserRole("user", "admin"), controller_orders.getAllOrders)
router.delete("/delete", auth.check_token, auth.checkUserRole("user", "admin"), validate.validateCheckOrderId, controller_orders.deleteOrder)
router.get("/getOrder", auth.check_token, auth.checkUserRole("user", "admin"), validate.validateCheckOrderId, controller_orders.getOrderById)

module.exports = router;
