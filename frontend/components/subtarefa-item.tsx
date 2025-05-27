"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CheckSquare, Square } from "lucide-react"

interface SubtarefaProps {
  subtarefa: {
    id: number
    titulo: string
    concluida: boolean
    responsavel: {
      id: number
      nome: string
      iniciais: string
    }
  }
  onToggle: () => void
}

export default function SubtarefaItem({ subtarefa, onToggle }: SubtarefaProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button onClick={onToggle} className="flex-shrink-0">
        {subtarefa.concluida ? (
          <CheckSquare className="h-5 w-5 text-emerald-500" />
        ) : (
          <Square className="h-5 w-5 text-gray-400" />
        )}
      </button>
      <span className={`flex-grow text-sm ${subtarefa.concluida ? "line-through text-gray-500" : ""}`}>
        {subtarefa.titulo}
      </span>
      {(isHovered || subtarefa.concluida) && (
        <Avatar className="h-6 w-6 flex-shrink-0">
          <AvatarFallback>{subtarefa.responsavel.iniciais}</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
