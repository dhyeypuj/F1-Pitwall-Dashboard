import { useState, useEffect } from 'react'
import { calculateCountdown } from '../utils/countdown'

export const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState(() => calculateCountdown(targetDate))

  useEffect(() => {
    setTimeLeft(calculateCountdown(targetDate))

    const interval = setInterval(() => {
      const newTimeLeft = calculateCountdown(targetDate)
      setTimeLeft(newTimeLeft)

      if (
        newTimeLeft.days === 0 &&
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  return timeLeft
}
