import { revalidatePath } from 'next/cache'

import { locales } from './config'

/** Revalidate a public path in every language: `/posts/foo` -> `/ar/posts/foo`, `/en/posts/foo` */
export const revalidateLocalizedPath = (path: string) => {
  for (const locale of locales) {
    revalidatePath(`/${locale}${path === '/' ? '' : path}`)
  }
}
