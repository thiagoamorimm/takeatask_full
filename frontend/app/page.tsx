"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, AlertCircle, BarChart3, Loader2 } from "lucide-react"
import TarefasRecentes from "@/components/tarefas-recentes"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NovaTarefaButton from "@/components/nova-tarefa-button"

interface Stats {
  total: number
  concluidas: number
  emAndamento: number
  atrasadas: number
}

interface ApiStats { // Interface para o DTO do backend
  totalTarefas: number;
  tarefasConcluidas: number;
  tarefasEmAndamento: number;
  tarefasAtrasadas: number;
}

import Cookies from 'js-cookie'

async function fetchStats(): Promise<Stats> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";
  let token = '';
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token') || Cookies.get('token') || '';
  }
  const response = await fetch(`${apiUrl}/api/tarefas/stats`, token ? {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  } : undefined);

  if (!response.ok) {
    const errorData = await response.text();
    console.error("Erro ao buscar estatísticas da API:", response.status, errorData);
    throw new Error(`Erro ao buscar estatísticas: ${response.statusText} - ${errorData}`);
  }
  const data: ApiStats = await response.json();

  // Mapear do DTO do backend para a interface Stats do frontend
  return {
    total: data.totalTarefas,
    concluidas: data.tarefasConcluidas,
    emAndamento: data.tarefasEmAndamento,
    atrasadas: data.tarefasAtrasadas,
  };
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchStats();
        setStats(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError("Ocorreu um erro desconhecido ao buscar as estatísticas.")
        }
        console.error("Erro ao buscar estatísticas:", err)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo ao TAKE a TASK, seu gerenciador de tarefas completo.</p>
        </div>
        <NovaTarefaButton />
      </div>

      {loading && (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Carregando estatísticas...</p>
        </div>
      )}

      {error && (
        <Card className="bg-destructive/10 border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Erro ao carregar estatísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{error}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Por favor, tente recarregar a página. Se o problema persistir, contate o suporte.
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Tarefas</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              {/* <p className="text-xs text-muted-foreground">+5 desde ontem</p> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tarefas Concluídas</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.concluidas}</div>
              {/* <p className="text-xs text-muted-foreground">+12 esta semana</p> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.emAndamento}</div>
              {/* <p className="text-xs text-muted-foreground">8 com prazo próximo</p> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atrasadas</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.atrasadas}</div>
              {/* <p className="text-xs text-muted-foreground">+2 desde ontem</p> */}
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="minhas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="minhas">Minhas Tarefas</TabsTrigger>
          <TabsTrigger value="equipe">Tarefas da Equipe</TabsTrigger>
          <TabsTrigger value="todas">Todas as Tarefas</TabsTrigger>
        </TabsList>
        <TabsContent value="minhas" className="space-y-4">
          <TarefasRecentes tipo="minhas" />
        </TabsContent>
        <TabsContent value="equipe" className="space-y-4">
          <TarefasRecentes tipo="equipe" />
        </TabsContent>
        <TabsContent value="todas" className="space-y-4">
          <TarefasRecentes tipo="todas" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
