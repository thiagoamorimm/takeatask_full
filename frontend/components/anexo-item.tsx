import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { FileText, Download, MoreHorizontal, FileImage, FileCode, FileIcon as FilePdf, Pencil, Trash } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { useToast } from "@/components/ui/use-toast"

interface Anexo {
  id: number
  nome: string
  tamanho: string
  tipo: string
  dataUpload: string
  usuario: {
    id: number
    nome: string
    iniciais: string
  }
}

interface AnexoProps {
  anexo: Anexo
  onRename?: (id: number, newName: string) => void
  onDelete?: (id: number) => void
}

export default function AnexoItem({ anexo, onRename, onDelete }: AnexoProps) {
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [newFileName, setNewFileName] = useState(anexo.nome)
  const { toast } = useToast()

  // Função para determinar o ícone com base no tipo de arquivo
  const getFileIcon = () => {
    if (anexo.tipo.startsWith("image/")) {
      return <FileImage className="h-10 w-10 text-blue-500" />
    } else if (anexo.tipo === "application/pdf") {
      return <FilePdf className="h-10 w-10 text-red-500" />
    } else if (anexo.tipo === "application/json" || anexo.tipo.includes("text/")) {
      return <FileCode className="h-10 w-10 text-emerald-500" />
    } else {
      return <FileText className="h-10 w-10 text-gray-500" />
    }
  }

  // Função para baixar o arquivo
  const handleDownload = () => {
    // Em um cenário real, aqui seria feito o download do arquivo do servidor
    toast({
      title: "Download iniciado",
      description: `O arquivo ${anexo.nome} está sendo baixado.`,
    })

    // Simulação de download (apenas para demonstração)
    setTimeout(() => {
      toast({
        title: "Download concluído",
        description: `O arquivo ${anexo.nome} foi baixado com sucesso.`,
      })
    }, 1500)
  }

  // Função para renomear o arquivo
  const handleRename = () => {
    if (newFileName.trim() === "") {
      toast({
        title: "Erro ao renomear",
        description: "O nome do arquivo não pode estar vazio.",
        variant: "destructive",
      })
      return
    }

    if (onRename) {
      onRename(anexo.id, newFileName)
      setIsRenameDialogOpen(false)

      toast({
        title: "Arquivo renomeado",
        description: `O arquivo foi renomeado para ${newFileName}.`,
      })
    }
  }

  // Função para excluir o arquivo
  const handleDelete = () => {
    if (onDelete) {
      onDelete(anexo.id)
      setIsDeleteDialogOpen(false)

      toast({
        title: "Arquivo excluído",
        description: `O arquivo ${anexo.nome} foi excluído com sucesso.`,
      })
    }
  }

  return (
    <>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {getFileIcon()}
            <div className="flex-grow">
              <p className="font-medium text-sm">{anexo.nome}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{anexo.tamanho}</span>
                <span>•</span>
                <span>{new Date(anexo.dataUpload).toLocaleDateString("pt-BR")}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Avatar className="h-4 w-4">
                    <AvatarFallback className="text-[10px]">{anexo.usuario.iniciais}</AvatarFallback>
                  </Avatar>
                  <span>{anexo.usuario.nome}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleDownload}
                title="Baixar arquivo"
              >
                <Download className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Baixar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsRenameDialogOpen(true)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Renomear
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo para renomear arquivo */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Renomear arquivo</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome do arquivo</Label>
              <Input
                id="name"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleRename}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmação para excluir arquivo */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir arquivo</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o arquivo <strong>{anexo.nome}</strong>?
              <br />
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
