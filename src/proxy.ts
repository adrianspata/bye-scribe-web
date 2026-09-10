import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Exclude API/TRPC routes, Next.js/Vercel internals, and static files with extensions
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)'],
};
