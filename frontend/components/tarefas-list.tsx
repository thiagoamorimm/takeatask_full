"use client"

import React, { useState, useEffect } from "react"
import Cookies from 'js-cookie'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import ColoredTag from "@/components/colored-tag"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, AlertCircle, CheckCircle, ChevronDown, Eye, Edit, Trash, RefreshCw, Search, Loader2, AlertTriangle } from "lucide-react" // Adicionado AlertTriangle e Loader2

import { useToast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import VerTarefaDialog from "@/components/ver-tarefa-dialog"
import EditarTarefaDialog from "@/components/editar-tarefa-dialog"
import { Input } from "@/components/ui/input"

// Tipagem para Tarefa (adaptada de tarefas-recentes.tsx)
interface Usuario {
  id: number | string;
  nome: string;
  avatar?: string;
  iniciais: string;
}

interface Tarefa {
  id: number; // ID da tarefa será sempre number
  titulo: string;
  descricao: string;
  status: string;
  prioridade: string;
  responsavel: Usuario;
  criador: Usuario;
  dataCriacao: string;
  dataVencimento: string; // Corresponde a dataPrazo do backend
  tags: string[];
  anexos: number;
  comentarios: number;
  subtarefas: {
    total: number;
    concluidas: number;
  };
}

// Interface para o DTO de Tarefa do backend (adaptada de tarefas-recentes.tsx)
interface TarefaApiDTO {
  id: number | string;
  nome: string;
  descricao: string;
  status: string;
  prioridade: string;
  responsavelId?: number;
  nomeResponsavel?: string;
  avatarResponsavel?: string; // Assumindo que pode vir da API
  iniciaisResponsavel?: string; // Assumindo que pode vir da API
  criadorId: number | string;
  nomeCriador: string;
  avatarCriador?: string; // Assumindo
  iniciaisCriador?: string; // Assumindo
  dataCriacao: string;
  dataPrazo: string;
  tags: { id: number, nome: string }[];
  // Contagens ou listas de DTOs para anexos, comentarios, subtarefas
  // Para simplificar, vamos assumir que o backend pode não retornar isso na listagem principal
  // e o frontend usará valores padrão ou fará chamadas separadas se necessário.
  // No TarefasRecentes, anexos e comentarios eram calculados pelo length de arrays.
  // Aqui, vamos assumir que o backend pode fornecer contagens ou que não são exibidos diretamente na lista.
  numeroAnexos?: number;
  numeroComentarios?: number;
  // subtarefas pode ser mais complexo, talvez apenas um resumo
  // subtarefasConcluidas?: number;
  // totalSubtarefas?: number;
}


async function fetchTarefasFromAPI(filtro: string, searchQuery?: string): Promise<Tarefa[]> {
  const params = new URLSearchParams();

  // O backend espera 'tipo' para o filtro principal (minhas, todas, etc.)
  // e 'status' para filtros específicos de status (Pendente, Em andamento, etc.)
  // O componente TarefasList usa 'filtro' para ambos os casos. Precisamos mapear.

  let tipoFiltroApi = "todas"; // Default para API
  let statusFiltroApi: string | null = null;

  if (filtro === "minhas" || filtro === "equipe" || filtro === "todas") {
    tipoFiltroApi = filtro;
  } else if (filtro === "pendentes") {
    statusFiltroApi = "A_FAZER"; // Corrigido para o valor do Enum do backend
  } else if (filtro === "andamento") {
    statusFiltroApi = "EM_ANDAMENTO";
  } else if (filtro === "concluidas") {
    statusFiltroApi = "CONCLUIDA";
  } else if (filtro === "atrasadas") {
    // O backend pode ter uma lógica específica para 'atrasadas' ou pode ser um status
    // Por enquanto, vamos assumir que não é um status direto, mas um tipo de filtro.
    // Se for um status, ajuste aqui. Se for um filtro especial, a API precisa suportar.
    // Para este exemplo, vamos tratar como se fosse um 'tipo' se a API suportar,
    // ou omitir se for para ser calculado no frontend (o que não faremos aqui).
    // Se o backend não tem filtro 'atrasadas', essa lógica precisaria ser no frontend
    // ou o backend precisaria de um novo parâmetro.
    // Por simplicidade, vamos passar 'atrasadas' como 'tipo' e ver se o backend lida com isso.
    tipoFiltroApi = "atrasadas";
  }

  params.append("tipo", tipoFiltroApi);
  if (statusFiltroApi) {
    params.append("status", statusFiltroApi);
  }

  if (searchQuery && searchQuery.trim() !== "") {
    params.append("q", searchQuery.trim());
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";
  // Busca o token salvo
  let token = '';
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token') || Cookies.get('token') || '';
  }
  const response = await fetch(`${apiUrl}/api/tarefas?${params.toString()}`,
    token ? {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    } : undefined
  );

  if (!response.ok) {
    const errorData = await response.text();
    console.error("Erro ao buscar tarefas da API (TarefasList):", response.status, errorData);
    throw new Error(`Erro ao buscar tarefas (TarefasList): ${response.statusText} - ${errorData}`);
  }
  const data: TarefaApiDTO[] = await response.json();

  return data.map((dto): Tarefa => ({
    id: Number(dto.id), // Garantir que o ID seja um número
    titulo: dto.nome,
    descricao: dto.descricao,
    status: dto.status, // Assumir que o backend retorna o texto correto para exibição
    prioridade: dto.prioridade, // Assumir que o backend retorna o texto correto
    responsavel: {
      id: dto.responsavelId || 0, // Fallback para ID 0 se não houver responsável
      nome: dto.nomeResponsavel || "N/A",
      avatar: dto.avatarResponsavel,
      iniciais: dto.iniciaisResponsavel || (dto.nomeResponsavel ? dto.nomeResponsavel.substring(0, 2).toUpperCase() : "N/A")
    },
    criador: {
      id: dto.criadorId,
      nome: dto.nomeCriador,
      avatar: dto.avatarCriador,
      iniciais: dto.iniciaisCriador || (dto.nomeCriador ? dto.nomeCriador.substring(0, 2).toUpperCase() : "??")
    },
    dataCriacao: dto.dataCriacao,
    dataVencimento: dto.dataPrazo,
    tags: dto.tags ? dto.tags.map(tag => tag.nome) : [],
    anexos: dto.numeroAnexos || 0, // Usar contagens se vierem da API
    comentarios: dto.numeroComentarios || 0,
    subtarefas: { total: 0, concluidas: 0 }, // Simplificado, ajustar se API fornecer
  }));
}

// Função para formatar data
function formatarData(dataString: string) {
  if (!dataString) return "N/A";
  try {
    const data = new Date(dataString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(data);
  } catch (e) {
    return "Data inválida";
  }
}

// Componente para exibir o status com ícone
function StatusTarefa({ status }: { status: string }) {
  // Mapear status do backend (ex: "EM_ANDAMENTO") para status do frontend ("Em andamento")
  // Este mapeamento pode ser mais robusto ou vir de constantes
  let statusText = status;
  if (status === "EM_ANDAMENTO") statusText = "Em andamento";
  if (status === "A_FAZER") statusText = "Pendente"; // Ou "A Fazer"
  if (status === "CONCLUIDA") statusText = "Concluída";
  // Adicionar outros mapeamentos conforme necessário (EM_REVISAO, BLOQUEADA, etc.)

  switch (statusText) {
    case "Em andamento":
      return <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200"><Clock className="h-3 w-3" />{statusText}</Badge>;
    case "Pendente":
    case "A Fazer":
      return <Badge variant="outline" className="flex items-center gap-1 bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="h-3 w-3" />{statusText}</Badge>;
    case "Concluída":
      return <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200"><CheckCircle className="h-3 w-3" />{statusText}</Badge>;
    case "Atrasada": // Se o backend calcular e enviar este status
      return <Badge variant="outline" className="flex items-center gap-1 bg-red-50 text-red-700 border-red-200"><AlertCircle className="h-3 w-3" />{statusText}</Badge>;
    default:
      return <Badge variant="outline">{statusText}</Badge>;
  }
}

export default function TarefasList({ filtro }: { filtro: string }) {
  const { toast } = useToast();
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [verTarefaDialogOpen, setVerTarefaDialogOpen] = useState(false);
  const [editarTarefaDialogOpen, setEditarTarefaDialogOpen] = useState(false);
  const [selectedTarefaId, setSelectedTarefaId] = useState<number | null>(null); // ID será sempre number ou null
  const [novoStatus, setNovoStatus] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const carregarTarefas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTarefasFromAPI(filtro, searchQuery);
      setTarefas(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro desconhecido ao buscar as tarefas.");
      }
      console.error(`Erro ao carregar tarefas (filtro: ${filtro}, query: ${searchQuery}):`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarTarefas();
  }, [filtro, searchQuery]); // Recarregar quando o filtro ou a busca mudar

  // A filtragem local pode ser removida se a API já fizer toda a filtragem necessária
  // Por enquanto, mantemos para o caso de a API retornar uma lista mais ampla baseada no 'tipo'
  // e o frontend refinar com base no 'filtro' específico (ex: 'pendentes' vs 'EM_ANDAMENTO')
  // ou se a busca 'searchQuery' for apenas no frontend.
  // Idealmente, 'searchQuery' também seria passado para a API.
  const tarefasFiltradas = tarefas; // Se a API já filtra tudo.
  // Se precisar de filtro adicional no frontend:
  // const tarefasFiltradas = tarefas.filter(tarefa => /* lógica de filtro adicional */ );


  const selectedTarefa = tarefas.find((t) => t.id === selectedTarefaId);

  const toggleRowExpand = (id: number) => { // Alterado para number
    setExpandedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]));
  };

  const viewTaskDetails = (id: number) => { // Alterado para number
    setSelectedTarefaId(id);
    setVerTarefaDialogOpen(true);
  };

  const editTask = (id: number) => { // Alterado para number
    setSelectedTarefaId(id);
    setEditarTarefaDialogOpen(true);
  };

  const openStatusDialog = (id: number) => { // Alterado para number
    const tarefa = tarefas.find((t) => t.id === id);
    if (tarefa) {
      setSelectedTarefaId(id);
      setNovoStatus(tarefa.status); // Usar o status atual como default
      setStatusDialogOpen(true);
    }
  };

  const updateTaskStatus = async () => {
    if (selectedTarefaId && novoStatus) {
      setIsSubmitting(true);
      // TODO: Implementar chamada API para atualizar status no backend
      console.log(`Simulando atualização de status para tarefa ${selectedTarefaId} para ${novoStatus}`);
      await new Promise(resolve => setTimeout(resolve, 500));

      setTarefas(prevTarefas =>
        prevTarefas.map(t =>
          t.id === selectedTarefaId ? { ...t, status: novoStatus } : t
        )
      );
      setStatusDialogOpen(false);
      setSelectedTarefaId(null);
      setIsSubmitting(false);
      const tarefa = tarefas.find(t => t.id === selectedTarefaId);
      if (tarefa) {
        toast({
          title: "Status atualizado (simulação)",
          description: `A tarefa "${tarefa.titulo}" agora está com status "${novoStatus}".`,
        });
      }
    }
  };

  const deleteTask = async () => {
    if (selectedTarefaId) {
      setIsSubmitting(true);
      const tarefaToDelete = tarefas.find((t) => t.id === selectedTarefaId);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

      try {
        const response = await fetch(`${apiUrl}/api/tarefas/${selectedTarefaId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          // Tentar ler a resposta de erro, se houver
          let errorMsg = `Erro ao excluir tarefa: ${response.statusText}`;
          try {
            const errorData = await response.json();
            errorMsg += ` - ${JSON.stringify(errorData)}`;
          } catch (e) {
            // Ignorar erro ao parsear JSON se a resposta for vazia ou não for JSON
          }
          throw new Error(errorMsg);
        }

        // Sucesso na API
        setTarefas(prevTarefas => prevTarefas.filter(t => t.id !== selectedTarefaId));
        setDeleteDialogOpen(false);
        setSelectedTarefaId(null);
        if (tarefaToDelete) {
          toast({
            title: "Tarefa excluída",
            description: `A tarefa "${tarefaToDelete.titulo}" foi excluída com sucesso.`,
          });
        }

      } catch (error) {
        console.error("Erro ao excluir tarefa:", error);
        toast({
          variant: "destructive",
          title: "Erro ao excluir",
          description: error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleTarefaAtualizada = () => {
    carregarTarefas(); // Recarregar tarefas após atualização
    toast({
      title: "Tarefa atualizada",
      description: "A tarefa foi atualizada com sucesso e a lista foi recarregada.",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Carregando tarefas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-red-500">
        <AlertTriangle className="h-12 w-12 mb-4" />
        <p className="text-xl font-semibold">Erro ao carregar tarefas</p>
        <p className="text-sm text-center px-4">{error}</p>
        <Button onClick={carregarTarefas} className="mt-4">Tentar novamente</Button>
      </div>
    );
  }

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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Prioridade</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tarefasFiltradas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Nenhuma tarefa encontrada.
                </TableCell>
              </TableRow>
            ) : (
              tarefasFiltradas.map((tarefa) => (
                <React.Fragment key={tarefa.id}>
                  <TableRow>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => toggleRowExpand(tarefa.id)}>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${expandedRows.includes(tarefa.id as number) ? "rotate-180" : ""}`}
                        />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <span
                        className="font-medium hover:underline cursor-pointer"
                        onClick={() => viewTaskDetails(tarefa.id)}
                      >
                        {tarefa.titulo}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusTarefa status={tarefa.status} />
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`
                        ${tarefa.prioridade === "Alta" || tarefa.prioridade === "ALTA" ? "bg-red-50 text-red-700 border-red-200" : ""}
                        ${tarefa.prioridade === "Média" || tarefa.prioridade === "MEDIA" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""}
                        ${tarefa.prioridade === "Baixa" || tarefa.prioridade === "BAIXA" ? "bg-green-50 text-green-700 border-green-200" : ""}
                        ${tarefa.prioridade === "Urgente" || tarefa.prioridade === "URGENTE" ? "bg-purple-50 text-purple-700 border-purple-200" : ""}
                      `}
                      >
                        {tarefa.prioridade}
                      </Badge>
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>{formatarData(tarefa.dataVencimento)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {tarefa.tags.map((tag) => (
                          <ColoredTag key={tag} name={tag} className="text-xs" />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <TooltipProvider>
                        <div className="flex items-center justify-end gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => viewTaskDetails(tarefa.id)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Ver detalhes</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => editTask(tarefa.id)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Editar</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => openStatusDialog(tarefa.id)}>
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Alterar status</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => {
                                  setSelectedTarefaId(tarefa.id)
                                  setDeleteDialogOpen(true)
                                }}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Excluir</TooltipContent>
                          </Tooltip>
                        </div>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                  {expandedRows.includes(tarefa.id as number) && (
                    <TableRow>
                      <TableCell colSpan={8} className="p-0">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">Descrição</h4>
                              <p className="text-sm text-muted-foreground">{tarefa.descricao}</p>

                              <h4 className="font-medium mt-4 mb-2">Informações adicionais</h4>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Criado por:</p>
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-5 w-5">
                                      <AvatarImage
                                        src={tarefa.criador.avatar || "/placeholder.svg"}
                                        alt={tarefa.criador.nome}
                                      />
                                      <AvatarFallback>{tarefa.criador.iniciais}</AvatarFallback>
                                    </Avatar>
                                    <span>{tarefa.criador.nome}</span>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Data de criação:</p>
                                  <p>{formatarData(tarefa.dataCriacao)}</p>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">Progresso</h4>
                              <div className="flex items-center gap-2 mb-4">
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                  <div
                                    className="bg-emerald-500 h-2.5 rounded-full"
                                    style={{
                                      width: `${tarefa.subtarefas.total > 0 ? (tarefa.subtarefas.concluidas / tarefa.subtarefas.total) * 100 : 0}%`,
                                    }}
                                  ></div>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {tarefa.subtarefas.concluidas}/{tarefa.subtarefas.total}
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-1">
                                  <span className="text-sm text-muted-foreground">{tarefa.anexos} anexos</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-sm text-muted-foreground">
                                    {tarefa.comentarios} comentários
                                  </span>
                                </div>
                              </div>

                              <div className="mt-4 flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => viewTaskDetails(tarefa.id)}>
                                  Ver detalhes
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => editTask(tarefa.id)}>
                                  Editar
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Diálogo de confirmação para exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir tarefa</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita e todos os dados relacionados
              serão perdidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={deleteTask} disabled={isSubmitting}>
              {isSubmitting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo para alteração de status */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Alterar status da tarefa</DialogTitle>
            <DialogDescription>Selecione o novo status para esta tarefa.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={novoStatus} onValueChange={setNovoStatus}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Em andamento">Em andamento</SelectItem>
                    <SelectItem value="Concluída">Concluída</SelectItem>
                    <SelectItem value="Atrasada">Atrasada</SelectItem>
                    {/* Adicionar outros status se necessário */}
                  </SelectContent>
                </Select>
              </div>

              {selectedTarefa && (
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md text-sm">
                  <p className="font-medium">{selectedTarefa.titulo}</p>
                  <div className="text-muted-foreground mt-1">
                    Status atual: <StatusTarefa status={selectedTarefa.status} />
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={updateTaskStatus} disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar alterações"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para visualizar detalhes da tarefa */}
      {selectedTarefaId !== null && <VerTarefaDialog open={verTarefaDialogOpen} onOpenChange={setVerTarefaDialogOpen} tarefaId={selectedTarefaId} />}

      {/* Diálogo para editar tarefa */}
      {
        selectedTarefaId !== null && (
          <EditarTarefaDialog
            open={editarTarefaDialogOpen}
            onOpenChange={setEditarTarefaDialogOpen}
            tarefaId={selectedTarefaId}
            onTarefaAtualizada={handleTarefaAtualizada}
          />
        )
      }
    </div>
  );
}
