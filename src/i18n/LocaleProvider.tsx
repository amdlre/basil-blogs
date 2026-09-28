'use client'

import React, { createContext, use } from 'react'

import type { Locale } from './config'

import { getDictionary, type Dictionary } from './dictionaries'

type LocaleContextValue = {
  dictionary: Dictionary
  locale: Locale
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export const LocaleProvider: React.FC<{ children: React.ReactNode; locale: Locale }> = ({
  children,
  locale,
}) => (
  <LocaleContext value={{ dictionary: getDictionary(locale), locale }}>{children}</LocaleContext>
)

const useLocaleContext = () => {
  const context = use(LocaleContext)
  if (!context) throw new Error('useLocale must be used inside <LocaleProvider>')
  return context
}

export const useLocale = (): Locale => useLocaleContext().locale

/** The UI strings for the current locale */
export const useDictionary = (): Dictionary => useLocaleContext().dictionary
