const connectDB = require('./config/db');
const express = require('express');
const authRoutes = require("./routes/authRoutes");
const cors = require('cors'); // ✅ Importer cors
require('dotenv').config(); 

const app = express();

// Autoriser CORS
app.use(cors({
  origin: "http://localhost:3000", // ✅ Autorise uniquement ton frontend
  credentials: true, // si tu utilises les cookies ou auth
}));

app.use(express.json()); 

connectDB();
const PORT = process.env.PORT || 5000;

// Routes
app.use("/api/users", authRoutes);

// Test route
app.get('/', (req, res) => res.send('Server is running!'));

// Lancer le serveur
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
