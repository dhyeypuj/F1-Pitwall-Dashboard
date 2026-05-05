import { useState, useEffect } from 'react'
import { calculateCountdown } from '../utils/countdown'

export const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState(() => calculateCountdown(targetDate))

  // Memoize timestamp to avoid parsing the string every second
  const targetTime = targetDate ? new Date(targetDate).getTime() : null

  useEffect(() => {
    if (!targetTime) return

    setTimeLeft(calculateCountdown(targetTime))

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = calculateCountdown(targetTime)

        // If values haven't changed (e.g. hit zero), return same reference to skip React re-render
        if (
          prev.days === next.days &&
          prev.hours === next.hours &&
          prev.minutes === next.minutes &&
          prev.seconds === next.seconds
        ) {
          if (next.days === 0 && next.hours === 0 && next.minutes === 0 && next.seconds === 0) {
            clearInterval(interval)
          }
          return prev
        }
        return next
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [targetTime])

  return timeLeft
}
