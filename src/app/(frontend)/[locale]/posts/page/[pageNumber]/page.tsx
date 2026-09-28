import { hasPayloadEnv } from '@/utilities/hasPayloadEnv'
import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { defaultLocale, isLocale, locales } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { localeAlternates } from '@/utilities/generateMeta'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { notFound } from 'next/navigation'

export const revalidate = 600

type Args = {
  params: Promise<{
    locale: string
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { locale: localeParam, pageNumber } = await paramsPromise
  const locale = isLocale(localeParam) ? localeParam : defaultLocale
  const t = getDictionary(locale)
  const payload = await getPayload({ config: configPromise })

  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    locale,
    page: sanitizedPageNumber,
    overrideAccess: false,
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>{t.posts.title}</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange currentPage={posts.page} limit={12} totalDocs={posts.totalDocs} />
      </div>

      <CollectionArchive posts={posts.docs} />

      <div className="container">
        {posts?.page && posts?.totalPages > 1 && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { locale: localeParam, pageNumber } = await paramsPromise
  const locale = isLocale(localeParam) ? localeParam : defaultLocale
  const t = getDictionary(locale)

  return {
    alternates: localeAlternates(locale, `/posts/page/${pageNumber}`),
    title: `${t.posts.title} (${pageNumber}) | ${t.siteName}`,
  }
}

export async function generateStaticParams() {
  if (!hasPayloadEnv) return []

  const payload = await getPayload({ config: configPromise })
  const { totalDocs } = await payload.count({
    collection: 'posts',
    overrideAccess: false,
  })

  const totalPages = Math.ceil(totalDocs / 10)

  const pages: { locale: string; pageNumber: string }[] = []

  for (let i = 1; i <= totalPages; i++) {
    for (const locale of locales) pages.push({ locale, pageNumber: String(i) })
  }

  return pages
}
