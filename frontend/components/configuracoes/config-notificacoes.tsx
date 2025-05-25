"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export default function ConfigNotificacoes() {
    // Estados de exemplo
    const [notifApp, setNotifApp] = useState(true)
    const [notifEmail, setNotifEmail] = useState(true)
    const [emailNotificacao, setEmailNotificacao] = useState("usuario@exemplo.com")
    const [notifPush, setNotifPush] = useState(false)

    const [tipoTarefasAtribuidas, setTipoTarefasAtribuidas] = useState(true)
    const [tipoComentarios, setTipoComentarios] = useState(true)
    const [tipoPrazos, setTipoPrazos] = useState(true)
    const [tipoStatusTarefas, setTipoStatusTarefas] = useState(true)

    const [frequenciaResumoEmail, setFrequenciaResumoEmail] = useState("diario")

    const handleSalvar = () => {
        console.log("Preferências de Notificação Salvas:", {
            notifApp,
            notifEmail,
            emailNotificacao: notifEmail ? emailNotificacao : null,
            notifPush,
            tipoTarefasAtribuidas,
            tipoComentarios,
            tipoPrazos,
            tipoStatusTarefas,
            frequenciaResumoEmail,
        })
        // Adicionar lógica para salvar as configurações (ex: API call)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Configurações de Notificações</CardTitle>
                <CardDescription>
                    Gerencie como e quando você recebe notificações do sistema.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Seção Canais de Notificação */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Canais de Notificação</h3>
                    <p className="text-sm text-muted-foreground">
                        Escolha como deseja receber suas notificações.
                    </p>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <Label htmlFor="notif-app" className="flex flex-col space-y-1">
                                <span>Notificações no aplicativo</span>
                            </Label>
                            <Switch id="notif-app" checked={notifApp} onCheckedChange={setNotifApp} />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <Label htmlFor="notif-email" className="flex flex-col space-y-1">
                                <span>Notificações por e-mail</span>
                            </Label>
                            <Switch id="notif-email" checked={notifEmail} onCheckedChange={setNotifEmail} />
                        </div>
                        {notifEmail && (
                            <div className="pl-4 space-y-2">
                                <Label htmlFor="email-notificacao">E-mail para notificações</Label>
                                <Input
                                    id="email-notificacao"
                                    type="email"
                                    placeholder="seuemail@exemplo.com"
                                    value={emailNotificacao}
                                    onChange={(e) => setEmailNotificacao(e.target.value)}
                                    disabled={!notifEmail}
                                />
                            </div>
                        )}
                        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <Label htmlFor="notif-push" className="flex flex-col space-y-1">
                                <span>Notificações push</span>
                                <span className="font-normal leading-snug text-muted-foreground">
                                    Receba notificações push em seus dispositivos móveis.
                                </span>
                            </Label>
                            <Switch id="notif-push" checked={notifPush} onCheckedChange={setNotifPush} />
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Seção Tipos de Notificação */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Tipos de Notificação</h3>
                    <p className="text-sm text-muted-foreground">
                        Escolha quais tipos de eventos devem gerar notificações.
                    </p>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <Label htmlFor="tipo-tarefas-atribuidas">Tarefas atribuídas a mim</Label>
                            <Switch id="tipo-tarefas-atribuidas" checked={tipoTarefasAtribuidas} onCheckedChange={setTipoTarefasAtribuidas} />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <Label htmlFor="tipo-comentarios">Comentários em minhas tarefas</Label>
                            <Switch id="tipo-comentarios" checked={tipoComentarios} onCheckedChange={setTipoComentarios} />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <Label htmlFor="tipo-prazos">Prazos próximos (48h antes)</Label>
                            <Switch id="tipo-prazos" checked={tipoPrazos} onCheckedChange={setTipoPrazos} />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <Label htmlFor="tipo-status-tarefas">Alterações de status em tarefas</Label>
                            <Switch id="tipo-status-tarefas" checked={tipoStatusTarefas} onCheckedChange={setTipoStatusTarefas} />
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Seção Frequência de Notificações */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Frequência de Notificações</h3>
                    <p className="text-sm text-muted-foreground">
                        Configure a frequência com que deseja receber notificações.
                    </p>
                    <div className="space-y-2">
                        <Label htmlFor="frequencia-resumo-email">Resumo por e-mail</Label>
                        <Select value={frequenciaResumoEmail} onValueChange={setFrequenciaResumoEmail}>
                            <SelectTrigger id="frequencia-resumo-email">
                                <SelectValue placeholder="Selecione a frequência" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="nunca">Nunca</SelectItem>
                                <SelectItem value="diario">Diário</SelectItem>
                                <SelectItem value="semanal">Semanal</SelectItem>
                                <SelectItem value="mensal">Mensal</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button onClick={handleSalvar}>Salvar Preferências</Button>
                </div>
            </CardContent>
        </Card>
    )
}
