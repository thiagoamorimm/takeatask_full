// Comentario service for fetching and managing comments

export interface Comentario {
  id: number;
  texto: string;
  data: string;
  tarefaId: number;
  usuario: {
    id: number;
    nome: string;
    avatar?: string;
    iniciais: string;
  };
}

export interface ComentarioCreateDTO {
  texto: string;
}

/**
 * Fetch all comments for a task
 */
export async function fetchComentariosPorTarefa(tarefaId: number): Promise<Comentario[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";
    const token = localStorage.getItem("token");
    console.log("Token do localStorage em fetchComentariosPorTarefa:", token); // Log para depuração
    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${apiUrl}/api/tarefas/${tarefaId}/comentarios`, { headers });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Error fetching comments for task ${tarefaId}:`, response.status, errorData);
      throw new Error(`Error fetching comments: ${response.statusText} - ${errorData}`);
    }

    const data = await response.json();

    // Map the API response to our Comentario interface
    const comentarios: Comentario[] = data.map((comentario: any) => ({
      id: comentario.id,
      texto: comentario.texto,
      data: comentario.dataCriacao,
      tarefaId: comentario.tarefaId,
      usuario: {
        id: comentario.autorId,
        nome: comentario.nomeAutor,
        avatar: comentario.avatarAutor || "/placeholder.svg?height=40&width=40",
        iniciais: getInitials(comentario.nomeAutor),
      },
    }));

    return comentarios;
  } catch (error) {
    console.error("Error in fetchComentariosPorTarefa:", error);
    throw error;
  }
}

/**
 * Add a new comment to a task
 */
export async function adicionarComentario(tarefaId: number, texto: string): Promise<Comentario> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";
    const token = localStorage.getItem("token");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${apiUrl}/api/tarefas/${tarefaId}/comentarios`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ texto }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Error adding comment to task ${tarefaId}:`, response.status, errorData);
      throw new Error(`Error adding comment: ${response.statusText} - ${errorData}`);
    }

    const data = await response.json();

    // Map the API response to our Comentario interface
    const comentario: Comentario = {
      id: data.id,
      texto: data.texto,
      data: data.dataCriacao,
      tarefaId: data.tarefaId,
      usuario: {
        id: data.autorId,
        nome: data.nomeAutor,
        avatar: data.avatarAutor || "/placeholder.svg?height=40&width=40",
        iniciais: getInitials(data.nomeAutor),
      },
    };

    return comentario;
  } catch (error) {
    console.error("Error in adicionarComentario:", error);
    throw error;
  }
}

/**
 * Delete a comment
 */
export async function deletarComentario(tarefaId: number, comentarioId: number): Promise<void> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";
    const token = localStorage.getItem("token");
    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${apiUrl}/api/tarefas/${tarefaId}/comentarios/${comentarioId}`, {
      method: "DELETE",
      headers: headers,
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Error deleting comment ${comentarioId}:`, response.status, errorData);
      throw new Error(`Error deleting comment: ${response.statusText} - ${errorData}`);
    }
  } catch (error) {
    console.error("Error in deletarComentario:", error);
    throw error;
  }
}

/**
 * Helper function to get initials from a name
 */
function getInitials(name: string): string {
  if (!name) return "??";

  const parts = name.split(" ");
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
