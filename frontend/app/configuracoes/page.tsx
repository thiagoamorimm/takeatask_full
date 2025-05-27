"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings } from "lucide-react"

import ConfigGeral from "@/components/configuracoes/config-geral";
import ConfigNotificacoes from "@/components/configuracoes/config-notificacoes";
import ConfigSeguranca from "@/components/configuracoes/config-seguranca";
import ConfigConta from "@/components/configuracoes/config-conta";

// Placeholder para os componentes de cada aba
// Estes seriam importados de seus respectivos arquivos
// const ConfigGeral = () => <div className="p-4 border rounded-md">Conteúdo da Aba Geral (Aparência, Idioma, Data/Hora)</div>; // Substituído pelo import
// const ConfigNotificacoes = () => <div className="p-4 border rounded-md">Conteúdo da Aba Notificações</div>; // Substituído pelo import
// const ConfigSeguranca = () => <div className="p-4 border rounded-md">Conteúdo da Aba Segurança (2FA, Senha, Sessões)</div>; // Substituído pelo import
// const ConfigConta = () => <div className="p-4 border rounded-md">Conteúdo da Aba Conta (Informações Pessoais, Preferências, Excluir)</div>; // Substituído pelo import

export default function ConfiguracoesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Settings className="h-7 w-7 text-primary" />
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
                    <p className="text-muted-foreground">
                        Gerencie suas preferências e configurações do sistema.
                    </p>
                </div>
            </div>

            <Tabs defaultValue="geral" className="w-full">
                <TabsList className="grid w-full grid-cols-4 md:max-w-md">
                    <TabsTrigger value="geral">Geral</TabsTrigger>
                    <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
                    <TabsTrigger value="seguranca">Segurança</TabsTrigger>
                    <TabsTrigger value="conta">Conta</TabsTrigger>
                </TabsList>
                <TabsContent value="geral" className="mt-6">
                    <ConfigGeral />
                </TabsContent>
                <TabsContent value="notificacoes" className="mt-6">
                    <ConfigNotificacoes />
                </TabsContent>
                <TabsContent value="seguranca" className="mt-6">
                    <ConfigSeguranca />
                </TabsContent>
                <TabsContent value="conta" className="mt-6">
                    <ConfigConta />
                </TabsContent>
            </Tabs>
        </div>
    )
}
