'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title'> &
  Partial<Pick<Post, 'heroImage' | 'publishedAt'>>

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps } = props

  const { slug, categories, heroImage, meta, publishedAt, title } = doc || {}
  const { description, image: metaImage } = meta || {}

  // Prefer the SEO image, fall back to the post's hero image
  const image = [metaImage, heroImage].find((img) => img && typeof img === 'object')

  const categoryTitles = (categories || [])
    .map((category) => (typeof category === 'object' ? category?.title : null))
    .filter((categoryTitle): categoryTitle is string => Boolean(categoryTitle))

  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`

  return (
    <article
      className={cn(
        'group flex flex-col overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:cursor-pointer hover:shadow-xl',
        className,
      )}
      ref={card.ref}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-r from-neutral-600 to-violet-300 dark:from-neutral-900 dark:to-violet-900/70">
        {image && typeof image === 'object' ? (
          <Media
            fill
            imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
            resource={image}
            size="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white/70">
            <svg
              aria-hidden
              className="h-12 w-12"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <rect height="18" rx="2" width="18" x="3" y="3" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
            </svg>
          </div>
        )}

        <span
          aria-hidden
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur-md transition-colors group-hover:bg-white group-hover:text-neutral-900"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M7 17 17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </span>
      </div>

      <div className="relative -mt-6 flex flex-1 flex-col rounded-t-3xl bg-card p-6">
        {titleToUse && (
          <h3 className="text-xl font-semibold leading-snug">
            <Link href={href} ref={link.ref}>
              {titleToUse}
            </Link>
          </h3>
        )}

        {showCategories && categoryTitles.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {categoryTitles.map((categoryTitle, index) => (
              <span
                className="rounded-lg border border-border px-2.5 py-0.5 text-sm text-muted-foreground"
                key={index}
              >
                {categoryTitle}
              </span>
            ))}
          </div>
        )}

        {sanitizedDescription && (
          <p className="mt-5 line-clamp-3 text-muted-foreground">{sanitizedDescription}</p>
        )}

        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          {publishedAt ? (
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Published</p>
              <time className="text-lg font-bold" dateTime={publishedAt}>
                {dateFormatter.format(new Date(publishedAt))}
              </time>
            </div>
          ) : (
            <span />
          )}

          <span className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity group-hover:opacity-90">
            Read more
          </span>
        </div>
      </div>
    </article>
  )
}
