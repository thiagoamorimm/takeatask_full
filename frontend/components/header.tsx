"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link";
import { Bell, Search, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"

export default function Header() {
  const { theme, setTheme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [mounted, setMounted] = useState(false)

  // Necessário para evitar erro de hidratação
  useEffect(() => {
    setMounted(true)
  }, [])

  // Interface para Notificação
  interface Notificacao {
    id: string;
    titulo: string;
    descricao: string;
    tarefaId?: number | string; // ID da tarefa para o link
    lida?: boolean;
  }

  // Estado para notificações (exemplo, futuramente virá de uma API)
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([
    { id: "1", titulo: "Nova tarefa atribuída", descricao: "Você foi designado para a tarefa \"Revisar documentação\"", tarefaId: 1, lida: false },
    { id: "2", titulo: "Prazo próximo", descricao: "A tarefa \"Implementar login\" vence em 2 dias", tarefaId: 2, lida: false },
    { id: "3", titulo: "Comentário adicionado", descricao: "Maria comentou na tarefa \"Corrigir bug no formulário\"", tarefaId: 3, lida: true },
  ]);

  // Contar notificações não lidas para o badge
  const notificacoesNaoLidas = notificacoes.filter(n => !n.lida).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implementar busca global
    console.log("Buscar:", searchQuery)

    // Aqui você poderia disparar um evento global ou usar um contexto
    // para comunicar a busca para outros componentes
    const searchEvent = new CustomEvent("global-search", {
      detail: { query: searchQuery },
    })
    window.dispatchEvent(searchEvent)
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="w-full flex items-center justify-between">
        <form className="w-full max-w-sm" onSubmit={handleSearch}>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar tarefas..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {notificacoesNaoLidas > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                    {notificacoesNaoLidas}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-2 font-medium">Notificações</div>
              {notificacoes.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">Nenhuma notificação nova.</p>
              ) : (
                notificacoes.map((notificacao) => (
                  <Link key={notificacao.id} href={notificacao.tarefaId ? `/tarefas/${notificacao.tarefaId}` : "#"} passHref legacyBehavior>
                    <DropdownMenuItem 
                      className={`cursor-pointer ${!notificacao.lida ? 'font-semibold' : ''}`}
                      // onClick={() => marcarComoLida(notificacao.id)} // Futura funcionalidade
                    >
                      <div className="flex flex-col">
                        <p className={`text-sm ${!notificacao.lida ? 'text-primary' : 'text-foreground'}`}>{notificacao.titulo}</p>
                        <p className="text-xs text-muted-foreground">{notificacao.descricao}</p>
                      </div>
                    </DropdownMenuItem>
                  </Link>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {mounted && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Alternar tema</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>Claro</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>Escuro</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>Sistema</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}
