const router = require("express").Router();
const controller_users = require("../controllers/users")
const auth = require("../middlewares/auth")
const validate = require("../validations/users");
const rateLimit = require('express-rate-limit');


const rateLimiter = rateLimit({
    // windowMs: 1 * 24 * 60 * 60 * 1000, // 1 Day
    windowMs: 1 * 60 * 1000, // 10 minutes
    limit: 3,
    message: "You have exceeded the limit of API calls, limit will be refreshed in a minute",
})


router.use("/", rateLimiter)
router.post("/signup", validate.validateSignup, controller_users.signUpUser)
router.post("/login", validate.validateLogin, controller_users.loginUser)
router.get("/all", auth.check_token, auth.checkUserRole("admin"), controller_users.getAllUsers)
router.delete("/delete", auth.check_token, auth.checkUserRole("admin"), validate.validateDeleteUserByEmail, controller_users.deleteUserByEmail)
router.put("/update", auth.check_token, auth.checkUserRole("admin", "user"), validate.validateUpdateAddressOfUserByEmail, controller_users.updateAddressOfUserByEmail)

module.exports = router;

