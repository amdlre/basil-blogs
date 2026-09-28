'use client'

import NextLink from 'next/link'
import React from 'react'

import { localizeHref } from './config'
import { useLocale } from './LocaleProvider'

type Props = React.ComponentProps<typeof NextLink>

/**
 * Drop-in replacement for `next/link` on the public site: internal hrefs get the
 * current locale prefix (`/posts/foo` -> `/ar/posts/foo`), external URLs are untouched.
 */
export const Link: React.FC<Props> = ({ href, ...props }) => {
  const locale = useLocale()

  return <NextLink href={typeof href === 'string' ? localizeHref(href, locale) : href} {...props} />
}

export default Link
