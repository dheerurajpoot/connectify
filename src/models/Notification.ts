import mongoose, { Schema, Document, Model } from "mongoose";

// Notification Interface
export interface INotification extends Document {
	userId: mongoose.Types.ObjectId;
	type: "like" | "comment" | "follow" | "mention";
	actorId: mongoose.Types.ObjectId;
	postId?: mongoose.Types.ObjectId;
	commentId?: mongoose.Types.ObjectId;
	read: boolean;
	createdAt: Date;
}

// Notification Schema
const NotificationSchema = new Schema<INotification>(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		type: {
			type: String,
			enum: ["like", "comment", "follow", "mention"],
			required: true,
		},
		actorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		postId: { type: Schema.Types.ObjectId, ref: "Post" },
		commentId: { type: Schema.Types.ObjectId, ref: "Comment" },
		read: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

// Create and export the model
const Notification: Model<INotification> =
	mongoose.models?.Notification ||
	mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;
