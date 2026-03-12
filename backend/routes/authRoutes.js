import express from "express";
import { registerUser, loginUser, searchUsers, getUserById } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users/search", protect, searchUsers);
router.get("/users/:id", protect, getUserById);

export default router;
