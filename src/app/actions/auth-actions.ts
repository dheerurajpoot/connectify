"use server";

import { createUser, getUserByEmail } from "@/lib/db";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";

export async function registerUser(formData: FormData) {
	try {
		const name = formData.get("firstName") + " " + formData.get("lastName");
		const username = formData.get("username") as string;
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		// Validate inputs
		if (!name || !username || !email || !password) {
			return { error: "All fields are required" };
		}

		// Check if user already exists
		const existingUser = await getUserByEmail(email);
		if (existingUser) {
			return { error: "User with this email already exists" };
		}

		// Create user
		const userData = {
			name,
			username,
			email,
			password,
			bio: "",
			location: "",
			website: "",
			avatar: "",
		};

		await createUser(userData);

		// Sign in the user
		await signIn("credentials", {
			email,
			password,
			redirect: false,
		});

		redirect("/");
	} catch (error) {
		console.error("Registration error:", error);
		return { error: "Failed to register user" };
	}
}

export async function loginUser(formData: FormData) {
	try {
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		// Validate inputs
		if (!email || !password) {
			return { error: "Email and password are required" };
		}

		const result = await signIn("credentials", {
			email,
			password,
			redirect: false,
		});

		if (result?.error) {
			return { error: "Invalid email or password" };
		}

		redirect("/");
	} catch (error) {
		console.error("Login error:", error);
		return { error: "Failed to log in" };
	}
}
