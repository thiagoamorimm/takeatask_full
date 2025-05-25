"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { getTagColor } from "@/services/tag-service"

interface ColoredTagProps {
  name: string
  onRemove?: () => void
  className?: string
}

export default function ColoredTag({ name, onRemove, className = "" }: ColoredTagProps) {
  const [color, setColor] = useState<string>("#71717A") // Default gray color
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTagColor = async () => {
      try {
        const tagColor = await getTagColor(name)
        setColor(tagColor)
      } catch (error) {
        console.error(`Error loading color for tag ${name}:`, error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTagColor()
  }, [name])

  // Calculate text color based on background color brightness
  const getTextColor = (bgColor: string) => {
    // Remove the # if it exists
    const hex = bgColor.replace('#', '')
    
    // Convert hex to RGB
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    
    // Calculate brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    
    // Return white for dark backgrounds, black for light backgrounds
    return brightness > 128 ? '#000000' : '#FFFFFF'
  }

  const textColor = getTextColor(color)

  return (
    <Badge 
      variant="outline" 
      className={`flex items-center gap-1 ${className}`}
      style={{ 
        backgroundColor: color,
        color: textColor,
        borderColor: 'transparent'
      }}
    >
      {name}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 rounded-full hover:bg-black/10 p-0.5"
          aria-label={`Remove tag ${name}`}
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Remover tag {name}</span>
        </button>
      )}
    </Badge>
  )
}
