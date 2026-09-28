'use client'

import * as React from 'react'
import { useFormContext } from 'react-hook-form'

import { useDictionary } from '@/i18n/LocaleProvider'

export const Error = ({ name }: { name: string }) => {
  const {
    formState: { errors },
  } = useFormContext()
  const { form } = useDictionary()
  return (
    <div className="mt-2 text-red-500 text-sm">
      {(errors[name]?.message as string) || form.required}
    </div>
  )
}
