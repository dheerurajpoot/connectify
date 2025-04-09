import mongoose, { Connection } from "mongoose";

let isConnected: Connection | false = false;

export const connectDB = async (): Promise<Connection> => {
	console.log("Connecting to MongoDB...");
	if (isConnected) {
		console.log("Database already connected!");
		return isConnected;
	}
	try {
		if (!process.env.MONGODB_URI) {
			throw new Error(
				"MONGODB_URI is not defined in environment variables"
			);
		}
		const res = await mongoose.connect(process.env.MONGODB_URI);

		isConnected = res.connection;
		console.log("Database connected successfully");
		return isConnected;
	} catch (error) {
		console.error("Error connecting to database:", error);
		throw error;
	}
};

// For Next.js API routes
export default connectDB;
