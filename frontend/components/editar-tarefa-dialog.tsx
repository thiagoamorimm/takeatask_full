"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import TagSelector from "@/components/tag-selector"

interface EditarTarefaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tarefaId: number | null
  onTarefaAtualizada?: () => void
}

// Dados de exemplo
const tarefasMock = [
  {
    id: 1,
    titulo: "Implementar autenticação de usuários",
    descricao: "Criar sistema de login e registro usando Spring Security",
    status: "Em andamento",
    prioridade: "Alta",
    responsavel: {
      id: 1,
      nome: "João Silva",
    },
    dataVencimento: "2023-05-20T18:00:00",
    tags: ["Backend", "Segurança"],
  },
  {
    id: 2,
    titulo: "Criar interface de gerenciamento de tarefas",
    descricao: "Desenvolver telas para CRUD de tarefas com React",
    status: "Pendente",
    prioridade: "Média",
    responsavel: {
      id: 3,
      nome: "Pedro Santos",
    },
    dataVencimento: "2023-05-25T18:00:00",
    tags: ["Frontend", "UI/UX"],
  },
]

export default function EditarTarefaDialog({
  open,
  onOpenChange,
  tarefaId,
  onTarefaAtualizada,
}: EditarTarefaDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dataVencimento, setDataVencimento] = useState<Date | undefined>(undefined)
  const [tags, setTags] = useState<string[]>([])

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    status: "",
    prioridade: "",
    responsavel: "",
  })

  // Carregar dados da tarefa
  useEffect(() => {
    if (tarefaId && open) {
      const tarefa = tarefasMock.find((t) => t.id === tarefaId)

      if (tarefa) {
        setFormData({
          titulo: tarefa.titulo,
          descricao: tarefa.descricao,
          status: tarefa.status,
          prioridade: tarefa.prioridade,
          responsavel: tarefa.responsavel.id.toString(),
        })
        setDataVencimento(new Date(tarefa.dataVencimento))
        setTags(tarefa.tags)
      }

      setIsLoading(false)
    }
  }, [tarefaId, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }



  const resetForm = () => {
    setFormData({
      titulo: "",
      descricao: "",
      status: "",
      prioridade: "",
      responsavel: "",
    })
    setDataVencimento(undefined)
    setTags([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulando envio para API
    try {
      // Aqui seria a chamada para a API
      console.log("Enviando dados para API...", {
        ...formData,
        dataVencimento,
        tags,
      })

      // Simulando um delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mostrar notificação de sucesso
      toast({
        title: "Tarefa atualizada",
        description: "A tarefa foi atualizada com sucesso.",
      })

      // Fechar o modal
      onOpenChange(false)

      // Notificar que a tarefa foi atualizada
      if (onTarefaAtualizada) {
        onTarefaAtualizada()
      }
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar a tarefa.",
        variant: "destructive",
      })
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
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Tarefa</DialogTitle>
          <DialogDescription>Atualize as informações da tarefa. Clique em salvar quando terminar.</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p>Carregando...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título</Label>
                  <Input
                    id="titulo"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    placeholder="Digite o título da tarefa"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  placeholder="Descreva a tarefa em detalhes"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pendente">Pendente</SelectItem>
                      <SelectItem value="Em andamento">Em andamento</SelectItem>
                      <SelectItem value="Concluída">Concluída</SelectItem>
                      <SelectItem value="Atrasada">Atrasada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prioridade">Prioridade</Label>
                  <Select
                    value={formData.prioridade}
                    onValueChange={(value) => handleSelectChange("prioridade", value)}
                  >
                    <SelectTrigger id="prioridade">
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Baixa">Baixa</SelectItem>
                      <SelectItem value="Média">Média</SelectItem>
                      <SelectItem value="Alta">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="responsavel">Responsável</Label>
                  <Select
                    value={formData.responsavel}
                    onValueChange={(value) => handleSelectChange("responsavel", value)}
                  >
                    <SelectTrigger id="responsavel">
                      <SelectValue placeholder="Selecione o responsável" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">João Silva</SelectItem>
                      <SelectItem value="2">Maria Oliveira</SelectItem>
                      <SelectItem value="3">Pedro Santos</SelectItem>
                      <SelectItem value="4">Ana Costa</SelectItem>
                      <SelectItem value="5">Lucas Mendes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataVencimento">Data de Vencimento</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dataVencimento && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dataVencimento ? (
                          format(dataVencimento, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dataVencimento}
                        onSelect={setDataVencimento}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <TagSelector
                  selectedTags={tags}
                  onTagsChange={setTags}
                />
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
        )}
      </DialogContent>
    </Dialog>
  )
}
