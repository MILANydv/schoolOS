"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface CircularProgressProps {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  className?: string
  showValue?: boolean
  children?: React.ReactNode
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  className = "",
  showValue = true,
  children
}) => {
  const circleRef = useRef<SVGCircleElement>(null)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const progress = Math.min(Math.max(value / max, 0), 1)
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (progress * circumference)

  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.style.strokeDasharray = strokeDasharray.toString()
      circleRef.current.style.strokeDashoffset = strokeDashoffset.toString()
    }
  }, [strokeDasharray, strokeDashoffset])

  const getColor = (progress: number) => {
    if (progress >= 0.8) return "stroke-green-500"
    if (progress >= 0.6) return "stroke-blue-500"
    if (progress >= 0.4) return "stroke-yellow-500"
    return "stroke-red-500"
  }

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200"
        />
        {/* Progress circle */}
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className={cn(
            "transition-all duration-1000 ease-out",
            getColor(progress)
          )}
          style={{
            strokeDasharray,
            strokeDashoffset,
          }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (showValue && (
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(progress * 100)}%
            </div>
            <div className="text-xs text-gray-500">
              {value}/{max}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 