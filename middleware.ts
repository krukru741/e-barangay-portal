export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    // Protect all routes except auth pages and api/auth
    "/((?!pages/login|pages/register|pages/error|api/auth|_next/static|_next/image|images|favicon.ico).*)",
  ]
}
