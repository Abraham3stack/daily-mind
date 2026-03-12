import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  streak: user.streak,
  createdAt: user.createdAt
});

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    const user = await User.create({ name, email, password });

    return res.status(201).json({
      message: "User registered successfully.",
      token: generateToken(user._id),
      user: sanitizeUser(user)
    });
  } catch (error) {
    return next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    return res.json({
      message: "Login successful.",
      token: generateToken(user._id),
      user: sanitizeUser(user)
    });
  } catch (error) {
    return next(error);
  }
};

const searchUsers = async (req, res, next) => {
  try {
    const query = req.query.q?.trim();

    if (!query) {
      return res.json([]);
    }

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } }
      ]
    })
      .select("name email streak createdAt")
      .sort({ name: 1 })
      .limit(8);

    return res.json(users.map((user) => sanitizeUser(user)));
  } catch (error) {
    return next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("name email streak createdAt");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json(sanitizeUser(user));
  } catch (error) {
    return next(error);
  }
};

export {
  registerUser,
  loginUser,
  searchUsers,
  getUserById
};
