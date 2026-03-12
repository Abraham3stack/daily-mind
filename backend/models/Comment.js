import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    factId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fact",
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: true }
  }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
