"use client"

import React, { useState, useEffect, use } from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Clock,
  AlertCircle,
  CheckCircle,
  MoreHorizontal,
  ArrowLeft,
  Edit,
  Trash2,
  MessageSquare,
  Paperclip,
  Plus,
  Upload,
} from "lucide-react"
import Link from "next/link"
import ComentarioItem from "@/components/comentario-item"
import AnexoItem from "@/components/anexo-item"
import { fetchComentariosPorTarefa, adicionarComentario, Comentario as ComentarioFrontend } from "@/services/comentario-service";

// Dados de exemplo
const tarefaMock = {
  id: 1,
  titulo: "Implementar autenticação de usuários",
  descricao:
    "Criar sistema de login e registro usando Spring Security. Implementar JWT para autenticação stateless e configurar roles para autorização de acesso aos endpoints da API.",
  status: "Em andamento",
  prioridade: "Alta",
  responsavel: {
    id: 1,
    nome: "João Silva",
    avatar: "/placeholder.svg?height=40&width=40",
    iniciais: "JS",
  },
  criador: {
    id: 2,
    nome: "Maria Oliveira",
    avatar: "/placeholder.svg?height=40&width=40",
    iniciais: "MO",
  },
  dataCriacao: "2023-05-10T10:30:00",
  dataVencimento: "2023-05-20T18:00:00",
  tags: ["Backend", "Segurança", "API"],
  anexos: [
    {
      id: 1,
      nome: "diagrama-auth.pdf",
      tamanho: "2.4 MB",
      tipo: "application/pdf",
      dataUpload: "2023-05-10T14:30:00",
      usuario: {
        id: 2,
        nome: "Maria Oliveira",
        iniciais: "MO",
      },
    },
    {
      id: 2,
      nome: "exemplo-jwt.json",
      tamanho: "4 KB",
      tipo: "application/json",
      dataUpload: "2023-05-11T09:15:00",
      usuario: {
        id: 1,
        nome: "João Silva",
        iniciais: "JS",
      },
    },
  ],
  comentarios: [], // Removido o mock de comentários daqui
  historico: [
    {
      id: 1,
      acao: "Tarefa criada",
      data: "2023-05-10T10:30:00",
      usuario: {
        id: 2,
        nome: "Maria Oliveira",
        iniciais: "MO",
      },
    },
    {
      id: 2,
      acao: "Status alterado para 'Em andamento'",
      data: "2023-05-10T14:45:00",
      usuario: {
        id: 1,
        nome: "João Silva",
        iniciais: "JS",
      },
    },
  ],
}

// Função para formatar data
function formatarData(dataString: string) {
  const data = new Date(dataString)
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(data)
}

// Componente para exibir o status com ícone
function StatusTarefa({ status }: { status: string }) {
  switch (status) {
    case "Em andamento":
      return (
        <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200">
          <Clock className="h-3 w-3" />
          {status}
        </Badge>
      )
    case "Pendente":
      return (
        <Badge variant="outline" className="flex items-center gap-1 bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="h-3 w-3" />
          {status}
        </Badge>
      )
    case "Concluída":
      return (
        <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="h-3 w-3" />
          {status}
        </Badge>
      )
    case "Atrasada":
      return (
        <Badge variant="outline" className="flex items-center gap-1 bg-red-50 text-red-700 border-red-200">
          <AlertCircle className="h-3 w-3" />
          {status}
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function DetalheTarefaPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const params = use(paramsPromise);

  const [tarefa, setTarefa] = useState({...tarefaMock, comentarios: [] }); // Inicializa sem comentários mock
  const [comentarios, setComentarios] = useState<ComentarioFrontend[]>([]);
  const [novoComentario, setNovoComentario] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (params.id) {
      const carregarComentarios = async () => {
        try {
          // Idealmente, também buscaríamos os dados da tarefa aqui
          // setTarefa(await fetchTarefaPorId(Number(params.id))); 
          const comentariosDaApi = await fetchComentariosPorTarefa(Number(params.id));
          setComentarios(comentariosDaApi);
        } catch (error) {
          console.error("Erro ao buscar dados da tarefa ou comentários:", error);
          // Tratar erro (ex: mostrar mensagem para o usuário, redirecionar)
        }
      };
      carregarComentarios();
    }
  }, [params.id]);

  const handleSubmitComentario = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!novoComentario.trim() || !params.id) return

    setIsSubmitting(true)

    try {
      const novoComentarioAdicionado = await adicionarComentario(Number(params.id), novoComentario);
      // Adiciona o novo comentário no início da lista para melhor UX
      setComentarios(prevComentarios => [novoComentarioAdicionado, ...prevComentarios]);
      setNovoComentario("")
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
      // Adicionar feedback para o usuário sobre o erro
    } finally {
      setIsSubmitting(false)
    }
  }

  const progresso = 0 // Definido como 0 temporariamente, pode ser ajustado ou removido

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{tarefa.titulo}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {params.id && (
            <Link href={`/tarefas/${params.id}/editar`}>
              <Button variant="outline" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Editar
              </Button>
            </Link>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Alterar status</DropdownMenuItem>
              <DropdownMenuItem>Alterar responsável</DropdownMenuItem>
              <DropdownMenuItem>Duplicar tarefa</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir tarefa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Tarefa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Descrição</h3>
                <p className="text-sm">{tarefa.descricao}</p>
              </div>

              {/* Removida seção de Subtarefas */}
              {/* <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Subtarefas</h3>
                <div className="space-y-2">
                  {tarefa.subtarefas.map((subtarefa) => (
                    <SubtarefaItem
                      key={subtarefa.id}
                      subtarefa={subtarefa}
                      onToggle={() => toggleSubtarefa(subtarefa.id)}
                    />
                  ))}
                  <Button variant="ghost" className="flex items-center gap-2 mt-2 h-8 text-sm">
                    <Plus className="h-4 w-4" />
                    Adicionar subtarefa
                  </Button>
                </div>
              </div> */}
            </CardContent>
          </Card>

          <Tabs defaultValue="comentarios" className="space-y-4">
            <TabsList>
              <TabsTrigger value="comentarios" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Comentários ({comentarios.length})
              </TabsTrigger>
              <TabsTrigger value="anexos" className="flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                Anexos ({tarefa.anexos.length})
              </TabsTrigger>
              <TabsTrigger value="historico" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Histórico
              </TabsTrigger>
            </TabsList>

            <TabsContent value="comentarios" className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <form onSubmit={handleSubmitComentario} className="space-y-4">
                    <Textarea
                      placeholder="Adicione um comentário..."
                      value={novoComentario}
                      onChange={(e) => setNovoComentario(e.target.value)}
                      rows={3}
                    />
                    <div className="flex justify-end">
                      <Button type="submit" disabled={isSubmitting || !novoComentario.trim()}>
                        {isSubmitting ? "Enviando..." : "Comentar"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {comentarios.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">Nenhum comentário ainda.</p>
                    </CardContent>
                  </Card>
                ) : (
                  comentarios.map((comentario) => <ComentarioItem key={comentario.id} comentario={comentario} />)
                )}
              </div>
            </TabsContent>

            <TabsContent value="anexos" className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Arraste arquivos para fazer upload ou clique no botão abaixo.
                    </p>
                    <Button className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Upload
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                {tarefa.anexos.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">Nenhum anexo ainda.</p>
                    </CardContent>
                  </Card>
                ) : (
                  tarefa.anexos.map((anexo) => <AnexoItem key={anexo.id} anexo={anexo} />)
                )}
              </div>
            </TabsContent>

            <TabsContent value="historico" className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {tarefa.historico.map((item) => (
                      <div key={item.id} className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{item.usuario.iniciais}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <p className="text-sm">
                            <span className="font-medium">{item.usuario.nome}</span> <span>{item.acao}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">{new Date(item.data).toLocaleString("pt-BR")}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <StatusTarefa status={tarefa.status} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Prioridade</span>
                  <Badge
                    variant="outline"
                    className={`
                    ${tarefa.prioridade === "Alta" ? "bg-red-50 text-red-700 border-red-200" : ""}
                    ${tarefa.prioridade === "Média" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""}
                    ${tarefa.prioridade === "Baixa" ? "bg-green-50 text-green-700 border-green-200" : ""}
                  `}
                  >
                    {tarefa.prioridade}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Responsável</span>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={tarefa.responsavel.avatar || "/placeholder.svg"}
                        alt={tarefa.responsavel.nome}
                      />
                      <AvatarFallback>{tarefa.responsavel.iniciais}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{tarefa.responsavel.nome}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Criador</span>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={tarefa.criador.avatar || "/placeholder.svg"} alt={tarefa.criador.nome} />
                      <AvatarFallback>{tarefa.criador.iniciais}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{tarefa.criador.nome}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Data de Criação</span>
                  <span className="text-sm">{formatarData(tarefa.dataCriacao)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Data de Vencimento</span>
                  <span className="text-sm">{formatarData(tarefa.dataVencimento)}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Progresso</span>
                  <span className="text-sm">
                    {progresso}%
                  </span>
                </div>
                <Progress value={progresso} className="h-2" />
              </div>

              <Separator />

              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Tags</span>
                <div className="flex flex-wrap gap-2">
                  {tarefa.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Alterar status
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Alterar responsável
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Adicionar anexo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
