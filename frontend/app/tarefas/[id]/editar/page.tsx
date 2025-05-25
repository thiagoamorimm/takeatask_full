"use client"

import type React from "react"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, X, Plus, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

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

export default function EditarTarefaPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const params = use(paramsPromise)
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dataVencimento, setDataVencimento] = useState<Date | undefined>(undefined)
  const [tags, setTags] = useState<string[]>([])
  const [novaTag, setNovaTag] = useState("")
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    status: "",
    prioridade: "",
    responsavel: "",
  })

  // Extract the ID once to use in the dependency array
  const tarefaId = params?.id

  // Carregar dados da tarefa
  useEffect(() => {
    if (!tarefaId) return

    const id = Number.parseInt(tarefaId)
    const tarefa = tarefasMock.find((t) => t.id === id)

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
  }, [tarefaId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const adicionarTag = () => {
    if (novaTag.trim() && !tags.includes(novaTag.trim())) {
      setTags([...tags, novaTag.trim()])
      setNovaTag("")
    }
  }

  const removerTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
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

      // Redirecionar para a lista de tarefas
      router.push("/tarefas")
      router.refresh()
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Editar Tarefa</h1>
        </div>
        <p className="text-muted-foreground">Atualize as informações da tarefa.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações da Tarefa</CardTitle>
            <CardDescription>Edite os detalhes da tarefa.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removerTag(tag)}
                        className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remover tag {tag}</span>
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Adicionar tag"
                    value={novaTag}
                    onChange={(e) => setNovaTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        adicionarTag()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" size="icon" onClick={adicionarTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
