const router = require("express").Router();
const controller_misc = require("../controllers/misc")
const rateLimit = require('express-rate-limit');


const rateLimiter = rateLimit({
    // windowMs: 1 * 24 * 60 * 60 * 1000, // 1 Day
    windowMs: 1 * 60 * 1000, // 10 minutes
    limit: 3,
    message: "You have exceeded the limit of API calls, limit will be refreshed in a minute",
})


router.use("/", rateLimiter)
router.get("/api", controller_misc.getAPI)
router.use("/", controller_misc.blankPage)

module.exports = router;