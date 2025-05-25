import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ComentarioProps {
  comentario: {
    id: number
    texto: string
    data: string
    usuario: {
      id: number
      nome: string
      avatar?: string
      iniciais: string
    }
  }
}

export default function ComentarioItem({ comentario }: ComentarioProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comentario.usuario.avatar || "/placeholder.svg"} alt={comentario.usuario.nome} />
            <AvatarFallback>{comentario.usuario.iniciais}</AvatarFallback>
          </Avatar>
          <div className="flex-grow space-y-1">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium">{comentario.usuario.nome}</span>{" "}
                <span className="text-xs text-muted-foreground">
                  {new Date(comentario.data).toLocaleString("pt-BR")}
                </span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Editar</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-sm">{comentario.texto}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
