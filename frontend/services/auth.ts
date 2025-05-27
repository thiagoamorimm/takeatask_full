import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

export interface LoginResponse {
  token: string;
  usuario: {
    id: number;
    nome: string;
    email: string;
    perfil: string;
  };
}

export const authService = {
  async login(login: string, senha: string): Promise<LoginResponse> {
    try {
      console.log(`Tentando login no backend: ${API_URL}/api/auth/login`);
      
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, senha }),
        mode: 'cors',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Erro no login: Status ${response.status}`, errorText);
        throw new Error(`Credenciais inválidas (${response.status})`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao tentar fazer login:', error);
      throw error;
    }
  },

  async logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      Cookies.remove('token');
      console.log('Logout realizado com sucesso');
    }
  },

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
}; 