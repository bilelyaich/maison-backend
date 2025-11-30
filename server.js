const connectDB = require('./config/db');
const express = require('express');
const authRoutes = require("./routes/authRoutes");
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
origin: 'maison-frontend-5att.vercel.app', 
credentials: true,
}));

app.use(express.json());

connectDB(); 

app.use("/api/users", authRoutes);

app.get('/', (req, res) => res.send('Server is running!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
