'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import React, { useState } from 'react'

import type { Theme } from './types'

import { useTheme } from '..'
import { themeLocalStorageKey } from './types'
import { useDictionary } from '@/i18n/LocaleProvider'

export const ThemeSelector: React.FC = () => {
  const { setTheme } = useTheme()
  const { theme: t } = useDictionary()
  const [value, setValue] = useState('')

  const onThemeChange = (themeToSet: Theme & 'auto') => {
    if (themeToSet === 'auto') {
      setTheme(null)
      setValue('auto')
    } else {
      setTheme(themeToSet)
      setValue(themeToSet)
    }
  }

  React.useEffect(() => {
    const preference = window.localStorage.getItem(themeLocalStorageKey)
    setValue(preference ?? 'auto')
  }, [])

  return (
    <Select onValueChange={onThemeChange} value={value}>
      <SelectTrigger
        aria-label={t.select}
        className="w-auto bg-transparent gap-2 ps-0 md:ps-3 border-none"
      >
        <SelectValue placeholder={t.placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="auto">{t.auto}</SelectItem>
        <SelectItem value="light">{t.light}</SelectItem>
        <SelectItem value="dark">{t.dark}</SelectItem>
      </SelectContent>
    </Select>
  )
}
