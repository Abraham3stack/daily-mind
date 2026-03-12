import express from "express";
import {
  getFacts,
  createFact,
  getFactById,
  deleteFact,
  likeFact
} from "../controllers/factController.js";
import { addComment, getCommentsForFact } from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getFacts);
router.post("/", protect, createFact);
router.get("/:id", getFactById);
router.delete("/:id", protect, deleteFact);
router.post("/:id/like", protect, likeFact);
router.post("/:id/comment", protect, addComment);
router.get("/:id/comments", getCommentsForFact);

export default router;
