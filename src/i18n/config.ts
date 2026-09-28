export const locales = ['ar', 'en'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'ar'

/** Cookie that remembers the visitor's language choice (read by `src/proxy.ts`). */
export const LOCALE_COOKIE = 'NEXT_LOCALE'

export const localeLabels: Record<Locale, string> = {
  ar: 'العربية',
  en: 'English',
}

export const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && (locales as readonly string[]).includes(value)

export const getDirection = (locale: Locale): 'ltr' | 'rtl' => (locale === 'ar' ? 'rtl' : 'ltr')

/** BCP 47 tag used for Intl date/number formatting */
export const intlLocale: Record<Locale, string> = {
  ar: 'ar',
  en: 'en-US',
}

// Paths that belong to Payload or Next.js internals and must never get a locale prefix
const unprefixedPaths = /^\/(admin|api|next|_next)(\/|$)/

/**
 * Prefix an internal href with the locale: `/posts/foo` -> `/ar/posts/foo`.
 * External URLs, anchors, and already-prefixed paths are returned unchanged.
 */
export const localizeHref = (href: string, locale: Locale): string => {
  if (!href.startsWith('/') || href.startsWith('//') || unprefixedPaths.test(href)) return href

  const [firstSegment] = href.split(/[/?#]/).filter(Boolean)
  if (isLocale(firstSegment)) return href

  return href === '/' ? `/${locale}` : `/${locale}${href}`
}

/** Swap the locale segment of a pathname: `/ar/posts/foo` -> `/en/posts/foo`. */
export const switchLocaleInPath = (pathname: string, locale: Locale): string => {
  const segments = pathname.split('/')

  if (isLocale(segments[1])) {
    segments[1] = locale
    return segments.join('/') || `/${locale}`
  }

  return localizeHref(pathname, locale)
}
