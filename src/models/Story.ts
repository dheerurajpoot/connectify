import mongoose, { Schema, Document, Model } from "mongoose";

// Story Interface
export interface IStory extends Document {
	userId: mongoose.Types.ObjectId;
	media: string;
	viewers: mongoose.Types.ObjectId[];
	createdAt: Date;
	expiresAt: Date;
}

// Story Schema
const StorySchema = new Schema<IStory>(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		media: { type: String, required: true },
		viewers: [{ type: Schema.Types.ObjectId, ref: "User" }],
		expiresAt: { type: Date, required: true },
	},
	{ timestamps: true }
);

// Create and export the model
const Story: Model<IStory> =
	mongoose.models?.Story || mongoose.model<IStory>("Story", StorySchema);

export default Story;
