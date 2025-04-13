import mongoose, { Schema, Document, Model } from "mongoose";

// User Interface
export interface IUser extends Document {
	name: string;
	username: string;
	email: string;
	password: string;
	avatar?: string;
	bio?: string;
	location?: string;
	website?: string;
	isVerified?: Boolean;
	role: 'user' | 'admin';
	followers: mongoose.Types.ObjectId[];
	following: mongoose.Types.ObjectId[];
	posts: mongoose.Types.ObjectId[];
	createdAt: Date;
	updatedAt: Date;
}

// User Schema
const UserSchema = new Schema<IUser>(
	{
		name: { type: String, required: true },
		username: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		avatar: { type: String },
		bio: { type: String },
		location: { type: String },
		website: { type: String },
		isVerified: { type: Boolean, default: false },
		role: { type: String, enum: ['user', 'admin'], default: 'user' },
		followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
		following: [{ type: Schema.Types.ObjectId, ref: "User" }],
		posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
	},
	{ timestamps: true }
);

// Create and export the model
const User: Model<IUser> =
	mongoose.models?.User || mongoose.model<IUser>("User", UserSchema);

export default User;
