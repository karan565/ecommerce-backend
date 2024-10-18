const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;


const check_token = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(400).json({ message: "Access Denied. Please login." });
    }
    try {
        const userDetails = jwt.verify(token, JWT_SECRET);
        req.body.user_id = userDetails.id;
        req.body.user_role = userDetails.role;
        next();
    } catch (e) {
        return res.status(500).json({ message: "Internal server error." });
    }
}

const checkUserRole = (...roles) => (req, res, next) => {
    const role = req.body.user_role
    if (roles.includes(role)) {
        next();
    } else {
        return res.status(400).json({ message: "Access forbidden" });
    }
}

module.exports = {
    check_token,
    checkUserRole
}
