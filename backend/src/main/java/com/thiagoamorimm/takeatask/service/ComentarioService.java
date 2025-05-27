package com.thiagoamorimm.takeatask.service;

import com.thiagoamorimm.takeatask.dto.ComentarioCreateDTO;
import com.thiagoamorimm.takeatask.dto.ComentarioDTO;
import com.thiagoamorimm.takeatask.model.Usuario; // Para o autor do comentário

import java.util.List;

public interface ComentarioService {
    ComentarioDTO adicionarComentario(Long tarefaId, ComentarioCreateDTO comentarioCreateDTO, Usuario autor);

    ComentarioDTO buscarComentarioPorId(Long id, Usuario usuarioAutenticado); // Verificar permissão pela tarefa

    List<ComentarioDTO> listarComentariosPorTarefaId(Long tarefaId, Usuario usuarioAutenticado);

    // Comentários geralmente não são atualizados, mas podem ser deletados
    void deletarComentario(Long id, Usuario usuarioAutenticado);
}
