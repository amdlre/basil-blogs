const relativeTime = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

const units: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 60 * 60 * 24 * 365],
  ['month', 60 * 60 * 24 * 30],
  ['week', 60 * 60 * 24 * 7],
  ['day', 60 * 60 * 24],
  ['hour', 60 * 60],
  ['minute', 60],
]

/** "3 hours ago", "yesterday", "just now" */
export const timeAgo = (date: string | Date): string => {
  const seconds = Math.round((new Date(date).getTime() - Date.now()) / 1000)

  for (const [unit, unitSeconds] of units) {
    if (Math.abs(seconds) >= unitSeconds) {
      return relativeTime.format(Math.round(seconds / unitSeconds), unit)
    }
  }

  return 'just now'
}

export const formatNumber = (value: number): string => new Intl.NumberFormat('en').format(value)
