const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: true 
  },
  lastName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  birthDate: { 
    type: Date, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },

  otp: { 
    type: String 
  },
  otpExpiry: { 
    type: Date 
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },

  resetPasswordOTP: { 
    type: String 
  },
  resetPasswordOTPExpiry: { 
    type: Date 
  },
  role: { 
    type: String, 
    required: true, 
    enum: ["user", "admin"] 
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;