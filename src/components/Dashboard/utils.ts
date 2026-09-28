const units: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 60 * 60 * 24 * 365],
  ['month', 60 * 60 * 24 * 30],
  ['week', 60 * 60 * 24 * 7],
  ['day', 60 * 60 * 24],
  ['hour', 60 * 60],
  ['minute', 60],
]

/** "3 hours ago" / "منذ 3 ساعات"; returns `justNow` for anything under a minute */
export const timeAgo = (date: string | Date, language: string, justNow: string): string => {
  const seconds = Math.round((new Date(date).getTime() - Date.now()) / 1000)
  const relativeTime = new Intl.RelativeTimeFormat(language, { numeric: 'auto' })

  for (const [unit, unitSeconds] of units) {
    if (Math.abs(seconds) >= unitSeconds) {
      return relativeTime.format(Math.round(seconds / unitSeconds), unit)
    }
  }

  return justNow
}

export const formatNumber = (value: number, language: string): string =>
  new Intl.NumberFormat(language).format(value)
