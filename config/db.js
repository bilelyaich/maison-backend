const mongoose = require('mongoose');
const User = require('../models/User'); // Assure-toi que ce chemin est correct

const connectDB = async () => {
  try {
    // Connexion à MongoDB 
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
 
    console.log('✅ MongoDB connected successfully');

    // Création explicite de la collection
    await User.createCollection();
    console.log('✅ User collection created successfully');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message); 
    process.exit(1);
  } 
};

module.exports = connectDB;
 