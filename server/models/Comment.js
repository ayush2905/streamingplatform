import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    videoId: {
      type: String,
      required: true,
    },
    desc: {               //comment text
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", CommentSchema);