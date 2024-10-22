const router = require("express").Router();
const controller_users = require("../controllers/users")
const auth = require("../middlewares/auth")
const validate = require("../validations/users");



router.post("/signup", validate.validateSignup, controller_users.signUpUser)
router.post("/login", validate.validateLogin, controller_users.loginUser)
router.get("/all", auth.check_token, auth.checkUserRole("admin"), controller_users.getAllUsers)
router.delete("/delete", auth.check_token, auth.checkUserRole("admin"), validate.validateDeleteUserByEmail, controller_users.deleteUserByEmail)
router.put("/update", auth.check_token, auth.checkUserRole("admin", "user"), validate.validateUpdateAddressOfUserByEmail, controller_users.updateAddressOfUserByEmail)

module.exports = router;

