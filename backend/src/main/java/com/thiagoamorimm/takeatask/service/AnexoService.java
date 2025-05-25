package com.thiagoamorimm.takeatask.service;

import com.thiagoamorimm.takeatask.dto.AnexoDTO;
import com.thiagoamorimm.takeatask.model.Anexo;
import com.thiagoamorimm.takeatask.model.Usuario;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface AnexoService {
    AnexoDTO salvarAnexo(MultipartFile arquivo, Long tarefaId, Usuario usuarioUpload) throws IOException;

    AnexoDTO buscarAnexoPorId(Long id, Usuario usuarioAutenticado); // Verificar permissão pela tarefa

    List<AnexoDTO> listarAnexosPorTarefaId(Long tarefaId, Usuario usuarioAutenticado);

    void deletarAnexo(Long id, Usuario usuarioAutenticado) throws IOException;

    Resource baixarAnexo(Long id, Usuario usuarioAutenticado) throws IOException; // Para download direto

    Anexo findAnexoEntityById(Long id); // Método auxiliar
}
