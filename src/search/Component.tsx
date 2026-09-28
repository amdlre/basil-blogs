'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState, useEffect } from 'react'
import { useDebounce } from '@/utilities/useDebounce'
import { useRouter } from 'next/navigation'

import { localizeHref } from '@/i18n/config'
import { useDictionary, useLocale } from '@/i18n/LocaleProvider'

export const Search: React.FC = () => {
  const [value, setValue] = useState('')
  const router = useRouter()
  const locale = useLocale()
  const { search } = useDictionary()

  const debouncedValue = useDebounce(value)

  useEffect(() => {
    const query = debouncedValue ? `?q=${encodeURIComponent(debouncedValue)}` : ''
    router.push(localizeHref(`/search${query}`, locale))
  }, [debouncedValue, locale, router])

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <Label htmlFor="search" className="sr-only">
          {search.title}
        </Label>
        <Input
          id="search"
          onChange={(event) => {
            setValue(event.target.value)
          }}
          placeholder={search.placeholder}
        />
        <button type="submit" className="sr-only">
          {search.title}
        </button>
      </form>
    </div>
  )
}
