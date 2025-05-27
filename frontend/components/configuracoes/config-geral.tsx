"use client"

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, AlertTriangle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Cookies from 'js-cookie'

// Supondo que o ID do usuário logado é 1 para este exemplo
const USUARIO_LOGADO_ID = 1;

interface UsuarioConfigDTO {
    nome?: string; // Exemplo, pode não ser editável aqui mas útil para exibição
}

export default function ConfigGeral() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);



    useEffect(() => {
        const fetchConfiguracoes = async () => {
            setLoading(true);
            setError(null);
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";
                let token = '';
                if (typeof window !== 'undefined') {
                    token = localStorage.getItem('token') || Cookies.get('token') || '';
                }
                const response = await fetch(`${apiUrl}/api/usuarios/${USUARIO_LOGADO_ID}`,
                    token ? {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    } : undefined
                );
                if (!response.ok) {
                    throw new Error(`Falha ao buscar configurações: ${response.statusText}`);
                }
                const data: UsuarioConfigDTO = await response.json();

            } catch (err) {
                if (err instanceof Error) setError(err.message);
                else setError("Erro desconhecido ao buscar configurações.");
                console.error("Erro ao buscar configurações:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchConfiguracoes();
    }, []);

    const handleSalvar = async () => {
        setIsSaving(true);
        setError(null);
        // Não há mais configurações para salvar além das essenciais. Adapte aqui se necessário.
        const configuracoesParaSalvar = {};

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";
            const response = await fetch(`${apiUrl}/api/usuarios/${USUARIO_LOGADO_ID}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(configuracoesParaSalvar),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: response.statusText }));
                throw new Error(`Falha ao salvar configurações: ${errorData.message || response.statusText}`);
            }

            toast({ title: "Sucesso", description: "Configurações gerais salvas." });
        } catch (err) {
            if (err instanceof Error) setError(err.message);
            else setError("Erro desconhecido ao salvar configurações.");
            toast({ variant: "destructive", title: "Erro ao salvar", description: err instanceof Error ? err.message : "Tente novamente." });
            console.error("Erro ao salvar configurações:", err);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Carregando configurações...</span>
            </div>
        );
    }

    if (error && !loading) { // Mostrar erro apenas se não estiver mais carregando
        return (
            <div className="flex flex-col items-center justify-center p-10 text-destructive">
                <AlertTriangle className="h-8 w-8 mb-2" />
                <p className="font-semibold">Erro ao carregar configurações</p>
                <p className="text-sm">{error}</p>
                <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">Tentar Novamente</Button>
            </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
                <CardDescription>
                    Configurações essenciais do sistema.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Nenhuma configuração de aparência, idioma ou região disponível. O tema escuro é padrão e permanente.</p>
            </CardContent>
        </Card>
    );
}
