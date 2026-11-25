import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Keeps the Supabase auth cookie fresh on every page request (Next 16 "proxy", formerly middleware).
// It only refreshes the session: pages never require sign-in, because progress also works signed out.
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return NextResponse.next();

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: list => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  await supabase.auth.getUser();   // refreshes an expiring token and writes the new cookie
  return response;
}

export const config = {
  // Pages only: skip static files, images, the card renderer and other API routes.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/card|.*\\.(?:png|jpg|jpeg|svg|webp|gif|ico|mp4|webm|woff2?)$).*)'],
};
