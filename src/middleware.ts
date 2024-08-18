import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * Bảo về route client do nó là client component
 * Những cái khác đã được bảo vệ theo cách khác
 */
const isProtectedRoute = createRouteMatcher([
  '/',
  '/client',
  '/cart'
])

/**
 * Nếu người dùng chưa đăng nhập mà bấm nút để chuyển sang client page
 * thì sẽ tự động chuyển hướng sang SignIn page
 */
export default clerkMiddleware((auth, req) => {
  if(isProtectedRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};