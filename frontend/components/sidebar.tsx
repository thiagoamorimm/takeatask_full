"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, CheckSquare, Users, Tag, FileText, MessageSquare, Settings, Menu, X, LogOut } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { authService } from "@/services/auth"
import Cookies from 'js-cookie'

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Tarefas",
    href: "/tarefas",
    icon: CheckSquare,
  },
  {
    title: "Usuários",
    href: "/usuarios",
    icon: Users,
  },
  {
    title: "Tags",
    href: "/tags",
    icon: Tag,
  },
  // {
  //   title: "Anexos",
  //   href: "/anexos",
  //   icon: FileText,
  // },
  // {
  //   title: "Comentários",
  //   href: "/comentarios",
  //   icon: MessageSquare,
  // },
  {
    title: "Configurações",
    href: "/configuracoes",
    icon: Settings,
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [userName, setUserName] = useState<string>('Usuário');
  const router = useRouter()

  // SSR hydration fix: lê nome do usuário só no client
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('userName');
      const cookie = Cookies.get('userName');
      setUserName(local || cookie || 'Usuário');
    }
  }, []);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>
      <div
        className={cn("fixed inset-0 z-40 bg-black/80 md:hidden", isOpen ? "block" : "hidden")}
        onClick={() => setIsOpen(false)}
      />
      <aside
        className={cn(
          "h-full w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 md:translate-x-0 flex-shrink-0",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center h-16 px-6 border-b border-gray-200 dark:border-gray-800">
            <Link href="/" className="flex items-center gap-2">
              <CheckSquare className="h-6 w-6 text-emerald-600" />
              <span className="font-bold text-lg">TAKE a TASK</span>
            </Link>
          </div>
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                        : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded select-none">
              <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-medium">
                JD
              </div>
              <div>
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Administrador</p>
              </div>
            </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start">
                <DropdownMenuItem
                  onClick={() => {
                    // Usar o serviço de autenticação para fazer logout
                    authService.logout();
                    // Remover também o cookie do token
                    Cookies.remove('token');
                    // Redirecionar para a página de login
                    router.push("/auth/login");
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>
    </>
  )
}
