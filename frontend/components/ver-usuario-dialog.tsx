"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Phone, Building2, Users, Calendar, BadgeCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Usuario {
  id: number
  nome: string
  email: string
  telefone?: string
  cargo?: string
  departamento?: string
  status: string
  avatar?: string
  iniciais: string
  dataCriacao?: string
  perfil?: string
}

interface VerUsuarioDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  usuario: Usuario | null
}

export default function VerUsuarioDialog({
  open,
  onOpenChange,
  usuario,
}: VerUsuarioDialogProps) {
  if (!usuario) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Detalhes do Usuário</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex flex-col items-center mb-6">
            <Avatar className="h-20 w-20 mb-4">
              <AvatarImage src={usuario.avatar || "/placeholder.svg"} alt={usuario.nome} />
              <AvatarFallback className="text-xl">{usuario.iniciais}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold">{usuario.nome}</h2>
            <Badge 
              variant={usuario.status === "Ativo" ? "default" : "secondary"}
              className="mt-2"
            >
              {usuario.status}
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-md border">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{usuario.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-md border">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                  <p>{usuario.telefone || "Não informado"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-md border">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cargo</p>
                  <p>{usuario.cargo || "Não informado"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-md border">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Departamento</p>
                  <p>{usuario.departamento || "Não informado"}</p>
                </div>
              </div>

              {usuario.perfil && (
                <div className="flex items-center gap-3 p-3 rounded-md border">
                  <BadgeCheck className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Perfil</p>
                    <p>{usuario.perfil}</p>
                  </div>
                </div>
              )}

              {usuario.dataCriacao && (
                <div className="flex items-center gap-3 p-3 rounded-md border">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Membro desde</p>
                    <p>{new Date(usuario.dataCriacao).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
