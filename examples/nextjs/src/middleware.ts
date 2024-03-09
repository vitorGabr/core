import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const params = request.nextUrl.pathname.split('/').filter(Boolean)
    const locale = params[0];
    const response = NextResponse.next();

    if (locale) {
        response.headers.set('x-locale', locale)
        return response
    }

    response.headers.delete('x-locale')
    return response
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}