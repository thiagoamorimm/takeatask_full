"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, User } from "lucide-react"

interface Usuario {
  id: number
  nome: string
  email: string
  telefone?: string
  cargo?: string      // Tornar opcional
  departamento?: string // Tornar opcional
  status: string
  avatar?: string
  iniciais: string
}

interface EditarUsuarioDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  usuario: Usuario
  onUsuarioAtualizado?: (usuario: Usuario) => void
}

export default function EditarUsuarioDialog({
  open,
  onOpenChange,
  usuario,
  onUsuarioAtualizado,
}: EditarUsuarioDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cargo: "",
    departamento: "",
    status: "",
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Carregar dados do usuário quando o componente montar ou o usuário mudar
  useEffect(() => {
    if (usuario) {
      setFormData({
        nome: usuario.nome,
        email: usuario.email,
        telefone: usuario.telefone || "",
        cargo: usuario.cargo || "",          // Usar string vazia se undefined
        departamento: usuario.departamento || "", // Usar string vazia se undefined
        status: usuario.status === "Ativo" ? "ativo" : "inativo",
      })
      setAvatarPreview(usuario.avatar || null)
    }
  }, [usuario])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.nome.trim()) {
      errors.nome = "Nome é obrigatório"
    }

    if (!formData.email.trim()) {
      errors.email = "Email é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email inválido"
    }

    if (!formData.telefone.trim()) {
      errors.telefone = "Telefone é obrigatório"
    }

    if (!formData.cargo.trim()) {
      errors.cargo = "Cargo é obrigatório"
    }

    if (!formData.departamento.trim()) {
      errors.departamento = "Departamento é obrigatório"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulando envio para API
      console.log("Atualizando dados para API...", formData)

      // Simulando um delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Criar objeto atualizado do usuário
      const usuarioAtualizado = {
        ...usuario,
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        cargo: formData.cargo,
        departamento: formData.departamento,
        status: formData.status === "ativo" ? "Ativo" : "Inativo",
        avatar: avatarPreview || usuario.avatar,
        iniciais: getIniciais(formData.nome),
      }

      // Fechar o modal
      onOpenChange(false)

      // Notificar que o usuário foi atualizado
      if (onUsuarioAtualizado) {
        onUsuarioAtualizado(usuarioAtualizado)
      }
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Gerar iniciais a partir do nome
  const getIniciais = (nome: string) => {
    return nome
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>Atualize os dados do usuário. Clique em salvar quando terminar.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="flex flex-col items-center mb-6">
            <div className="mb-4">
              <Avatar className="h-24 w-24">
                {avatarPreview ? (
                  <AvatarImage src={avatarPreview || "/placeholder.svg"} alt="Avatar preview" />
                ) : (
                  <AvatarFallback className="text-2xl bg-emerald-100 text-emerald-700">
                    {formData.nome ? getIniciais(formData.nome) : <User />}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
            <Label
              htmlFor="avatar-upload"
              className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-4 py-2"
            >
              <Upload className="mr-2 h-4 w-4" />
              Alterar foto
            </Label>
            <Input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo</Label>
              <Input
                id="nome"
                name="nome"
                placeholder="Digite o nome completo"
                value={formData.nome}
                onChange={handleChange}
              />
              {formErrors.nome && <p className="text-sm text-red-500">{formErrors.nome}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="email@exemplo.com"
                value={formData.email}
                onChange={handleChange}
              />
              {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                name="telefone"
                placeholder="(00) 00000-0000"
                value={formData.telefone}
                onChange={handleChange}
              />
              {formErrors.telefone && <p className="text-sm text-red-500">{formErrors.telefone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo</Label>
              <Input
                id="cargo"
                name="cargo"
                placeholder="Ex: Desenvolvedor, Gerente, etc."
                value={formData.cargo}
                onChange={handleChange}
              />
              {formErrors.cargo && <p className="text-sm text-red-500">{formErrors.cargo}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="departamento">Departamento</Label>
              <Input
                id="departamento"
                name="departamento"
                placeholder="Ex: Tecnologia, Marketing, etc."
                value={formData.departamento}
                onChange={handleChange}
              />
              {formErrors.departamento && <p className="text-sm text-red-500">{formErrors.departamento}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
