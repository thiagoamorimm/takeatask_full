import { Button } from "@/components/ui/button"
import { Filter, ArrowUpDown } from "lucide-react"
import TarefasList from "@/components/tarefas-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NovaTarefaButton from "@/components/nova-tarefa-button"

export default function TarefasPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tarefas</h1>
          <p className="text-muted-foreground">Gerencie todas as tarefas do sistema.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtrar
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4" />
            Ordenar
          </Button>
          <NovaTarefaButton />
        </div>
      </div>

      <Tabs defaultValue="todas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="minhas">Minhas Tarefas</TabsTrigger>
          <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
          <TabsTrigger value="andamento">Em Andamento</TabsTrigger>
          <TabsTrigger value="concluidas">Concluídas</TabsTrigger>
          <TabsTrigger value="atrasadas">Atrasadas</TabsTrigger>
        </TabsList>
        <TabsContent value="todas" className="space-y-4">
          <TarefasList filtro="todas" />
        </TabsContent>
        <TabsContent value="minhas" className="space-y-4">
          <TarefasList filtro="minhas" />
        </TabsContent>
        <TabsContent value="pendentes" className="space-y-4">
          <TarefasList filtro="pendentes" />
        </TabsContent>
        <TabsContent value="andamento" className="space-y-4">
          <TarefasList filtro="andamento" />
        </TabsContent>
        <TabsContent value="concluidas" className="space-y-4">
          <TarefasList filtro="concluidas" />
        </TabsContent>
        <TabsContent value="atrasadas" className="space-y-4">
          <TarefasList filtro="atrasadas" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
