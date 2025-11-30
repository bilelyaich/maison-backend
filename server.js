const connectDB = require('./config/db');
const express = require('express');
const authRoutes = require("./routes/authRoutes");
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS autorisé
const allowedOrigins = [
"http://localhost:3000",
"[https://maison-frontend-5att.vercel.app](https://maison-frontend-5att.vercel.app)"
];

app.use(cors({
origin: function (origin, callback) {
if (!origin || allowedOrigins.includes(origin)) {
callback(null, true);
} else {
console.log("❌ Origin blocked by CORS:", origin);
callback(new Error("Not allowed by CORS"));
}
},
credentials: true,
}));

app.use(express.json());

// DB
connectDB();

// Routes
app.use("/api/users", authRoutes);

app.get("/", (req, res) => res.send("Server is running!"));

// PORT Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
