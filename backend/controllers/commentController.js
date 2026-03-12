import Comment from "../models/Comment.js";
import Fact from "../models/Fact.js";

const addComment = async (req, res, next) => {
  try {
    const { text, comment } = req.body;
    const content = text || comment;

    if (!content) {
      return res.status(400).json({ message: "Comment text is required." });
    }

    const fact = await Fact.findById(req.params.id);
    if (!fact) {
      return res.status(404).json({ message: "Fact not found." });
    }

    const newComment = await Comment.create({
      userId: req.user._id,
      factId: fact._id,
      text: content
    });

    const populatedComment = await Comment.findById(newComment._id).populate("userId", "name email");

    return res.status(201).json({
      message: "Comment added successfully.",
      comment: {
        id: populatedComment._id,
        text: populatedComment.text,
        createdAt: populatedComment.createdAt,
        userId: populatedComment.userId?._id || populatedComment.userId,
        username: populatedComment.userId?.name || "Community member"
      }
    });
  } catch (error) {
    return next(error);
  }
};

const getCommentsForFact = async (req, res, next) => {
  try {
    const fact = await Fact.findById(req.params.id);
    if (!fact) {
      return res.status(404).json({ message: "Fact not found." });
    }

    const comments = await Comment.find({ factId: req.params.id })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return res.json(
      comments.map((comment) => ({
        id: comment._id,
        text: comment.text,
        createdAt: comment.createdAt,
        userId: comment.userId?._id || comment.userId,
        username: comment.userId?.name || "Community member"
      }))
    );
  } catch (error) {
    return next(error);
  }
};

export {
  addComment,
  getCommentsForFact
};
