import type { Locale } from '../config'

import { ar } from './ar'
import { en, type Dictionary } from './en'

export type { Dictionary }

const dictionaries: Record<Locale, Dictionary> = { ar, en }

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale]

/** Replace `{name}` placeholders: format('Hi {name}', { name: 'Basil' }) -> 'Hi Basil' */
export const format = (template: string, values: Record<string, string | number>): string =>
  template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  )
