'use client'

import React from 'react'

import { Button } from '@/components/ui/button'
import Link from '@/i18n/Link'
import { useDictionary } from '@/i18n/LocaleProvider'

export default function NotFound() {
  const { notFound } = useDictionary()

  return (
    <div className="container py-28">
      <div className="prose max-w-none">
        <h1 style={{ marginBottom: 0 }}>{notFound.title}</h1>
        <p className="mb-4">{notFound.message}</p>
      </div>
      <Button asChild variant="default">
        <Link href="/">{notFound.goHome}</Link>
      </Button>
    </div>
  )
}
