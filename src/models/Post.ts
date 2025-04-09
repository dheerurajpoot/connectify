import mongoose, { Schema, Document, Model } from "mongoose";

// Post Interface
export interface IPost extends Document {
	userId: mongoose.Types.ObjectId;
	content: string;
	media?: string[];
	likes: mongoose.Types.ObjectId[];
	comments: mongoose.Types.ObjectId[];
	createdAt: Date;
	updatedAt: Date;
}

// Post Schema
const PostSchema = new Schema<IPost>(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		content: { type: String, required: true },
		media: [{ type: String }],
		likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
		comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
	},
	{ timestamps: true }
);

// Create and export the model
const Post: Model<IPost> =
	mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export default Post;
