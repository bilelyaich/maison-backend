const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();

const app = express();

// CORS FIX COMPLET
const allowedOrigins = [
"http://localhost:3000",
"https://maison-frontend-5att.vercel.app"
];

app.use((req, res, next) => {
const origin = req.headers.origin;
if (allowedOrigins.includes(origin)) {
res.setHeader("Access-Control-Allow-Origin", origin);
}
res.setHeader("Access-Control-Allow-Credentials", "true");
res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

if (req.method === "OPTIONS") {
return res.status(200).end();
}

next();
});

// Body parser
app.use(express.json());

// DB
connectDB();

// Routes
app.use("/api/users", authRoutes);

// Test
app.get("/", (req, res) => res.send("Server is running"));

// PORT Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on port ${PORT}'));