import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - API routes
  // - Next.js internals (_next / _vercel)
  // - generated metadata routes without an extension (icon, apple-icon, opengraph-image)
  // - static files and route handlers with an extension (sitemap.xml, llms.txt, docs/*.pdf, ...)
  matcher: [
    "/((?!api|_next|_vercel|icon|apple-icon|opengraph-image|twitter-image|.*\\..*).*)",
  ],
};
