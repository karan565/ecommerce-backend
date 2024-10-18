const mongoose = require("mongoose");
const { DATABASE_URL } = process.env; // Replace with your actual database URL
require("dotenv").config();

async function connectToDatabase(req, res, next) {
    try {
        await mongoose.connect(DATABASE_URL);
        console.log("Successfully connected to the database");
        next(); // Proceed to the next middleware/route handler
    } catch (error) {
        console.error("Error connecting to the database.");
        res.status(500).send("Database connection error");
    }
}

async function disconnectFromDatabase(req, res, next) {
    res.on("finish", async () => {
        try {
            await mongoose.disconnect();
            console.log("Successfully disconnected from the database");
        } catch (error) {
            console.error("Error disconnecting from the database.");
        }
    });
    next();
}

module.exports = {
    connectToDatabase,
    disconnectFromDatabase,
}
