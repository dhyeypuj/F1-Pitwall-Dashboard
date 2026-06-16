export const parseTimezoneSafe = (dateStr) => {
  if (!dateStr) return null
  if (typeof dateStr === 'number') return new Date(dateStr)
  if (dateStr instanceof Date) return dateStr

  let formatted = String(dateStr).trim()

  // Replace space with T for standard ISO format if needed
  if (formatted.includes(' ') && !formatted.includes('T')) {
    formatted = formatted.replace(' ', 'T')
  }

  // Check if timezone is present
  const timePart = formatted.split('T')[1]
  const hasZ = formatted.endsWith('Z') || formatted.endsWith('z')
  const hasOffset = timePart && (timePart.includes('+') || (timePart.lastIndexOf('-') > 0))

  // If time is present but timezone offset and Z are missing, default to UTC by appending Z
  if (formatted.includes('T') && !hasZ && !hasOffset) {
    formatted = `${formatted}Z`
  }

  const parsed = new Date(formatted)
  return isNaN(parsed.getTime()) ? null : parsed
}

export const calculateCountdown = (targetDate) => {
  if (!targetDate) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  const targetParsed = parseTimezoneSafe(targetDate)
  if (!targetParsed) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  const target = targetParsed.getTime()
  const now = Date.now()
  const diff = target - now

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)

  return { days, hours, minutes, seconds }
}

