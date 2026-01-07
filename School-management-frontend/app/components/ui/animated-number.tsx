"use client"

import { useState, useEffect } from "react"

interface AnimatedNumberProps {
  value: number | string
  duration?: number
  className?: string
  format?: (value: number) => string
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 1000,
  className = "",
  format = (val) => val.toString()
}) => {
  const [displayValue, setDisplayValue] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (typeof value === "number") {
      setIsAnimating(true)
      const startValue = displayValue
      const endValue = value
      const startTime = Date.now()

      const animate = () => {
        const currentTime = Date.now()
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3)
        const currentValue = startValue + (endValue - startValue) * easeOut

        setDisplayValue(Math.round(currentValue))

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setIsAnimating(false)
        }
      }

      requestAnimationFrame(animate)
    }
  }, [value, duration])

  return (
    <span className={`transition-all duration-300 ${isAnimating ? "scale-110" : "scale-100"} ${className}`}>
      {format(displayValue)}
    </span>
  )
} 