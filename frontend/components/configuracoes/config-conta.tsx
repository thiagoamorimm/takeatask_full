"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserCircle, Upload, AlertTriangle } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function ConfigConta() {
    // Estados de exemplo - em uma aplicação real, viriam do usuário logado/API
    const [nomeCompleto, setNomeCompleto] = useState("João da Silva")
    const [email, setEmail] = useState("joao.silva@exemplo.com") // Geralmente não editável
    const [telefone, setTelefone] = useState("(11) 98765-4321")
    const [cargo, setCargo] = useState("Desenvolvedor")
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null) // ou URL do avatar atual

    const [perfilVisivel, setPerfilVisivel] = useState(true)
    const [statusOnlineVisivel, setStatusOnlineVisivel] = useState(true)

    const handleSalvarAlteracoes = () => {
        console.log("Salvando alterações da conta:", {
            nomeCompleto,
            telefone,
            cargo,
            avatarPreview, // Aqui seria o arquivo ou URL para upload
            perfilVisivel,
            statusOnlineVisivel,
        })
        // Adicionar lógica para salvar as configurações (ex: API call)
    }

    const handleExcluirConta = () => {
        console.log("Excluindo conta...")
        // Adicionar lógica para exclusão de conta (ex: API call)
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                setAvatarPreview(event.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Configurações de Conta</CardTitle>
                <CardDescription>
                    Gerencie suas informações pessoais e preferências de conta.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Seção Informações Pessoais */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Informações Pessoais</h3>
                    <p className="text-sm text-muted-foreground">
                        Atualize suas informações pessoais e de contato.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="nome-completo">Nome completo</Label>
                            <Input id="nome-completo" value={nomeCompleto} onChange={(e) => setNomeCompleto(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input id="email" type="email" value={email} disabled />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="telefone">Telefone</Label>
                            <Input id="telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cargo">Cargo</Label>
                            <Input id="cargo" value={cargo} onChange={(e) => setCargo(e.target.value)} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={avatarPreview || undefined} alt={nomeCompleto} />
                            <AvatarFallback><UserCircle className="h-10 w-10" /></AvatarFallback>
                        </Avatar>
                        <div>
                            <Label
                                htmlFor="avatar-upload-conta"
                                className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                            >
                                <Upload className="mr-2 h-4 w-4" />
                                Alterar foto
                            </Label>
                            <Input id="avatar-upload-conta" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                            <p className="text-xs text-muted-foreground mt-1">JPG, GIF ou PNG. Tamanho máximo de 2MB.</p>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Seção Preferências de Conta */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Preferências de Conta</h3>
                    <p className="text-sm text-muted-foreground">
                        Configure preferências gerais da sua conta.
                    </p>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <Label htmlFor="perfil-visivel" className="flex flex-col space-y-1">
                                <span>Tornar meu perfil visível para outros usuários</span>
                            </Label>
                            <Switch id="perfil-visivel" checked={perfilVisivel} onCheckedChange={setPerfilVisivel} />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <Label htmlFor="status-online-visivel" className="flex flex-col space-y-1">
                                <span>Mostrar meu status online</span>
                            </Label>
                            <Switch id="status-online-visivel" checked={statusOnlineVisivel} onCheckedChange={setStatusOnlineVisivel} />
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Seção Zona de Perigo */}
                <div className="space-y-4 rounded-lg border border-destructive bg-red-50/30 dark:bg-red-900/20 p-4">
                    <h3 className="text-lg font-medium text-destructive">Zona de Perigo</h3>
                    <p className="text-sm text-destructive/80">
                        Ações irreversíveis relacionadas à sua conta.
                    </p>
                    <div className="space-y-2">
                        <h4 className="font-semibold">Excluir conta</h4>
                        <p className="text-sm text-muted-foreground">
                            Ao excluir sua conta, todos os seus dados serão permanentemente removidos. Esta ação não pode ser desfeita.
                        </p>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">Excluir minha conta</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="flex items-center gap-2">
                                        <AlertTriangle className="h-5 w-5 text-red-500" />
                                        Tem certeza absoluta?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta e removerá seus dados de nossos servidores.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-red-600 hover:bg-red-700"
                                        onClick={handleExcluirConta}
                                    >
                                        Sim, excluir minha conta
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button onClick={handleSalvarAlteracoes}>Salvar Alterações</Button>
                </div>
            </CardContent>
        </Card>
    )
}
