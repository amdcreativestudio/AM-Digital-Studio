
// ========================================
// AM Digital Studio
// server.js
// Backend Server
// ========================================

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ========================================
// Middleware
// ========================================

app.use(cors());

app.use(express.json());

// ========================================
// Test Route
// ========================================

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "AM Digital Studio Backend is Running!"
    });

});

// ========================================
// Health Check
// ========================================

app.get("/api/health", (req, res) => {

    res.json({
        success: true,
        status: "OK",
        service: "AM Digital Studio Payment Backend"
    });

});

// ========================================
// Server
// ========================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `AM Digital Studio Backend running on port ${PORT}`
    );

});
