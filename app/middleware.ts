import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = [
    "/login",
    "/register",
    "/api/auth/login",
    "/api/auth/logout",
    "/api/auth/me",
    "/_next",
    "/favicon.ico",
];

function isPublic(pathname: string) {
    return PUBLIC_PATHS.some(
        (p) => pathname === p || pathname.startsWith(p)
    );
}

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (isPublic(pathname)) {
        return NextResponse.next();
    }

    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image).*)"],
};
