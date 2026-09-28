'use client'

import { cn } from '@/utilities/ui'
import { Languages } from 'lucide-react'
import { usePathname, useSearchParams } from 'next/navigation'
import React from 'react'

import { LOCALE_COOKIE, locales, switchLocaleInPath } from './config'
import { useDictionary, useLocale } from './LocaleProvider'

export const LanguageToggle: React.FC<{ className?: string }> = ({ className }) => {
  const locale = useLocale()
  const { language } = useDictionary()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const nextLocale = locales.find((l) => l !== locale) ?? locale
  const query = searchParams.toString()
  const href = `${switchLocaleInPath(pathname, nextLocale)}${query ? `?${query}` : ''}`

  return (
    <a
      aria-label={language.switchToLabel}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
        className,
      )}
      href={href}
      hrefLang={nextLocale}
      lang={nextLocale}
      onClick={() => {
        // Remember the choice so `/` redirects to this language next time
        document.cookie = `${LOCALE_COOKIE}=${nextLocale}; path=/; max-age=31536000; samesite=lax`
      }}
      title={language.switchToLabel}
    >
      <Languages aria-hidden className="h-4 w-4" />
      {language.switchTo}
    </a>
  )
}
