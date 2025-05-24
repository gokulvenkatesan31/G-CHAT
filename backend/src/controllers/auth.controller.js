import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import generateToken from "../lib/generateToken.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { email, password } = req.body;
  const name = req.body.fullName;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }
  const existingUser = await User.find({ email });
  if (existingUser.length > 0) {
    return res
      .status(400)
      .json({ message: "User already exists in the email" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });
  generateToken(newUser._id, res);
  await newUser.save();
  res.status(201).json({
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    profilePic: newUser.profilePic,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "invalid email and pasword" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "invalid email and pasword" });
  }
  generateToken(user._id, res);
  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    profilePic: user.profilePic,
  });
};

export const logout = async (req, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.status(200).json({ message: "Logged out successfully" });
};

export const updateProfile = async (req, res) => {
  const userId = req.userId;
  const { profilePic } = req.body;
  if (!profilePic) {
    return res.status(400).json({ message: "profile pic is required" });
  }
  const uploadedImage = await cloudinary.uploader.upload(profilePic, {
    folder: "profile",
  });
  const user = await User.findByIdAndUpdate(
    userId,
    { profilePic: uploadedImage.secure_url },
    { new: true }
  );
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    profilePic: user.profilePic,
  });
};

export const checkAuth = async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    profilePic: user.profilePic,
  });
};
