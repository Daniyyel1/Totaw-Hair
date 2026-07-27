import { authConfig } from "@/auth.config";
import NextAuth from "next-auth";
import { ProtectedRoutes } from "./lib/routes";
import { NextResponse } from "next/server";
import { isAdminDashboard } from "./lib/routes";

const { auth } = NextAuth(authConfig);

export const middleware = auth((req) => {
  const { pathname } = req.nextUrl;
  const session = !!req.auth?.user;
  const role = req.auth?.user?.role;
    console.log("role:", role, "isAdminRoute:", pathname.startsWith(isAdminDashboard));

  console.log("pathname", pathname);

  const isProtectedRoutes = ProtectedRoutes.find((route) =>
    pathname.startsWith(route),
  );

  const isAdminRoute = pathname.startsWith(isAdminDashboard);

  if (!session && isProtectedRoutes) {
    return NextResponse.redirect(new URL("/Login", req.nextUrl));
  }

  if(!session && isAdminRoute){
    return NextResponse.redirect(new URL("/Login", req.nextUrl));
  }

  if(session && isAdminRoute && role!== 'admin'){
    return NextResponse.redirect(new URL("/Unauthorized", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  // Runs on every route except static assets and API routes.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
