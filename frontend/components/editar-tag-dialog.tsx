"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface Tag {
  id: number;
  nome: string;
  cor: string;
  descricao?: string;
}

interface EditarTagDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tag: Tag | null
  onTagAtualizada?: () => void
}

export default function EditarTagDialog({
  open,
  onOpenChange,
  tag,
  onTagAtualizada,
}: EditarTagDialogProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [nome, setNome] = useState("")
  const [cor, setCor] = useState("#71717A") // Cor padrão
  const [descricao, setDescricao] = useState("")

  useEffect(() => {
    if (tag) {
      setNome(tag.nome)
      setCor(tag.cor)
      setDescricao(tag.descricao || "")
    } else {
      // Resetar se não houver tag (ex: ao fechar)
      setNome("")
      setCor("#71717A")
      setDescricao("")
    }
  }, [tag, open]) // Depender de 'open' para resetar ao reabrir com tag diferente ou nenhuma

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tag) return;

    setIsSubmitting(true)
    const tagAtualizada = {
      id: tag.id,
      nome,
      cor,
      descricao,
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";
      const response = await fetch(`${apiUrl}/api/tags/${tag.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, cor, descricao }), // Enviar apenas os campos editáveis
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Erro ao atualizar tag." }));
        throw new Error(errorData.message || `Falha ao atualizar tag: ${response.statusText}`);
      }

      toast({
        title: "Tag Atualizada",
        description: `A tag "${nome}" foi atualizada com sucesso.`,
      })
      if (onTagAtualizada) {
        onTagAtualizada()
      }
      onOpenChange(false) // Fechar o diálogo
    } catch (error) {
      console.error("Erro ao atualizar tag:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível atualizar a tag.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!tag) return null; // Não renderizar se não houver tag (ou ao fechar)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Editar Tag</DialogTitle>
          <DialogDescription>
            Atualize as informações da tag. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nome-tag">Nome da Tag</Label>
            <Input
              id="nome-tag"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Frontend, Urgente"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cor-tag">Cor</Label>
            <div className="flex items-center gap-2">
              <Input
                id="cor-tag"
                type="color"
                value={cor}
                onChange={(e) => setCor(e.target.value)}
                className="p-1 h-10 w-14"
              />
              <Input
                type="text"
                value={cor}
                onChange={(e) => setCor(e.target.value)}
                placeholder="#RRGGBB"
                className="max-w-[100px]"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="descricao-tag">Descrição (Opcional)</Label>
            <Textarea
              id="descricao-tag"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva brevemente a finalidade desta tag"
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
