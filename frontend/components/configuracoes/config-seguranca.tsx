"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function ConfigSeguranca() {
    const [senhaAtual, setSenhaAtual] = useState("")
    const [novaSenha, setNovaSenha] = useState("")
    const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("")

    const handleAlterarSenha = () => {
        console.log("Alterando senha:", { senhaAtual, novaSenha, confirmarNovaSenha })
        // Adicionar lógica de validação e chamada de API
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle>Configurações de Segurança</CardTitle>
                <CardDescription>
                    Gerencie as configurações de segurança da sua conta.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Seção Senha */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Senha</h3>
                    <p className="text-sm text-muted-foreground">
                        Altere sua senha periodicamente para manter sua conta segura.
                    </p>
                    <div className="space-y-3">
                        <div>
                            <Label htmlFor="senha-atual">Senha atual</Label>
                            <Input id="senha-atual" type="password" value={senhaAtual} onChange={(e) => setSenhaAtual(e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="nova-senha">Nova senha</Label>
                            <Input id="nova-senha" type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="confirmar-nova-senha">Confirmar nova senha</Label>
                            <Input id="confirmar-nova-senha" type="password" value={confirmarNovaSenha} onChange={(e) => setConfirmarNovaSenha(e.target.value)} />
                        </div>
                        <Button onClick={handleAlterarSenha} className="mt-2">Alterar senha</Button>
                    </div>
                </div>

            </CardContent>
        </Card>
    )
}
