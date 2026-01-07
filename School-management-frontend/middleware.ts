import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { USER_ROLES } from "@/lib/constants"

// Define public paths that don't require authentication
const publicPaths = ["/login", "/", "/api"]

// Define role-based protected paths
const protectedPaths: { [key: string]: string[] } = {
  [USER_ROLES.SUPER_ADMIN]: ["/superadmin"],
  [USER_ROLES.SCHOOL_ADMIN]: ["/schooladmin"],
  [USER_ROLES.TEACHER]: ["/teacher"],
  [USER_ROLES.ACCOUNTANT]: ["/accountant"],
  [USER_ROLES.STUDENT_PARENT]: ["/student-parent"],
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow access to public paths
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Get user role from cookie
  const userRole = request.cookies.get("userRole")?.value || null

  // If no role is set (not logged in), redirect to login
  if (!userRole) {
    const loginUrl = new URL("/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Check if the requested path is authorized for the user's role
  let isAuthorized = false
  for (const role in protectedPaths) {
    if (userRole === role && protectedPaths[role].some((path) => pathname.startsWith(path))) {
      isAuthorized = true
      break
    }
  }

  // If not authorized, redirect to their appropriate dashboard
  if (!isAuthorized) {
    let dashboardPath = ""
    if (userRole === USER_ROLES.STUDENT_PARENT) {
      dashboardPath = "/student-parent/dashboard"
    } else {
      dashboardPath = `/${userRole.toLowerCase().replace("_", "")}/dashboard`
    }
    if (pathname !== dashboardPath) {
      return NextResponse.redirect(new URL(dashboardPath, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
