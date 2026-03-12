const express = require("express");
const { registerUser, loginUser, searchUsers, getUserById } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users/search", protect, searchUsers);
router.get("/users/:id", protect, getUserById);

module.exports = router;
