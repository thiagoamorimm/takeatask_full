"use client"

import type React from "react"

import { useState } from "react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Upload, MessageSquare, Paperclip, Clock, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import TagSelector from "@/components/tag-selector"
import ColoredTag from "@/components/colored-tag"

interface CriarTarefaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTarefaCriada?: () => void
}

export default function CriarTarefaDialog({ open, onOpenChange, onTarefaCriada }: CriarTarefaDialogProps) {
  const [dataVencimento, setDataVencimento] = useState<Date | undefined>(undefined)
  const [tags, setTags] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string>("pendente")
  const [selectedPrioridade, setSelectedPrioridade] = useState<string>("media")
  const [selectedResponsavel, setSelectedResponsavel] = useState<string | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("informacoes")
  const [comentarios, setComentarios] = useState<string[]>([])
  const [novoComentario, setNovoComentario] = useState("")
  const [anexos, setAnexos] = useState<{ nome: string; tamanho: string; tipo: string }[]>([])

  const adicionarComentario = () => {
    if (novoComentario.trim()) {
      setComentarios([...comentarios, novoComentario.trim()])
      setNovoComentario("")
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const novosAnexos = Array.from(files).map((file) => ({
        nome: file.name,
        tamanho: formatFileSize(file.size),
        tipo: file.type,
      }))
      setAnexos([...anexos, ...novosAnexos])
    }
    // Limpar o input para permitir selecionar o mesmo arquivo novamente
    e.target.value = ""
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const removerAnexo = (index: number) => {
    const novosAnexos = [...anexos]
    novosAnexos.splice(index, 1)
    setAnexos(novosAnexos)
  }

  const resetForm = () => {
    setDataVencimento(undefined)
    setTags([])
    setSelectedStatus("pendente")
    setSelectedPrioridade("media")
    setSelectedResponsavel(undefined)
    setComentarios([])
    setNovoComentario("")
    setAnexos([])
    setActiveTab("informacoes")
    // Resetar campos do formulário que não são controlados por estado aqui, se necessário
    const form = document.getElementById("criar-tarefa-form") as HTMLFormElement | null
    form?.reset()
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const nome = formData.get("titulo") as string
    const descricao = formData.get("descricao") as string
    // status, prioridade e responsavel virão dos estados controlados

    const statusMap: { [key: string]: string } = {
      pendente: "A_FAZER", // Corrigido para corresponder ao Enum do backend
      andamento: "EM_ANDAMENTO",
      concluida: "CONCLUIDA",
      // Adicionar outros mapeamentos se necessário (ex: bloqueada, em_revisao)
    }
    const prioridadeMap: { [key: string]: string } = {
      baixa: "BAIXA",
      media: "MEDIA",
      alta: "ALTA",
    }

    const tarefaData = {
      nome,
      descricao,
      status: statusMap[selectedStatus] || "PENDENTE",
      prioridade: prioridadeMap[selectedPrioridade] || "MEDIA",
      responsavelId: selectedResponsavel ? parseInt(selectedResponsavel, 10) : null,
      dataPrazo: dataVencimento ? dataVencimento.toISOString().slice(0, 19) : null, // Formato YYYY-MM-DDTHH:mm:ss
      tags: Array.from(tags), // Convertido para Array
    }

    console.log("Enviando dados para API:", tarefaData)

    try {
      const response = await fetch("http://localhost:8081/api/tarefas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tarefaData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Erro da API:", errorData)
        // Aqui você pode adicionar lógica para mostrar o erro ao usuário (ex: usando um toast)
        throw new Error(`Erro ao criar tarefa: ${response.statusText} - ${JSON.stringify(errorData)}`)
      }

      // Sucesso
      console.log("Tarefa criada com sucesso!")
      onOpenChange(false)
      resetForm()
      if (onTarefaCriada) {
        onTarefaCriada()
      }
    } catch (error) {
      console.error("Erro ao criar tarefa:", error)
      // Mostrar erro para o usuário (ex: toast)
      alert(`Falha ao criar tarefa: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Obter a data atual formatada para o histórico
  const dataAtual = format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })

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
          <DialogTitle>Nova Tarefa</DialogTitle>
          <DialogDescription>Preencha os detalhes da nova tarefa. Clique em salvar quando terminar.</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="informacoes">Informações</TabsTrigger>
            <TabsTrigger value="comentarios" className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              Comentários
              {comentarios.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {comentarios.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="anexos" className="flex items-center gap-1">
              <Paperclip className="h-4 w-4" />
              Anexos
              {anexos.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {anexos.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="historico" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Histórico
            </TabsTrigger>
          </TabsList>

          <form id="criar-tarefa-form" onSubmit={handleSubmit}>
            <TabsContent value="informacoes" className="space-y-4 py-2">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="titulo">Título</Label>
                    <Input id="titulo" name="titulo" placeholder="Digite o título da tarefa" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea id="descricao" name="descricao" placeholder="Descreva a tarefa em detalhes" rows={3} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="andamento">Em andamento</SelectItem>
                        <SelectItem value="concluida">Concluída</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prioridade">Prioridade</Label>
                    <Select value={selectedPrioridade} onValueChange={setSelectedPrioridade}>
                      <SelectTrigger id="prioridade">
                        <SelectValue placeholder="Selecione a prioridade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baixa">Baixa</SelectItem>
                        <SelectItem value="media">Média</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="responsavel">Responsável</Label>
                    <Select value={selectedResponsavel} onValueChange={setSelectedResponsavel}>
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
            </TabsContent>

            <TabsContent value="comentarios" className="space-y-4 py-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="novoComentario">Adicionar comentário</Label>
                  <Textarea
                    id="novoComentario"
                    placeholder="Digite seu comentário..."
                    value={novoComentario}
                    onChange={(e) => setNovoComentario(e.target.value)}
                    rows={3}
                  />
                  <Button
                    type="button"
                    onClick={adicionarComentario}
                    disabled={!novoComentario.trim()}
                    className="mt-2"
                  >
                    Adicionar Comentário
                  </Button>
                </div>

                <div className="space-y-3">
                  {comentarios.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhum comentário adicionado ainda.
                    </p>
                  ) : (
                    comentarios.map((comentario, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="João Silva" />
                              <AvatarFallback>JS</AvatarFallback>
                            </Avatar>
                            <div className="flex-grow space-y-1">
                              <div>
                                <span className="font-medium">João Silva</span>{" "}
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                </span>
                              </div>
                              <p className="text-sm">{comentario}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                const novosComentarios = [...comentarios]
                                novosComentarios.splice(index, 1)
                                setComentarios(novosComentarios)
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="anexos" className="space-y-4 py-2">
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Arraste arquivos para fazer upload ou clique no botão abaixo
                    </p>
                    <Label
                      htmlFor="file-upload"
                      className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                      Selecionar Arquivos
                    </Label>
                    <Input id="file-upload" type="file" multiple className="hidden" onChange={handleFileChange} />
                  </div>
                </div>

                <div className="space-y-2">
                  {anexos.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-2">Nenhum anexo adicionado ainda.</p>
                  ) : (
                    anexos.map((anexo, index) => (
                      <Card key={index} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Paperclip className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium text-sm">{anexo.nome}</p>
                                <p className="text-xs text-muted-foreground">{anexo.tamanho}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removerAnexo(index)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="historico" className="space-y-4 py-2">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  O histórico será gerado automaticamente após a criação da tarefa.
                </p>

                {comentarios.length > 0 && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="João Silva" />
                          <AvatarFallback>JS</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <p className="text-sm">
                            <span className="font-medium">João Silva</span>{" "}
                            <span>adicionará {comentarios.length} comentário(s)</span>
                          </p>
                          <p className="text-xs text-muted-foreground">{dataAtual}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {anexos.length > 0 && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="João Silva" />
                          <AvatarFallback>JS</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <p className="text-sm">
                            <span className="font-medium">João Silva</span>{" "}
                            <span>anexará {anexos.length} arquivo(s)</span>
                          </p>
                          <p className="text-xs text-muted-foreground">{dataAtual}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar Tarefa"}
              </Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
