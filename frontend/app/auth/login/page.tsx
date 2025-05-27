'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/auth';
import Cookies from 'js-cookie';

export default function LoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrar, setLembrar] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const savedLogin = localStorage.getItem('rememberedLogin');
    if (savedLogin) {
      setLogin(savedLogin);
      setLembrar(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      console.log('Tentando fazer login com:', { login });
      const data = await authService.login(login, senha);
      
      // Armazena o token em localStorage e cookies
      localStorage.setItem('token', data.token);
      Cookies.set('token', data.token, { expires: 7 });
      
      // Salva o nome do usuário com verificação
      if (data.usuario && data.usuario.nome) {
        localStorage.setItem('userName', data.usuario.nome);
        Cookies.set('userName', data.usuario.nome, { expires: 7 });
      } else {
        console.warn("Nome do usuário não encontrado na resposta do login:", data);
        // Opcionalmente, limpar userName se não vier na resposta
        localStorage.removeItem('userName');
        Cookies.remove('userName');
      }

      // Salva login e senha se lembrar estiver marcado
      if (lembrar) {
        localStorage.setItem('rememberedLogin', login);
      } else {
        localStorage.removeItem('rememberedLogin');
      }
      
      console.log('Login bem-sucedido, redirecionando...');
      router.push('/tarefas');
    } catch (error) {
      console.error('Erro durante o login:', error);
      if (error instanceof Error) {
        setErro(error.message || 'Login ou senha inválidos');
      } else {
        setErro('Erro ao conectar com o servidor. Tente novamente.');
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 py-12 px-4 sm:px-6 lg:px-8 text-zinc-100">
      <div className="max-w-md w-full space-y-8 bg-zinc-800 rounded-xl shadow-lg p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-zinc-100">
            Entre na sua conta
          </h2>

        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="login" className="sr-only">
                Login
              </label>
              <input
                id="login"
                name="login"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-zinc-700 bg-zinc-900 placeholder-zinc-400 text-zinc-100 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Login"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="senha" className="sr-only">
                Senha
              </label>
              <input
                id="senha"
                name="senha"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-zinc-700 bg-zinc-900 placeholder-zinc-400 text-zinc-100 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>
            <div className="flex items-center mt-4 w-full px-1">
              <input
                id="lembrar"
                name="lembrar"
                type="checkbox"
                checked={lembrar}
                onChange={(e) => setLembrar(e.target.checked)}
                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-zinc-700 rounded bg-zinc-900"
                style={{ minWidth: '0.75rem' }}
              />
              <label htmlFor="lembrar" className="ml-2 block text-xs text-zinc-400 select-none">
                Lembre de mim
              </label>
            </div>
          </div>

          {erro && (
            <div className="text-red-400 text-sm text-center">{erro}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={carregando}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 