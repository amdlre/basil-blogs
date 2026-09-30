'use client'

import { useConfig, useLocale, useTranslation } from '@payloadcms/ui'
import React, { useEffect, useState } from 'react'

import { adminT } from '@/i18n/admin'

import './index.scss'

/** Current admin URL with the content locale set to `locale` */
const urlWithLocale = (locale: string) => {
  const url = new URL(window.location.href)
  url.searchParams.set('locale', locale)
  return url.toString()
}

/**
 * The single language switch of the admin panel (Payload's own "Locale" selector is hidden
 * in index.scss). It keeps the admin UI language and the content language being edited in sync.
 *
 * Switching sets Payload's language cookie and loads the new URL in one navigation, so the
 * UI language and `?locale=` always change together (no refresh racing a client navigation).
 */
export const AdminLanguageToggle: React.FC = () => {
  const { i18n } = useTranslation()
  const locale = useLocale()
  const { config } = useConfig()
  const [isSwitching, setIsSwitching] = useState(false)

  const current = i18n.language === 'en' ? 'en' : 'ar'
  const next = current === 'ar' ? 'en' : 'ar'
  const cookieName = `${config.cookiePrefix || 'payload'}-lng`

  // Content locale follows the UI language (e.g. after changing language in account settings)
  useEffect(() => {
    if (locale?.code && locale.code !== current) {
      window.location.replace(urlWithLocale(current))
    }
  }, [current, locale?.code])

  const switchLanguage = () => {
    setIsSwitching(true)
    document.cookie = `${cookieName}=${next}; path=/; max-age=31536000; samesite=lax`
    window.location.assign(urlWithLocale(next))
  }

  return (
    <button
      aria-label={adminT(i18n, 'switchLanguageLabel')}
      className="admin-language-toggle"
      disabled={isSwitching}
      lang={next}
      onClick={switchLanguage}
      title={adminT(i18n, 'switchLanguageLabel')}
      type="button"
    >
      <svg
        aria-hidden
        fill="none"
        height="16"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="16"
      >
        <path d="m5 8 6 6" />
        <path d="m4 14 6-6 2-3" />
        <path d="M2 5h12" />
        <path d="M7 2h1" />
        <path d="m22 22-5-10-5 10" />
        <path d="M14 18h6" />
      </svg>
      {adminT(i18n, 'switchLanguage')}
    </button>
  )
}
