import mongoose, { Schema, Document, Model } from "mongoose";

// Story Interface
export interface IStoryDocument extends Document {
	userId: mongoose.Types.ObjectId;
	media: string;
	viewers: mongoose.Types.ObjectId[];
	createdAt: Date;
	expiresAt: Date;
}

// Story Create Interface
export interface IStoryCreate {
	userId: mongoose.Types.ObjectId;
	media: string;
}

// Story Schema
const StorySchema = new Schema<IStoryDocument>(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		media: { type: String, required: true },
		viewers: [{ type: Schema.Types.ObjectId, ref: "User" }],
		expiresAt: { type: Date, required: true },
	},
	{ timestamps: true }
);

// Create and export the model
const Story: Model<IStoryDocument> =
	mongoose.models?.Story || mongoose.model<IStoryDocument>("Story", StorySchema);

export default Story;
