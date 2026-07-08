import { authConfig } from "@/auth.config";
import NextAuth from "next-auth";
import { ProtectedRoutes } from "./lib/routes";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export const middleware = auth((req) => {
  const { pathname } = req.nextUrl;
  const session = !!req.auth?.user;
  console.log("pathname", pathname);

  const isProtectedRoutes = ProtectedRoutes.find((route) =>
    pathname.startsWith(route),
  );

  if (!session && isProtectedRoutes) {
    return NextResponse.redirect(new URL("/Login", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  // Runs on every route except static assets and API routes.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
