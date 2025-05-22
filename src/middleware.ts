import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const isPublicPath = 
    path === "/login" || 
    path === "/register" || 
    path === "/" || 
    path.startsWith("/blog") || 
    path.startsWith("/tags") || 
    path.startsWith("/about") ||
    path.startsWith("/api/auth");

  // Define admin paths that require admin role
  const isAdminPath = path.startsWith("/admin");
  
  // Get the session token
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });
  
  // Redirect logic for public paths
  if (isPublicPath) {
    // If user is already logged in and tries to access login/register
    if ((path === "/login" || path === "/register") && token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    
    return NextResponse.next();
  }
  
  // If user is not logged in and tries to access protected route
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    // Add the original path as a query parameter to redirect after login
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }
  
  // If user is logged in but tries to access admin routes without admin role
  if (isAdminPath && token.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api routes that don't start with /api/auth
     * 2. /_next (static files)
     * 3. /images (static files)
     * 4. /favicon.ico (favicon)
     */
    "/((?!api/(?!auth)|_next|images|favicon.ico).*)",
  ],
};
