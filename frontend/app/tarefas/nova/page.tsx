"use client"

import type React from "react"

import { useState } from "react"
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
import { CalendarIcon, X, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

// Nota: Esta página está sendo mantida como referência, mas a criação de tarefas
// agora é feita principalmente através do modal em components/criar-tarefa-dialog.tsx

export default function NovaTarefaPage() {
  const router = useRouter()
  const [dataVencimento, setDataVencimento] = useState<Date | undefined>(undefined)
  const [tags, setTags] = useState<string[]>([])
  const [novaTag, setNovaTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      console.log("Enviando dados para API...")

      // Simulando um delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirecionar para a lista de tarefas
      router.push("/tarefas")
      router.refresh()
    } catch (error) {
      console.error("Erro ao criar tarefa:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Nova Tarefa</h1>
        <p className="text-muted-foreground">Crie uma nova tarefa no sistema.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações da Tarefa</CardTitle>
            <CardDescription>Preencha os detalhes da nova tarefa.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título</Label>
                  <Input id="titulo" placeholder="Digite o título da tarefa" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea id="descricao" placeholder="Descreva a tarefa em detalhes" rows={4} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue="pendente">
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
                  <Select defaultValue="media">
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
                  <Select>
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
              {isSubmitting ? "Salvando..." : "Salvar Tarefa"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
