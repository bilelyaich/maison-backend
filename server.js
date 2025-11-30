const connectDB = require('./config/db');
const express = require('express');
const authRoutes = require("./routes/authRoutes");
const cors = require('cors'); 
require('dotenv').config(); 

const app = express();

app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true, 
}));

app.use(express.json()); 

connectDB();
const PORT = process.env.PORT || 5000;

app.use("/api/users", authRoutes);

app.get('/', (req, res) => res.send('Server is running!'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
