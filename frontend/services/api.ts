import { authService } from './auth';

// URL base da API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

interface FetchOptions extends RequestInit {
  requiresAuth?: boolean;
}

/**
 * Serviço centralizado para fazer requisições HTTP à API
 */
export const apiService = {
  /**
   * Método para fazer requisições à API com tratamento de autenticação
   */
  async fetch(endpoint: string, options: FetchOptions = {}): Promise<Response> {
    const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
    
    const headers = new Headers(options.headers);
    
    // Adiciona o Content-Type padrão se não for fornecido
    if (!headers.has('Content-Type') && !options.method?.toUpperCase().includes('GET')) {
      headers.append('Content-Type', 'application/json');
    }
    
    // Adiciona o token de autenticação se necessário
    if (options.requiresAuth !== false) {
      const token = authService.getToken();
      if (token) {
        headers.append('Authorization', `Bearer ${token}`);
      }
    }
    
    const fetchOptions: RequestInit = {
      ...options,
      headers
    };
    
    // Executa a requisição
    const response = await fetch(url, fetchOptions);
    
    // Trata erros comuns
    if (!response.ok) {
      console.error(`Erro na requisição ${url}:`, response.status, response.statusText);
      
      // Se for erro de autenticação e existir um token, pode ter expirado
      if (response.status === 401 && authService.getToken()) {
        console.warn('Token possivelmente expirado. Redirecionando para login...');
        // Limpa o token e redireciona para login
        authService.logout();
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
      }
    }
    
    return response;
  },
  
  /**
   * Método para requisições GET com tratamento de autenticação
   */
  async get<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const response = await this.fetch(endpoint, {
      ...options,
      method: 'GET'
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao obter dados: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  },
  
  /**
   * Método para requisições POST com tratamento de autenticação
   */
  async post<T>(endpoint: string, data: any, options: FetchOptions = {}): Promise<T> {
    const response = await this.fetch(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao enviar dados: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  },
  
  /**
   * Método para requisições PUT com tratamento de autenticação
   */
  async put<T>(endpoint: string, data: any, options: FetchOptions = {}): Promise<T> {
    const response = await this.fetch(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao atualizar dados: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  },
  
  /**
   * Método para requisições DELETE com tratamento de autenticação
   */
  async delete(endpoint: string, options: FetchOptions = {}): Promise<void> {
    const response = await this.fetch(endpoint, {
      ...options,
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao excluir: ${response.status} ${response.statusText}`);
    }
  }
};
