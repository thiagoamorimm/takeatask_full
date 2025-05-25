"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, AlertCircle, CheckCircle, MoreHorizontal, Paperclip, MessageSquare, Search, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { apiService } from "@/services/api"

// Tipagem para Tarefa (baseado no mock, idealmente viria de um local compartilhado)
interface Usuario {
  id: number
  nome: string
  avatar?: string
  iniciais: string
}

interface Tarefa {
  id: number | string // Permitindo string para IDs que podem vir de APIs
  titulo: string
  descricao: string
  status: "Em andamento" | "Pendente" | "Concluída" | "Atrasada" | string // Permitindo outros status
  prioridade: "Alta" | "Média" | "Baixa" | string // Permitindo outras prioridades
  responsavel: Usuario
  criador: Usuario
  dataCriacao: string
  dataVencimento: string
  tags: string[]
  anexos: number
  comentarios: number
  subtarefas: {
    total: number
    concluidas: number
  }
}

type TipoFiltro = "minhas" | "equipe" | "todas";

// Interface para o DTO de Tarefa do backend (ajustar conforme necessário)
interface TarefaApiDTO {
  id: number | string;
  nome: string; // No backend é 'nome', no frontend é 'titulo'
  descricao: string;
  status: string;
  prioridade: string;
  responsavelId?: number;
  nomeResponsavel?: string;
  avatarResponsavel?: string;
  iniciaisResponsavel?: string;
  criadorId: number;
  nomeCriador: string;
  avatarCriador?: string;
  iniciaisCriador?: string;
  dataCriacao: string;
  dataPrazo: string; // No backend é 'dataPrazo', no frontend é 'dataVencimento'
  tags: { id: number, nome: string }[];
  anexos?: any[]; // A API deve retornar uma contagem ou uma lista de DTOs de anexo
  comentarios?: any[]; // Similar para comentários
  subtarefas?: { total: number, concluidas: number }; // Ajustar se a estrutura for diferente
}

async function fetchTarefasAPI(tipo: TipoFiltro, searchQuery?: string): Promise<Tarefa[]> {
  const params = new URLSearchParams();
  params.append("tipo", tipo);
  if (searchQuery && searchQuery.trim() !== "") {
    params.append("q", searchQuery.trim());
  }
  // TODO: Adicionar outros filtros se necessário (status, prioridade etc. do controller)
  // Ex: params.append("status", "EM_ANDAMENTO");

  try {
    // Usar o novo serviço de API com autenticação
    const data: TarefaApiDTO[] = await apiService.get<TarefaApiDTO[]>(`/api/tarefas?${params.toString()}`);
    console.log('Tarefas carregadas com sucesso:', data.length);
    
    // Mapear do DTO do backend para a interface Tarefa do frontend
    return data.map((dto): Tarefa => ({
      id: dto.id,
      titulo: dto.nome, // Mapeamento de 'nome' (backend) para 'titulo' (frontend)
      descricao: dto.descricao,
      status: dto.status as Tarefa["status"],
      prioridade: dto.prioridade as Tarefa["prioridade"],
      responsavel: {
        id: dto.responsavelId || 0,
        nome: dto.nomeResponsavel || "N/A",
        avatar: dto.avatarResponsavel, // Assumindo que o backend pode fornecer isso
        iniciais: dto.iniciaisResponsavel || (dto.nomeResponsavel ? dto.nomeResponsavel.substring(0, 2).toUpperCase() : "N/A")
      },
      criador: {
        id: dto.criadorId,
        nome: dto.nomeCriador,
        avatar: dto.avatarCriador, // Assumindo
        iniciais: dto.iniciaisCriador || (dto.nomeCriador ? dto.nomeCriador.substring(0, 2).toUpperCase() : "??")
      },
      dataCriacao: dto.dataCriacao,
      dataVencimento: dto.dataPrazo, // Mapeamento de 'dataPrazo' (backend) para 'dataVencimento' (frontend)
      tags: dto.tags ? dto.tags.map(tag => tag.nome) : [],
      // Para anexos e comentários, idealmente o backend retornaria a contagem.
      // Se retornar a lista, contamos aqui. Se não retornar nada, default para 0.
      anexos: Array.isArray(dto.anexos) ? dto.anexos.length : 0,
      comentarios: Array.isArray(dto.comentarios) ? dto.comentarios.length : 0,
      subtarefas: dto.subtarefas || { total: 0, concluidas: 0 },
    }));
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    throw new Error(error instanceof Error ? error.message : 'Erro ao carregar tarefas');
  }
}

// Função para formatar data
function formatarData(dataString: string | Date) {
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

export default function TarefasRecentes({ tipo }: { tipo: TipoFiltro }) {
  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Escutar evento de busca global (se existir um componente de busca global)
  useEffect(() => {
    const handleGlobalSearch = (event: Event) => {
      const customEvent = event as CustomEvent<{ query: string }>
      if (customEvent.detail && typeof customEvent.detail.query === "string") {
        setSearchQuery(customEvent.detail.query)
      }
    }
    // Supondo que o evento 'global-search' é disparado em algum lugar
    // window.addEventListener("global-search", handleGlobalSearch) // Comentado se não houver busca global
    // return () => window.removeEventListener("global-search", handleGlobalSearch)
  }, [])

  useEffect(() => {
    async function loadTarefas() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTarefasAPI(tipo, searchQuery);
        setTarefas(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError("Ocorreu um erro desconhecido ao buscar as tarefas.")
        }
        console.error(`Erro ao buscar tarefas (tipo: ${tipo}, query: ${searchQuery}):`, err)
      } finally {
        setLoading(false)
      }
    }
    loadTarefas()
  }, [tipo, searchQuery]) // Recarregar quando o tipo ou a busca mudar

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar tarefas..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading && (
        <div className="flex flex-col justify-center items-center h-32 space-y-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando tarefas...</p>
        </div>
      )}

      {error && (
        <Card className="bg-destructive/10 border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Erro ao carregar tarefas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{error}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Por favor, tente novamente mais tarde. Se o problema persistir, contate o suporte.
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && tarefas.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Nenhuma tarefa encontrada para os critérios selecionados.</p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && tarefas.length > 0 &&
        tarefas.map((tarefa) => (
          <Card key={tarefa.id} className="overflow-hidden">
            <CardHeader className="p-4 pb-0 flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-lg">
                  <Link href={`/tarefas/${tarefa.id}`} className="hover:underline">
                    {tarefa.titulo}
                  </Link>
                </CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  <StatusTarefa status={tarefa.status} />
                  <Badge
                    variant="outline"
                    className={`
                    ${tarefa.prioridade === "Alta" ? "bg-red-50 text-red-700 border-red-200" : ""}
                    ${tarefa.prioridade === "Média" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""}
                    ${tarefa.prioridade === "Baixa" ? "bg-green-50 text-green-700 border-green-200" : ""}
                  `}
                  >
                    Prioridade: {tarefa.prioridade}
                  </Badge>
                  {tarefa.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link href={`/tarefas/${tarefa.id}`} className="w-full">
                      Ver detalhes
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={`/tarefas/${tarefa.id}/editar`} className="w-full">
                      Editar
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Alterar status</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-4">{tarefa.descricao}</p>
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={tarefa.responsavel.avatar || "/placeholder.svg"}
                        alt={tarefa.responsavel.nome}
                      />
                      <AvatarFallback>{tarefa.responsavel.iniciais}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">Responsável: {tarefa.responsavel.nome}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={tarefa.criador.avatar || "/placeholder.svg"} alt={tarefa.criador.nome} />
                      <AvatarFallback>{tarefa.criador.iniciais}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">Criador: {tarefa.criador.nome}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{tarefa.anexos}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{tarefa.comentarios}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Subtarefas: {tarefa.subtarefas.concluidas}/{tarefa.subtarefas.total}
                  </div>
                  <div className="text-xs text-muted-foreground">Vencimento: {formatarData(tarefa.dataVencimento)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  )
}
