"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tag } from "lucide-react"
import CriarTagDialog from "@/components/criar-tag-dialog"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function NovaTagButton() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleTagCriada = () => {
    // Atualizar a página após criar a tag
    router.refresh()

    // Mostrar notificação
    toast({
      title: "Tag criada",
      description: "A nova tag foi criada com sucesso.",
    })
  }

  return (
    <>
      <Button className="flex items-center gap-2" onClick={() => setDialogOpen(true)}>
        <Tag className="h-4 w-4" />
        Nova Tag
      </Button>

      <CriarTagDialog open={dialogOpen} onOpenChange={setDialogOpen} onTagCriada={handleTagCriada} />
    </>
  )
}
