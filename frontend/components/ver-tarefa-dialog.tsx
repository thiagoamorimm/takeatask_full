"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { adicionarComentario, fetchComentariosPorTarefa } from "@/services/comentario-service"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import ColoredTag from "@/components/colored-tag"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Clock, AlertCircle, CheckCircle, MessageSquare, Paperclip, Plus, Upload } from "lucide-react"
import SubtarefaItem from "@/components/subtarefa-item"
import ComentarioItem from "@/components/comentario-item"
import AnexoItem from "@/components/anexo-item"

interface VerTarefaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tarefaId: number | null
}

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
  comentarios: [
    {
      id: 1,
      texto: "Precisamos garantir que o refresh token tenha um tempo de expiração adequado.",
      data: "2023-05-11T08:45:00",
      usuario: {
        id: 2,
        nome: "Maria Oliveira",
        avatar: "/placeholder.svg?height=40&width=40",
        iniciais: "MO",
      },
    },
    {
      id: 2,
      texto: "Concordo. Também precisamos implementar a revogação de tokens em caso de logout.",
      data: "2023-05-11T09:30:00",
      usuario: {
        id: 1,
        nome: "João Silva",
        avatar: "/placeholder.svg?height=40&width=40",
        iniciais: "JS",
      },
    },
    {
      id: 3,
      texto: "Vou adicionar testes unitários para garantir que a autenticação esteja funcionando corretamente.",
      data: "2023-05-12T14:20:00",
      usuario: {
        id: 3,
        nome: "Pedro Santos",
        avatar: "/placeholder.svg?height=40&width=40",
        iniciais: "PS",
      },
    },
  ],
  subtarefas: [
    {
      id: 1,
      titulo: "Configurar Spring Security",
      concluida: true,
      responsavel: {
        id: 1,
        nome: "João Silva",
        iniciais: "JS",
      },
    },
    {
      id: 2,
      titulo: "Implementar autenticação JWT",
      concluida: false,
      responsavel: {
        id: 1,
        nome: "João Silva",
        iniciais: "JS",
      },
    },
    {
      id: 3,
      titulo: "Configurar roles e permissões",
      concluida: false,
      responsavel: {
        id: 3,
        nome: "Pedro Santos",
        iniciais: "PS",
      },
    },
    {
      id: 4,
      titulo: "Implementar refresh token",
      concluida: false,
      responsavel: {
        id: 1,
        nome: "João Silva",
        iniciais: "JS",
      },
    },
  ],
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
    {
      id: 3,
      acao: "Subtarefa 'Configurar Spring Security' concluída",
      data: "2023-05-11T16:20:00",
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

export default function VerTarefaDialog({ open, onOpenChange, tarefaId }: VerTarefaDialogProps) {
  const [tarefa, setTarefa] = useState(tarefaMock)
  const [novoComentario, setNovoComentario] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("detalhes")
  const [isUploadingFile, setIsUploadingFile] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoadingComentarios, setIsLoadingComentarios] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Em um cenário real, buscaríamos os dados da tarefa com base no ID
  // useEffect(() => {
  //   if (tarefaId && open) {
  //     // Buscar dados da tarefa
  //     // setTarefa(dadosDaTarefa)
  //   }
  // }, [tarefaId, open])

  // Carregar comentários quando o diálogo for aberto
  useEffect(() => {
    if (tarefaId && open) {
      carregarComentarios()
    }
  }, [tarefaId, open, activeTab])

  // Função para carregar comentários da API
  const carregarComentarios = async () => {
    if (!tarefaId || activeTab !== "comentarios") return

    try {
      setIsLoadingComentarios(true)
      const comentarios = await fetchComentariosPorTarefa(Number(tarefaId))

      // Atualizar a tarefa com os comentários carregados
      setTarefa(prevTarefa => ({
        ...prevTarefa,
        comentarios: comentarios.map(comentario => ({
          ...comentario,
          usuario: {
            ...comentario.usuario,
            avatar: comentario.usuario.avatar || ""
          }
        }))
      }))
    } catch (error) {
      console.error("Erro ao carregar comentários:", error)
      toast({
        title: "Erro ao carregar comentários",
        description: "Não foi possível carregar os comentários. Tente novamente mais tarde.",
        variant: "destructive"
      })
    } finally {
      setIsLoadingComentarios(false)
    }
  }

  const handleSubmitComentario = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!novoComentario.trim() || !tarefaId) return

    setIsSubmitting(true)

    try {
      // Enviar comentário para a API
      const novoComentarioObj = await adicionarComentario(Number(tarefaId), novoComentario)

      // Adicionar comentário localmente
      setTarefa({
        ...tarefa,
        comentarios: [
          ...tarefa.comentarios,
          {
            ...novoComentarioObj,
            usuario: {
              ...novoComentarioObj.usuario,
              avatar: novoComentarioObj.usuario.avatar || ""
            }
          }
        ],
      })

      setNovoComentario("")

      toast({
        title: "Comentário adicionado",
        description: "Seu comentário foi adicionado com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error)
      toast({
        title: "Erro ao adicionar comentário",
        description: "Não foi possível adicionar o comentário. Tente novamente mais tarde.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleSubtarefa = async (id: number) => {
    // Simulando atualização na API
    try {
      // Aqui seria a chamada para a API
      console.log("Atualizando subtarefa na API...")

      // Simulando um delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Atualizar subtarefa localmente
      const subtarefasAtualizadas = tarefa.subtarefas.map((st) =>
        st.id === id ? { ...st, concluida: !st.concluida } : st,
      )

      setTarefa({
        ...tarefa,
        subtarefas: subtarefasAtualizadas,
      })
    } catch (error) {
      console.error("Erro ao atualizar subtarefa:", error)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploadingFile(true)

    try {
      // Em um cenário real, aqui seria feito o upload para o servidor
      console.log("Enviando arquivos para API...", files)

      // Simulando um delay para o upload
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Criar novos anexos a partir dos arquivos selecionados
      const novosAnexos = Array.from(files).map((file, index) => ({
        id: Math.max(0, ...tarefa.anexos.map(a => a.id)) + index + 1,
        nome: file.name,
        tamanho: formatFileSize(file.size),
        tipo: file.type,
        dataUpload: new Date().toISOString(),
        usuario: {
          id: 1, // ID do usuário atual (simulado)
          nome: "João Silva", // Nome do usuário atual (simulado)
          iniciais: "JS"
        }
      }))

      // Atualizar a tarefa com os novos anexos
      setTarefa({
        ...tarefa,
        anexos: [...tarefa.anexos, ...novosAnexos]
      })

      // Limpar o input de arquivo para permitir selecionar o mesmo arquivo novamente
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Erro ao fazer upload de arquivos:", error)
    } finally {
      setIsUploadingFile(false)
    }
  }

  // Função para formatar o tamanho do arquivo
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Função para renomear um anexo
  const handleRenameAnexo = (id: number, newName: string) => {
    // Em um cenário real, aqui seria feita uma chamada para a API
    console.log(`Renomeando anexo ${id} para ${newName}`)

    // Atualizar o anexo localmente
    const anexosAtualizados = tarefa.anexos.map(anexo =>
      anexo.id === id ? { ...anexo, nome: newName } : anexo
    )

    setTarefa({
      ...tarefa,
      anexos: anexosAtualizados
    })
  }

  // Função para excluir um anexo
  const handleDeleteAnexo = (id: number) => {
    // Em um cenário real, aqui seria feita uma chamada para a API
    console.log(`Excluindo anexo ${id}`)

    // Remover o anexo localmente
    const anexosAtualizados = tarefa.anexos.filter(anexo => anexo.id !== id)

    setTarefa({
      ...tarefa,
      anexos: anexosAtualizados
    })
  }

  // Funções para drag and drop
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isDragging) {
      setIsDragging(true)
    }
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (!files || files.length === 0) return

    setIsUploadingFile(true)

    try {
      // Em um cenário real, aqui seria feito o upload para o servidor
      console.log("Enviando arquivos para API via drag and drop...", files)

      // Simulando um delay para o upload
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Criar novos anexos a partir dos arquivos selecionados
      const novosAnexos = Array.from(files).map((file, index) => ({
        id: Math.max(0, ...tarefa.anexos.map(a => a.id)) + index + 1,
        nome: file.name,
        tamanho: formatFileSize(file.size),
        tipo: file.type,
        dataUpload: new Date().toISOString(),
        usuario: {
          id: 1, // ID do usuário atual (simulado)
          nome: "João Silva", // Nome do usuário atual (simulado)
          iniciais: "JS"
        }
      }))

      // Atualizar a tarefa com os novos anexos
      setTarefa({
        ...tarefa,
        anexos: [...tarefa.anexos, ...novosAnexos]
      })
    } catch (error) {
      console.error("Erro ao fazer upload de arquivos via drag and drop:", error)
    } finally {
      setIsUploadingFile(false)
    }
  }

  // Calcular progresso
  const subtarefasConcluidas = tarefa.subtarefas.filter((st) => st.concluida).length
  const totalSubtarefas = tarefa.subtarefas.length
  const progresso = totalSubtarefas > 0 ? (subtarefasConcluidas / totalSubtarefas) * 100 : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{tarefa.titulo}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div className="md:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
                <TabsTrigger value="comentarios" className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  Comentários
                </TabsTrigger>
                <TabsTrigger value="anexos" className="flex items-center gap-1">
                  <Paperclip className="h-4 w-4" />
                  Anexos
                </TabsTrigger>
                <TabsTrigger value="historico" className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Histórico
                </TabsTrigger>
              </TabsList>

              <TabsContent value="detalhes" className="space-y-4">
  <div>
    <h3 className="text-sm font-medium text-muted-foreground mb-2">Descrição</h3>
    <p className="text-sm">{tarefa.descricao}</p>
  </div>
</TabsContent>

              <TabsContent value="comentarios" className="space-y-4">
                {/* Formulário de comentário */}
                <div className="border rounded-md p-4 bg-card">
                  <form onSubmit={handleSubmitComentario} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="comentario" className="text-sm font-medium">
                        Adicionar comentário
                      </label>
                      <Textarea
                        id="comentario"
                        placeholder="Escreva seu comentário aqui..."
                        value={novoComentario}
                        onChange={(e) => setNovoComentario(e.target.value)}
                        rows={3}
                        className="resize-none"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={isSubmitting || !novoComentario.trim()}
                        className="flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full"></div>
                            <span>Enviando...</span>
                          </>
                        ) : (
                          <>
                            <MessageSquare className="h-4 w-4" />
                            <span>Comentar</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>

                {/* Lista de comentários */}
                <div className="space-y-4 mt-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Comentários</h3>
                  {isLoadingComentarios ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                      <p className="text-sm text-muted-foreground">Carregando comentários...</p>
                    </div>
                  ) : tarefa.comentarios.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">Nenhum comentário ainda.</p>
                  ) : (
                    tarefa.comentarios.map((comentario) => (
                      <ComentarioItem key={comentario.id} comentario={comentario} />
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="anexos" className="space-y-4">
                <div className="border rounded-md p-4 bg-card">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Anexos</label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                      multiple
                    />
                    <Button
                      className="flex items-center gap-2"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingFile}
                    >
                      <Upload className="h-4 w-4" />
                      {isUploadingFile ? "Enviando..." : "Upload"}
                    </Button>
                  </div>

                  <div
                    ref={dropZoneRef}
                    className={`border-2 border-dashed rounded-md p-6 transition-colors ${isDragging
                      ? "border-primary bg-primary/5"
                      : "border-gray-300 dark:border-gray-700"
                      }`}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {isUploadingFile ? (
                      <div className="flex flex-col items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                        <p className="text-sm text-muted-foreground">Enviando arquivos...</p>
                      </div>
                    ) : tarefa.anexos.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground text-center">
                          Arraste e solte arquivos aqui ou clique no botão Upload acima
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {tarefa.anexos.map((anexo) => (
                          <AnexoItem
                            key={anexo.id}
                            anexo={anexo}
                            onRename={handleRenameAnexo}
                            onDelete={handleDeleteAnexo}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="historico" className="space-y-4">
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
              </TabsContent>
            </Tabs>
        </div>

        <div className="space-y-6">
            <div className="space-y-4">
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
                    {subtarefasConcluidas}/{totalSubtarefas}
                  </span>
                </div>
                <Progress value={progresso} className="h-2" />
              </div>

              <Separator />

              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Tags</span>
                <div className="flex flex-wrap gap-2">
                  {tarefa.tags.map((tag) => (
                    <ColoredTag key={tag} name={tag} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
