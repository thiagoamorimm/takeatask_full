"use client"

import type React from "react"

import { useState } from "react"
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
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { HexColorPicker } from "react-colorful"

interface CriarTagDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTagCriada?: () => void
}

export default function CriarTagDialog({ open, onOpenChange, onTagCriada }: CriarTagDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    cor: "#3B82F6", // Cor padrão azul
    descricao: "",
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Limpar erro quando o usuário começa a digitar
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.nome.trim()) {
      errors.nome = "Nome é obrigatório"
    }

    if (!formData.cor.trim()) {
      errors.cor = "Cor é obrigatória"
    } else if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(formData.cor)) {
      errors.cor = "Formato de cor inválido (use formato hexadecimal: #RRGGBB)"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const resetForm = () => {
    setFormData({
      nome: "",
      cor: "#3B82F6",
      descricao: "",
    })
    setFormErrors({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulando envio para API
      console.log("Enviando dados para API...", formData)

      // Simulando um delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Fechar o modal e resetar o formulário
      onOpenChange(false)
      resetForm()

      // Notificar que a tag foi criada
      if (onTagCriada) {
        onTagCriada()
      }
    } catch (error) {
      console.error("Erro ao criar tag:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          resetForm()
        }
        onOpenChange(newOpen)
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Tag</DialogTitle>
          <DialogDescription>
            Crie uma nova tag para categorizar tarefas. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Ex: Frontend, Backend, Urgente"
              />
              {formErrors.nome && <p className="text-sm text-red-500">{formErrors.nome}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cor">Cor</Label>
              <div className="flex gap-3 items-center">
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="w-10 h-10 rounded-md border shadow focus:outline-none"
                      style={{ backgroundColor: formData.cor || "#cccccc" }}
                      aria-label="Escolher cor"
                    />
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-4">
                    <HexColorPicker
                      color={formData.cor}
                      onChange={(color) => setFormData((prev) => ({ ...prev, cor: color }))}
                      style={{ width: 200, height: 150 }}
                    />
                  </PopoverContent>
                </Popover>
                <Input
                  id="cor"
                  name="cor"
                  value={formData.cor}
                  onChange={handleChange}
                  placeholder="#3B82F6"
                  className="flex-1"
                />
              </div>
              {formErrors.cor && <p className="text-sm text-red-500">{formErrors.cor}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows={3}
                placeholder="Descreva o propósito desta tag"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Tag"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
