"use client"

import React, { useState, useEffect } from "react" // Import React
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Mail, Phone, AlertTriangle, Eye, Edit, Key, Power, Trash, Loader2 } from "lucide-react" // Adicionado Loader2
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
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
import { useToast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import EditarUsuarioDialog from "@/components/editar-usuario-dialog"
import VerUsuarioDialog from "@/components/ver-usuario-dialog"

// Interface para o DTO de Usuário do backend
interface UsuarioApiDTO {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  cargo?: string;
  departamento?: string;
  status: string; // No backend, pode ser um enum como PerfilUsuario ou um boolean 'ativo'
  ativo?: boolean; // Se o backend usar 'ativo'
  perfil?: string; // Ex: "ADMINISTRADOR_GESTOR", "USUARIO_PADRAO"
  // Adicionar outros campos conforme a API, como avatar, iniciais, dataCriacao
  avatarUrl?: string; // Exemplo se vier da API
  dataCriacao?: string;
}

// Interface para o usuário no frontend
interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  cargo?: string;
  departamento?: string;
  status: string; // "Ativo" ou "Inativo"
  avatar?: string; // URL do avatar
  iniciais: string;
  dataCriacao?: string;
  perfil?: string;
}

async function fetchUsuariosAPI(searchQuery?: string): Promise<Usuario[]> {
  const params = new URLSearchParams();
  if (searchQuery && searchQuery.trim() !== "") {
    params.append("q", searchQuery.trim());
  }
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";
  const response = await fetch(`${apiUrl}/api/usuarios?${params.toString()}`);

  if (!response.ok) {
    const errorData = await response.text();
    console.error("Erro ao buscar usuários da API:", response.status, errorData);
    throw new Error(`Erro ao buscar usuários: ${response.statusText} - ${errorData}`);
  }
  const data: UsuarioApiDTO[] = await response.json();

  return data.map((dto): Usuario => {
    const nomeSplit = dto.nome.split(" ");
    const iniciais = nomeSplit.length > 1
      ? `${nomeSplit[0][0]}${nomeSplit[nomeSplit.length - 1][0]}`
      : dto.nome.substring(0, 2);

    // Determinar status com base em 'ativo' ou 'status' do DTO
    let statusFrontend = "Inativo"; // Default
    if (typeof dto.ativo === 'boolean') {
      statusFrontend = dto.ativo ? "Ativo" : "Inativo";
    } else if (dto.status) {
      // Se o backend já envia "Ativo"/"Inativo" ou um enum que precisa ser mapeado
      statusFrontend = dto.status; // Ajustar se necessário mapeamento
    }

    return {
      id: dto.id,
      nome: dto.nome,
      email: dto.email,
      telefone: dto.telefone || "N/A",
      cargo: dto.cargo || "N/A",
      departamento: dto.departamento || "N/A",
      status: statusFrontend,
      avatar: dto.avatarUrl, // Usar avatarUrl se vier da API
      iniciais: iniciais.toUpperCase(),
      dataCriacao: dto.dataCriacao,
      perfil: dto.perfil,
    };
  });
}

export default function UsuariosList() {
  const router = useRouter()
  const { toast } = useToast()
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchUsuariosAPI(searchQuery); // Passar searchQuery
      setUsuarios(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro desconhecido ao buscar os usuários.");
      }
      console.error("Erro ao carregar usuários:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, [searchQuery]); // Adicionar searchQuery como dependência

  // Adicione este useEffect para escutar o evento de busca global (se aplicável)
  useEffect(() => {
    const handleGlobalSearch = (event: Event) => {
      const customEvent = event as CustomEvent<{ query?: string }>
      if (customEvent.detail && typeof customEvent.detail.query === "string") {
        setSearchQuery(customEvent.detail.query)
      }
    }
    window.addEventListener("global-search", handleGlobalSearch)
    return () => {
      window.removeEventListener("global-search", handleGlobalSearch)
    }
  }, [])

  const usuariosFiltrados = usuarios.filter(
    (usuario) =>
      (usuario.nome?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (usuario.email?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (usuario.cargo?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (usuario.departamento?.toLowerCase() || "").includes(searchQuery.toLowerCase()),
  )

  const selectedUser = usuarios.find((u) => u.id === selectedUserId)

  const viewUserDetails = (id: number) => {
    setSelectedUserId(id)
    setViewDialogOpen(true)
  }

  const editUser = (id: number) => {
    setSelectedUserId(id)
    setEditDialogOpen(true)
  }

  const toggleUserStatus = async (id: number) => {
    // TODO: Implementar chamada API para alterar status no backend
    // Por enquanto, apenas simula a alteração localmente
    setIsSubmitting(true);
    const userToToggle = usuarios.find(u => u.id === id);
    if (!userToToggle) return;

    const newStatus = userToToggle.status === "Ativo" ? "Inativo" : "Ativo";
    // Simulação de chamada API
    await new Promise(resolve => setTimeout(resolve, 500));

    setUsuarios(prevUsuarios =>
      prevUsuarios.map(u => u.id === id ? { ...u, status: newStatus } : u)
    );
    toast({
      title: "Status atualizado",
      description: `O usuário ${userToToggle.nome} agora está ${newStatus}.`,
    });
    setIsSubmitting(false);
  }

  const deleteUser = async () => {
    if (!selectedUserId) return;

    setIsSubmitting(true);
    const userToDelete = usuarios.find((u) => u.id === selectedUserId);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";
      const response = await fetch(`${apiUrl}/api/usuarios/${selectedUserId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        // Tentar ler o corpo do erro, se houver
        let errorBody = "Erro desconhecido do servidor.";
        try {
          const errorData = await response.json(); // ou response.text()
          errorBody = errorData.message || errorData.error || JSON.stringify(errorData);
        } catch (e) {
          // Não conseguiu parsear o JSON, usar o statusText
          errorBody = response.statusText;
        }
        throw new Error(`Falha ao deletar usuário: ${response.status} ${errorBody}`);
      }

      // Se a API retornou 204 No Content (ou 200 OK), atualiza a UI
      setUsuarios(prevUsuarios => prevUsuarios.filter(u => u.id !== selectedUserId));
      toast({
        title: "Usuário excluído",
        description: `O usuário ${userToDelete?.nome || 'selecionado'} foi excluído com sucesso.`,
      });

    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: error instanceof Error ? error.message : "Não foi possível excluir o usuário.",
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedUserId(null);
      setIsSubmitting(false);
    }
  }

  const resetPassword = async () => {
    // TODO: Implementar chamada API para redefinir senha no backend
    if (selectedUserId) {
      setIsSubmitting(true);
      const user = usuarios.find((u) => u.id === selectedUserId);
      // Simulação de chamada API
      await new Promise(resolve => setTimeout(resolve, 500));

      setResetPasswordDialogOpen(false);
      setSelectedUserId(null);
      setIsSubmitting(false);
      if (user) {
        toast({
          title: "Senha redefinida (simulação)",
          description: `Um email com instruções seria enviado para ${user.email}.`,
        });
      }
    }
  }

  const handleUserUpdated = (updatedUser: Usuario) => {
    // TODO: Idealmente, recarregar da API ou apenas atualizar o usuário modificado
    setUsuarios(usuarios.map((u) => (u.id === updatedUser.id ? updatedUser : u)))
    toast({
      title: "Usuário atualizado",
      description: `As informações de ${updatedUser.nome} foram atualizadas com sucesso.`,
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Carregando usuários...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-red-500">
        <AlertTriangle className="h-12 w-12 mb-4" />
        <p className="text-xl font-semibold">Erro ao carregar usuários</p>
        <p className="text-sm text-center px-4">{error}</p>
        <Button onClick={loadUsuarios} className="mt-4">Tentar novamente</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar usuários..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* Botão Novo Usuário pode ser adicionado aqui se necessário */}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuariosFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            ) : (
              usuariosFiltrados.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={usuario.avatar || "/placeholder.svg"} alt={usuario.nome} />
                        <AvatarFallback>{usuario.iniciais}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{usuario.nome}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{usuario.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{usuario.telefone}</span>
                    </div>
                  </TableCell>
                  <TableCell>{usuario.cargo}</TableCell>
                  <TableCell>{usuario.departamento}</TableCell>
                  <TableCell>
                    <Badge variant={usuario.status === "Ativo" ? "default" : "secondary"}>{usuario.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <TooltipProvider>
                      <div className="flex items-center justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => viewUserDetails(usuario.id)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Ver detalhes</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => editUser(usuario.id)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Editar</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleUserStatus(usuario.id)}
                              disabled={isSubmitting}
                            >
                              <Power
                                className={`h-4 w-4 ${usuario.status === "Ativo" ? "text-green-500" : "text-gray-400"}`}
                              />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{usuario.status === "Ativo" ? "Desativar" : "Ativar"}</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedUserId(usuario.id)
                                setResetPasswordDialogOpen(true)
                              }}
                            >
                              <Key className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Redefinir senha</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => {
                                setSelectedUserId(usuario.id)
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
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Diálogo de confirmação para exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Excluir usuário
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={deleteUser} disabled={isSubmitting}>
              {isSubmitting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo para redefinição de senha */}
      <Dialog open={resetPasswordDialogOpen} onOpenChange={setResetPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Redefinir senha</DialogTitle>
            <DialogDescription>Uma nova senha será gerada e enviada para o email do usuário.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-4 text-sm">
                <p>
                  O usuário receberá um email com instruções para definir uma nova senha. A senha atual será invalidada
                  imediatamente.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetPasswordDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={resetPassword} disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar redefinição"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para edição de usuário */}
      {selectedUser && (
        <EditarUsuarioDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          usuario={selectedUser}
          onUsuarioAtualizado={handleUserUpdated}
        />
      )}

      {/* Diálogo para visualização de detalhes do usuário */}
      <VerUsuarioDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        usuario={selectedUser || null}
      />
    </div>
  )
}
