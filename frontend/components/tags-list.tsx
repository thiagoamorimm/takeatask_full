"use client"

import React, { useState, useEffect } from "react"
import Cookies from 'js-cookie'
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash, Search, AlertTriangle, Loader2 } from "lucide-react"
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
import EditarTagDialog from "@/components/editar-tag-dialog"; // Descomentar quando o diálogo de editar existir
// import CriarTagDialog from "@/components/criar-tag-dialog"; // Descomentar quando o diálogo de criar existir

interface TagApiDTO {
  id: number;
  nome: string;
  cor?: string; // Assumindo que cor pode vir da API
  descricao?: string; // Assumindo que descrição pode vir da API
  // Adicionar outros campos se a API retornar, como totalTarefas, dataCriacao
}

interface Tag {
  id: number;
  nome: string;
  cor: string; // No frontend, vamos dar um default se não vier
  descricao?: string;
  totalTarefas?: number; // Exemplo, pode não ser usado na lista principal
  dataCriacao?: string; // Exemplo
}

async function fetchTagsAPI(searchQuery?: string): Promise<Tag[]> {
  const params = new URLSearchParams();
  if (searchQuery && searchQuery.trim() !== "") {
    params.append("q", searchQuery.trim()); // Assumindo que a API suporta busca por 'q'
  }
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";
  let token = '';
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token') || Cookies.get('token') || '';
  }
  const response = await fetch(`${apiUrl}/api/tags?${params.toString()}`,
    token ? {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    } : undefined
  );

  if (!response.ok) {
    const errorData = await response.text();
    console.error("Erro ao buscar tags da API:", response.status, errorData);
    throw new Error(`Erro ao buscar tags: ${response.statusText} - ${errorData}`);
  }
  const data: TagApiDTO[] = await response.json();

  return data.map((dto): Tag => ({
    id: dto.id,
    nome: dto.nome,
    cor: dto.cor || "#71717A", // Cor padrão (cinza)
    descricao: dto.descricao,
    // Mapear outros campos se necessário
  }));
}


export default function TagsList() {
  const { toast } = useToast()
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  // const [criarDialogOpen, setCriarDialogOpen] = useState(false); // Para o diálogo de criar

  const loadTags = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTagsAPI(searchQuery);
      setTags(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro desconhecido ao buscar as tags.");
      }
      console.error("Erro ao carregar tags:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTags();
  }, [searchQuery]); // Recarregar quando a busca mudar

  const tagsFiltradas = tags; // A API já faz a filtragem por searchQuery

  const selectedTag = tags.find((t) => t.id === selectedTagId)

  const editTag = (id: number) => {
    setSelectedTagId(id)
    setEditDialogOpen(true)
  }

  const handleDeleteTag = async () => {
    if (!selectedTagId) return;
    setIsSubmitting(true);
    const tagToDelete = tags.find((t) => t.id === selectedTagId);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";
      const response = await fetch(`${apiUrl}/api/tags/${selectedTagId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        let errorBody = `Erro ${response.status} ao deletar tag.`;
        try {
          const errorData = await response.json();
          errorBody = errorData.message || errorData.error || JSON.stringify(errorData);
        } catch (e) {
          // Não conseguiu parsear JSON, usar statusText se disponível
          if (response.statusText) errorBody = response.statusText;
        }
        throw new Error(errorBody);
      }

      setTags(prevTags => prevTags.filter(tag => tag.id !== selectedTagId));
      toast({
        title: "Tag Excluída",
        description: `A tag "${tagToDelete?.nome || 'selecionada'}" foi excluída com sucesso.`,
      });

    } catch (error) {
      console.error("Erro ao deletar tag:", error);
      toast({
        variant: "destructive",
        title: "Erro ao Excluir",
        description: error instanceof Error ? error.message : "Não foi possível excluir a tag.",
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedTagId(null);
      setIsSubmitting(false);
    }
  };

  const handleTagCriadaOuAtualizada = () => {
    loadTags(); // Recarregar a lista de tags
    // setCriarDialogOpen(false); // Fechar diálogo de criar se aplicável
    setEditDialogOpen(false); // Fechar diálogo de editar se aplicável
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Carregando tags...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-red-500">
        <AlertTriangle className="h-12 w-12 mb-4" />
        <p className="text-xl font-semibold">Erro ao carregar tags</p>
        <p className="text-sm text-center px-4">{error}</p>
        <Button onClick={loadTags} className="mt-4">Tentar novamente</Button>
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
            placeholder="Buscar tags..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* <Button onClick={() => setCriarDialogOpen(true)}>Nova Tag</Button> */}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Cor</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              {/* <TableHead>Tarefas</TableHead> */}
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tagsFiltradas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhuma tag encontrada.
                </TableCell>
              </TableRow>
            ) : (
              tagsFiltradas.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <span
                        className="h-6 w-6 rounded-full border"
                        style={{ backgroundColor: tag.cor }}
                      ></span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{tag.nome}</TableCell>
                  <TableCell className="text-muted-foreground">{tag.descricao || "N/A"}</TableCell>
                  {/* <TableCell>{tag.totalTarefas || 0}</TableCell> */}
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => editTag(tag.id)} className="mr-2">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => {
                        setSelectedTagId(tag.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
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
            <AlertDialogTitle>Excluir Tag</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a tag "{selectedTag?.nome}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteTag}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {selectedTag && editDialogOpen && (
        <EditarTagDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          tag={selectedTag}
          onTagAtualizada={handleTagCriadaOuAtualizada}
        />
      )}
      {/* {criarDialogOpen && (
        <CriarTagDialog
          open={criarDialogOpen}
          onOpenChange={setCriarDialogOpen}
          onTagCriada={handleTagCriadaOuAtualizada}
        />
      )} */}
    </div>
  );
}
