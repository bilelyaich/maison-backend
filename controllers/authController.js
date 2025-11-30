const User = require("../models/User");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bilelyaich16@gmail.com",
    pass: "nnwfpsxjptlwyltw",
  },
});

const generateOTP = () => crypto.randomInt(100000, 999999).toString();

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, birthDate, role } = req.body;

    // Vérifier que l'utilisateur n'existe pas
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Cet utilisateur existe déjà." });
    }

    // Vérifier que le rôle est valide
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Rôle invalide." });
    }

    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      birthDate,
      otp,
      otpExpiry,
      isVerified: false,
      role  // <-- rôle choisi par l'utilisateur
    });

    await newUser.save();

    await transporter.sendMail({
      from: '"quiz" <bilelyaich16@gmail.com>',
      to: email,
      subject: "Vérification de votre compte",
      text: `Bonjour ${firstName},\n\nVoici votre code OTP : ${otp}\nIl expire dans 10 minutes.`,
    });

    res.status(201).json({
      message: "Inscription réussie. Vérifiez votre e-mail pour valider votre compte.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l’inscription", error: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable" });
    if (user.isVerified)
      return res.status(400).json({ message: "Utilisateur déjà vérifié" });

    if (
      !user.otp ||
      user.otp !== otp ||
      !user.otpExpiry ||
      user.otpExpiry < Date.now()
    ) {
      return res.status(400).json({ message: "OTP invalide ou expiré." });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({
      message:
        "E-mail vérifié avec succès. Vous pouvez maintenant vous connecter.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la vérification OTP", error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email et mot de passe requis" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé." });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Mot de passe incorrect." });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Connexion réussie.",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        birthDate: user.birthDate,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable" });

    const otp = generateOTP();
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpiry = Date.now() + 30 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      from: '"quiz" <bilelyaich16@gmail.com>',
      to: email,
      subject: "Réinitialisation du mot de passe",
      text: `Votre code de réinitialisation est : ${otp}\nIl expire dans 30 minutes.`,
    });

    console.log("OTP pour reset password:", otp);
    res.json({ message: "OTP envoyé à votre e-mail." });
  } catch (err) {
    res.status(500).json({ message: "Erreur interne", error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword)
      return res.status(400).json({ message: "Tous les champs sont requis." });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable." });

    if (
      !user.resetPasswordOTP ||
      user.resetPasswordOTP !== otp ||
      !user.resetPasswordOTPExpiry ||
      user.resetPasswordOTPExpiry < Date.now()
    ) {
      return res.status(400).json({ message: "OTP invalide ou expiré." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpiry = undefined;

    await user.save();

    res.json({ message: "Mot de passe réinitialisé avec succès." });
  } catch (error) {
    console.error("Erreur resetPassword:", error);
    res.status(500).json({ message: "Erreur serveur.", error });
  }
};
