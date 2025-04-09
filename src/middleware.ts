import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
	const token = await getToken({ req: request });

	// Public paths that don't require authentication
	const publicPaths = ["/auth/login", "/auth/signup"];

	// Check if the path is public
	const isPublicPath = publicPaths.some((path) =>
		request.nextUrl.pathname.startsWith(path)
	);

	// If the user is not logged in and the path is not public, redirect to login
	if (
		!token &&
		!isPublicPath &&
		!request.nextUrl.pathname.startsWith("/api")
	) {
		return NextResponse.redirect(new URL("/auth/login", request.url));
	}

	// If the user is logged in and trying to access auth pages, redirect to home
	if (token && isPublicPath) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
