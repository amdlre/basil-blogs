import { NextResponse, type NextRequest } from 'next/server'

import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from './i18n/config'

const preferredLocale = (request: NextRequest): Locale => {
  const fromCookie = request.cookies.get(LOCALE_COOKIE)?.value
  if (isLocale(fromCookie)) return fromCookie

  // e.g. "en-US,en;q=0.9,ar;q=0.8" -> first supported language
  const fromHeader = request.headers
    .get('accept-language')
    ?.split(',')
    .map((part) => part.split(';')[0]?.trim().slice(0, 2).toLowerCase())
    .find(isLocale)

  return fromHeader ?? defaultLocale
}

/** Redirect public-site paths without a locale prefix: `/blogs` -> `/ar/blogs`. */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const [firstSegment] = pathname.split('/').filter(Boolean)

  if (isLocale(firstSegment)) return NextResponse.next()

  const locale = preferredLocale(request)
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
  url.search = search

  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    // Skip Payload (admin, api), Next.js internals, preview routes, sitemaps and any file with an extension
    '/((?!admin|api|next|_next|.*\\..*).*)',
  ],
}
