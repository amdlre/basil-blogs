import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { defaultLocale, locales, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'
import { resolveLocalizedUpload } from './resolveLocalizedUpload'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

/** `canonical` + `hreflang` links for a path that exists in every locale, e.g. `/posts/foo` */
export const localeAlternates = (locale: Locale, path: string): Metadata['alternates'] => ({
  canonical: `/${locale}${path}`,
  languages: {
    ...Object.fromEntries(locales.map((l) => [l, `/${l}${path}`])),
    'x-default': `/${defaultLocale}${path}`,
  },
})

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
  locale: Locale
  /** Path without the locale prefix, e.g. `/posts/foo` or `` for the home page */
  path: string
}): Promise<Metadata> => {
  const { doc, locale, path } = args
  const { siteName } = getDictionary(locale)

  const ogImage = getImageURL(resolveLocalizedUpload(doc?.meta, 'image'))

  const title = doc?.meta?.title ? `${doc.meta.title} | ${siteName}` : siteName

  return {
    alternates: localeAlternates(locale, path),
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      siteName,
      title,
      url: `/${locale}${path}`,
    }),
    title,
  }
}
