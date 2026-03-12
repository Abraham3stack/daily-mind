const express = require("express");
const {
  getFacts,
  createFact,
  getFactById,
  deleteFact,
  likeFact
} = require("../controllers/factController");
const { addComment, getCommentsForFact } = require("../controllers/commentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getFacts);
router.post("/", protect, createFact);
router.get("/:id", getFactById);
router.delete("/:id", protect, deleteFact);
router.post("/:id/like", protect, likeFact);
router.post("/:id/comment", protect, addComment);
router.get("/:id/comments", getCommentsForFact);

module.exports = router;
