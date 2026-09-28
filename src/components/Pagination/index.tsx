'use client'
import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/utilities/ui'
import { useRouter } from 'next/navigation'
import React from 'react'

import { localizeHref } from '@/i18n/config'
import { useDictionary, useLocale } from '@/i18n/LocaleProvider'

export const Pagination: React.FC<{
  className?: string
  page: number
  totalPages: number
}> = (props) => {
  const router = useRouter()
  const locale = useLocale()
  const { pagination: t } = useDictionary()
  const goTo = (target: number) => router.push(localizeHref(`/posts/page/${target}`, locale))

  const { className, page, totalPages } = props
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  const hasExtraPrevPages = page - 1 > 1
  const hasExtraNextPages = page + 1 < totalPages

  return (
    <div className={cn('my-12', className)}>
      <PaginationComponent aria-label={t.label}>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              ariaLabel={t.goToPrevious}
              disabled={!hasPrevPage}
              label={t.previous}
              onClick={() => {
                goTo(page - 1)
              }}
            />
          </PaginationItem>

          {hasExtraPrevPages && (
            <PaginationItem>
              <PaginationEllipsis label={t.morePages} />
            </PaginationItem>
          )}

          {hasPrevPage && (
            <PaginationItem>
              <PaginationLink
                onClick={() => {
                  goTo(page - 1)
                }}
              >
                {page - 1}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink
              isActive
              onClick={() => {
                goTo(page)
              }}
            >
              {page}
            </PaginationLink>
          </PaginationItem>

          {hasNextPage && (
            <PaginationItem>
              <PaginationLink
                onClick={() => {
                  goTo(page + 1)
                }}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          )}

          {hasExtraNextPages && (
            <PaginationItem>
              <PaginationEllipsis label={t.morePages} />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              ariaLabel={t.goToNext}
              disabled={!hasNextPage}
              label={t.next}
              onClick={() => {
                goTo(page + 1)
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationComponent>
    </div>
  )
}
