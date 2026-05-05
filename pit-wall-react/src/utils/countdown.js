export const calculateCountdown = (targetDate) => {
  if (!targetDate) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  const target = new Date(targetDate).getTime()
  const now = new Date().getTime()
  const diff = target - now

  if (isNaN(target) || diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds }
}
