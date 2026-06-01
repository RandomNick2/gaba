import { useState, useEffect } from 'react'

const CountdownTimer = ({ expiresAt }) => {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const update = () => {
      const expires = new Date(expiresAt)
      const now = new Date()
      const diff = Math.max(0, Math.floor((expires - now) / 1000))
      const minutes = Math.floor(diff / 60)
      const seconds = diff % 60

      setTimeLeft(
        diff <= 0
          ? 'Уақыт аяқталды'
          : `${minutes} мин. ${seconds.toString().padStart(2, '0')} сек.`
      )
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [expiresAt])

  return <span>{timeLeft}</span>
}

export default CountdownTimer
