import mongoose, { Schema, Document, Model } from "mongoose";

// Message Interface
export interface IMessage extends Document {
	senderId: mongoose.Types.ObjectId;
	receiverId: mongoose.Types.ObjectId;
	content: string;
	read: boolean;
	createdAt: Date;
}

// Message Schema
const MessageSchema = new Schema<IMessage>(
	{
		senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		receiverId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		content: { type: String, required: true },
		read: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

// Create and export the model
const Message: Model<IMessage> =
	mongoose.models?.Message ||
	mongoose.model<IMessage>("Message", MessageSchema);

export default Message;
