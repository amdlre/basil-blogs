'use client'

import { useTranslation } from '@payloadcms/ui'
import React from 'react'

import { adminT } from '@/i18n/admin'

import './index.scss'

/** Globe button in the admin header that flips the admin UI between Arabic and English */
export const AdminLanguageToggle: React.FC = () => {
  const { i18n, switchLanguage } = useTranslation()
  const next = i18n.language === 'ar' ? 'en' : 'ar'

  return (
    <button
      aria-label={adminT(i18n, 'switchLanguageLabel')}
      className="admin-language-toggle"
      lang={next}
      onClick={() => void switchLanguage?.(next)}
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
