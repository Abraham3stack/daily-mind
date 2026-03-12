import Fact from "../models/Fact.js";
import Comment from "../models/Comment.js";

const normalizeFact = (fact) => ({
  id: fact._id,
  text: fact.text,
  category: fact.category,
  likes: fact.likes,
  likedBy: (fact.likedBy || []).map((userId) => String(userId)),
  createdAt: fact.createdAt,
  userId: fact.userId?._id || fact.userId,
  username: fact.userId?.name || undefined
});

const getFacts = async (req, res, next) => {
  try {
    const facts = await Fact.find({})
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .lean();

    const factIds = facts.map((fact) => fact._id);
    const comments = await Comment.find({ factId: { $in: factIds } })
      .populate("userId", "name")
      .sort({ createdAt: -1 })
      .lean();

    const commentsByFactId = comments.reduce((accumulator, comment) => {
      const factId = String(comment.factId);
      if (!accumulator[factId]) {
        accumulator[factId] = [];
      }

      accumulator[factId].push({
        id: comment._id,
        text: comment.text,
        createdAt: comment.createdAt,
        userId: comment.userId?._id || comment.userId,
        username: comment.userId?.name || "Community member"
      });

      return accumulator;
    }, {});

    return res.json(
      facts.map((fact) => ({
        ...normalizeFact(fact),
        comments: commentsByFactId[String(fact._id)] || []
      }))
    );
  } catch (error) {
    return next(error);
  }
};

const createFact = async (req, res, next) => {
  try {
    const { text, fact, category } = req.body;
    const content = text || fact;

    if (!content || !category) {
      return res.status(400).json({ message: "Text and category are required." });
    }

    const newFact = await Fact.create({
      userId: req.user._id,
      text: content,
      category
    });

    const populatedFact = await Fact.findById(newFact._id).populate("userId", "name email");

    return res.status(201).json({
      message: "Fact created successfully.",
      fact: {
        ...normalizeFact(populatedFact),
        comments: []
      }
    });
  } catch (error) {
    return next(error);
  }
};

const getFactById = async (req, res, next) => {
  try {
    const fact = await Fact.findById(req.params.id).populate("userId", "name email");
    if (!fact) {
      return res.status(404).json({ message: "Fact not found." });
    }

    const comments = await Comment.find({ factId: fact._id })
      .populate("userId", "name")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      ...normalizeFact(fact),
      comments: comments.map((comment) => ({
        id: comment._id,
        text: comment.text,
        createdAt: comment.createdAt,
        userId: comment.userId?._id || comment.userId,
        username: comment.userId?.name || "Community member"
      }))
    });
  } catch (error) {
    return next(error);
  }
};

const deleteFact = async (req, res, next) => {
  try {
    const fact = await Fact.findById(req.params.id);
    if (!fact) {
      return res.status(404).json({ message: "Fact not found." });
    }

    if (String(fact.userId) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only delete your own facts." });
    }

    await Comment.deleteMany({ factId: fact._id });
    await fact.deleteOne();

    return res.json({ message: "Fact deleted successfully." });
  } catch (error) {
    return next(error);
  }
};

const likeFact = async (req, res, next) => {
  try {
    const fact = await Fact.findById(req.params.id).populate("userId", "name email");

    if (!fact) {
      return res.status(404).json({ message: "Fact not found." });
    }

    const hasLiked = fact.likedBy.some((userId) => String(userId) === String(req.user._id));

    if (String(fact.userId._id || fact.userId) === String(req.user._id) && !hasLiked) {
      return res.status(400).json({ message: "You cannot like your own post." });
    }

    if (hasLiked) {
      fact.likedBy = fact.likedBy.filter((userId) => String(userId) !== String(req.user._id));
      fact.likes = Math.max(0, fact.likes - 1);
    } else {
      fact.likedBy.push(req.user._id);
      fact.likes += 1;
    }

    await fact.save();

    return res.json({
      message: hasLiked ? "Fact unliked successfully." : "Fact liked successfully.",
      liked: !hasLiked,
      fact: normalizeFact(fact)
    });
  } catch (error) {
    return next(error);
  }
};

export {
  getFacts,
  createFact,
  getFactById,
  deleteFact,
  likeFact
};
