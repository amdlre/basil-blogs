'use client'

import React from 'react'

import { format } from '@/i18n/dictionaries'
import { useDictionary } from '@/i18n/LocaleProvider'

export const PageRange: React.FC<{
  className?: string
  currentPage?: number
  limit?: number
  totalDocs?: number
}> = (props) => {
  const { className, currentPage, limit, totalDocs } = props
  const { pageRange } = useDictionary()

  let indexStart = (currentPage ? currentPage - 1 : 1) * (limit || 1) + 1
  if (totalDocs && indexStart > totalDocs) indexStart = 0

  let indexEnd = (currentPage || 1) * (limit || 1)
  if (totalDocs && indexEnd > totalDocs) indexEnd = totalDocs

  return (
    <div className={[className, 'font-semibold'].filter(Boolean).join(' ')}>
      {(typeof totalDocs === 'undefined' || totalDocs === 0) && pageRange.noResults}
      {typeof totalDocs !== 'undefined' &&
        totalDocs > 0 &&
        format(pageRange.showing, {
          end: indexEnd,
          label: totalDocs > 1 ? pageRange.posts : pageRange.post,
          start: indexStart,
          total: totalDocs,
        })}
    </div>
  )
}
