const router = require("express").Router();
const controller_users = require("../controllers/users")
const auth = require("../middlewares/auth")


router.post("/signup", controller_users.signUpUser)
router.post("/login", controller_users.loginUser)
router.get("/all", auth.check_token, auth.checkUserRole("admin"), controller_users.getAllUsers)
router.delete("/delete", auth.check_token, auth.checkUserRole("admin"), controller_users.deleteUserByEmail)
router.put("/update", auth.check_token, auth.checkUserRole("admin", "user"), controller_users.updateAddressOfUserByEmail)

module.exports = router;

