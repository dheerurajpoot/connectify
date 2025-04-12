import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "@/models";
import { connectDB } from "./mongodb";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";

// Extend the built-in session types
declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			name?: string | null;
			email?: string | null;
			avatar?: string | null;
			username?: string;
		};
	}

	interface User {
		id: string;
		username: string;
	}
}

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				try {
					await connectDB();

					const user = await User.findOne({
						email: credentials.email,
					}).lean();

					if (!user) return null;

					const isPasswordValid = await bcrypt.compare(
						credentials.password,
						user.password
					);

					if (!isPasswordValid) return null;

					// Return user without password
					return {
						id: user._id.toString(),
						name: user.name,
						username: user.username,
						email: user.email,
						avatar: user.avatar,
					};
				} catch (error) {
					console.error("Auth error:", error);
					return null;
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.username = user.username;
			}
			return token;
		},
		async session({ session, token }) {
			if (token && session.user) {
				session.user.id = token.id as string;
				session.user.username = token.username as string;
			}
			return session;
		},
	},
	pages: {
		signIn: "/auth/login",
		signOut: "/auth/logout",
		error: "/auth/error",
	},
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
		updateAge: 24 * 60 * 60, // 24 hours - only update session once per day
	},
	secret: process.env.NEXTAUTH_SECRET,
};

export const auth = NextAuth(authOptions);
