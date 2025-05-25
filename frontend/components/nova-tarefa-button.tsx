"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import CriarTarefaDialog from "@/components/criar-tarefa-dialog"
import { useRouter } from "next/navigation"

export default function NovaTarefaButton() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const router = useRouter()

  const handleTarefaCriada = () => {
    // Atualizar a página após criar a tarefa
    router.refresh()
  }

  return (
    <>
      <Button className="flex items-center gap-2" onClick={() => setDialogOpen(true)}>
        <PlusCircle className="h-4 w-4" />
        Nova Tarefa
      </Button>

      <CriarTarefaDialog open={dialogOpen} onOpenChange={setDialogOpen} onTarefaCriada={handleTarefaCriada} />
    </>
  )
}
