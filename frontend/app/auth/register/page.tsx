"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nome: "",
    login: "",
    senha: "",
    perfil: "USUARIO_PADRAO" // Default profile type
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:8081/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({...form, email: undefined}) // Remove 'email' se ainda existir no objeto
      });
      if (res.ok) {
        router.push("/auth/login");
      } else {
        const data = await res.json();
        setError(data.message || "Erro ao registrar usuário.");
      }
    } catch (err) {
      setError("Erro ao registrar usuário.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <h2>Crie sua conta</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 300 }}>
        <input name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} required />
        <input name="login" type="text" placeholder="Login" value={form.login} onChange={handleChange} required />
        <input name="senha" type="password" placeholder="Senha" value={form.senha} onChange={handleChange} required />
        <input name="perfil" type="hidden" value={form.perfil} />
        <button type="submit">Registrar</button>
        {error && <span style={{ color: "red" }}>{error}</span>}
      </form>
      <button onClick={() => router.push("/auth/login")}>Já tem conta? Entrar</button>
    </div>
  );
}
