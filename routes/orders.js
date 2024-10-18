const router = require("express").Router();
const controller_orders = require("../controllers/orders")
const auth = require("../middlewares/auth")


router.post("/place", auth.check_token, auth.checkUserRole("user", "admin"), controller_orders.placeOrder)
router.get("/all", auth.check_token, auth.checkUserRole("user", "admin"), controller_orders.getAllOrders)
router.delete("/delete", auth.check_token, auth.checkUserRole("user", "admin"), controller_orders.deleteOrder)
router.get("/:order_id", auth.check_token, auth.checkUserRole("user", "admin"), controller_orders.getOrderById)

module.exports = router;

