const router = require("express").Router();
const controller_misc = require("../controllers/misc")


router.get("/api", controller_misc.getAPI)
router.use("/", controller_misc.blankPage)

module.exports = router;