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
	{
		timestamps: true,
		toJSON: {
			transform: function (doc, ret) {
				// Handle ObjectIds
				if (ret._id) {
					ret._id = ret._id.toString();
				}

				// Handle populated fields
				if (ret.senderId) {
					if (typeof ret.senderId === 'object' && ret.senderId._id) {
						ret.senderId = {
							...ret.senderId,
							_id: ret.senderId._id.toString()
						};
					} else if (ret.senderId.toString) {
						ret.senderId = ret.senderId.toString();
					}
				}

				if (ret.receiverId) {
					if (typeof ret.receiverId === 'object' && ret.receiverId._id) {
						ret.receiverId = {
							...ret.receiverId,
							_id: ret.receiverId._id.toString()
						};
					} else if (ret.receiverId.toString) {
						ret.receiverId = ret.receiverId.toString();
					}
				}

				// Remove version key
				delete ret.__v;
				return ret;
			},
		},
	}
);

// Create and export the model
const Message: Model<IMessage> =
	mongoose.models?.Message ||
	mongoose.model<IMessage>("Message", MessageSchema);

export default Message;
