import mongoose, { Schema, Document, Model } from "mongoose";

// Comment Interface
export interface IComment extends Document {
	userId: mongoose.Types.ObjectId;
	postId: mongoose.Types.ObjectId;
	content: string;
	createdAt: Date;
}

// Comment Schema
const CommentSchema = new Schema<IComment>(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
		content: { type: String, required: true },
	},
	{ timestamps: true }
);

// Create and export the model
const Comment: Model<IComment> =
	mongoose.models?.Comment ||
	mongoose.model<IComment>("Comment", CommentSchema);

export default Comment;
