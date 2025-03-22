const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];

            // Verify JWT Token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded Token:", decoded); // Log decoded token

            // Correcting the User ID field (use `decoded.id`)
            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                console.log("User not found in DB:", decoded.id); // Log missing user ID
                return res.status(401).json({ message: "Unauthorized: User not found" });
            }

            next();
        } catch (error) {
            console.log("JWT Error:", error.message); // Log JWT errors
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
    } else {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
};

module.exports = protect;
