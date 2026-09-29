const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
})

export const formatDate = (date: string): string => (date ? dateFormatter.format(new Date(date)) : '')
