'use client'

import React, { Suspense } from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { LanguageToggle } from '@/i18n/LanguageToggle'
import Link from '@/i18n/Link'
import { useDictionary } from '@/i18n/LocaleProvider'
import { SearchIcon } from 'lucide-react'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const { nav } = useDictionary()

  return (
    <nav className="flex gap-3 items-center">
      {navItems.map(({ link }, i) => {
        return <CMSLink key={i} {...link} appearance="link" />
      })}
      <Link href="/search">
        <span className="sr-only">{nav.search}</span>
        <SearchIcon className="w-5 text-primary" />
      </Link>
      {/* LanguageToggle reads search params, which need a Suspense boundary */}
      <Suspense>
        <LanguageToggle />
      </Suspense>
    </nav>
  )
}
