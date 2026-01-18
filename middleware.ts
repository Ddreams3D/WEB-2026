import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostHeader = request.headers.get('host');
  const host = hostHeader || url.hostname;

  if (
    host.startsWith('localhost') ||
    host.startsWith('127.0.0.1') ||
    host.includes('::1')
  ) {
    return NextResponse.next();
  }

  if (host === 'www.ddreams3d.com') {
    url.hostname = 'ddreams3d.com';
    url.protocol = 'https:';
    return NextResponse.redirect(url, 301);
  }

  if (host === 'ddreams3d.com' && url.protocol === 'http:') {
    url.protocol = 'https:';
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

