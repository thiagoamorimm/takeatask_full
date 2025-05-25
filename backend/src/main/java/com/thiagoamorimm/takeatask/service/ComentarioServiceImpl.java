package com.thiagoamorimm.takeatask.service;

import com.thiagoamorimm.takeatask.dto.ComentarioCreateDTO;
import com.thiagoamorimm.takeatask.dto.ComentarioDTO;
import com.thiagoamorimm.takeatask.enums.PerfilUsuario;
import com.thiagoamorimm.takeatask.exception.BadRequestException;
import com.thiagoamorimm.takeatask.exception.ResourceNotFoundException;
import com.thiagoamorimm.takeatask.model.Comentario;
import com.thiagoamorimm.takeatask.model.Tarefa;
import com.thiagoamorimm.takeatask.model.Usuario;
import com.thiagoamorimm.takeatask.repository.ComentarioRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComentarioServiceImpl implements ComentarioService {

    private final ComentarioRepository comentarioRepository;
    private final TarefaService tarefaService; // Para buscar a tarefa e verificar permissões

    @Autowired
    public ComentarioServiceImpl(ComentarioRepository comentarioRepository,
            @Lazy TarefaService tarefaService) {
        this.comentarioRepository = comentarioRepository;
        this.tarefaService = tarefaService;
    }

    @Override
    @Transactional
    public ComentarioDTO adicionarComentario(Long tarefaId, ComentarioCreateDTO dto, Usuario autor) {
        // Use the tarefaId from the path parameter, ignoring any tarefaId in the DTO
        // Verifica se o usuário tem permissão para ver a tarefa (e, portanto, comentar)
        Tarefa tarefa = tarefaService.findTarefaEntityById(tarefaId);
        tarefaService.buscarTarefaPorId(tarefaId, autor); // Verifica permissão de visualização

        Comentario comentario = new Comentario();
        comentario.setTexto(dto.getTexto());
        comentario.setTarefa(tarefa);
        comentario.setAutor(autor);

        Comentario novoComentario = comentarioRepository.save(comentario);
        return convertToDTO(novoComentario);
    }

    @Override
    @Transactional(readOnly = true)
    public ComentarioDTO buscarComentarioPorId(Long id, Usuario usuarioAutenticado) {
        Comentario comentario = findComentarioEntityById(id);
        // Verifica se o usuário pode ver a tarefa associada ao comentário
        tarefaService.buscarTarefaPorId(comentario.getTarefa().getId(), usuarioAutenticado);
        return convertToDTO(comentario);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComentarioDTO> listarComentariosPorTarefaId(Long tarefaId, Usuario usuarioAutenticado) {
        // Verifica se o usuário pode ver a tarefa
        Tarefa tarefa = tarefaService.findTarefaEntityById(tarefaId);
        tarefaService.buscarTarefaPorId(tarefaId, usuarioAutenticado);

        return comentarioRepository.findByTarefaOrderByDataCriacaoDesc(tarefa).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deletarComentario(Long id, Usuario usuarioAutenticado) {
        Comentario comentario = findComentarioEntityById(id);
        Tarefa tarefaDoComentario = comentario.getTarefa();

        // Regras de permissão para deletar comentário:
        // 1. Administrador/Gestor pode deletar qualquer comentário.
        // 2. O autor do comentário pode deletar seu próprio comentário.
        // 3. O criador ou responsável pela tarefa pode deletar comentários na tarefa.
        boolean temPermissao = false;
        if (usuarioAutenticado.getPerfil() == PerfilUsuario.ADMINISTRADOR_GESTOR ||
                comentario.getAutor().getId().equals(usuarioAutenticado.getId()) ||
                tarefaDoComentario.getCriador().getId().equals(usuarioAutenticado.getId()) ||
                (tarefaDoComentario.getResponsavel() != null
                        && tarefaDoComentario.getResponsavel().getId().equals(usuarioAutenticado.getId()))) {
            temPermissao = true;
        }

        if (!temPermissao) {
            throw new BadRequestException("Você não tem permissão para deletar este comentário.");
        }

        comentarioRepository.delete(comentario);
    }

    private Comentario findComentarioEntityById(Long id) {
        return comentarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comentário", "id", id));
    }

    private ComentarioDTO convertToDTO(Comentario comentario) {
        ComentarioDTO dto = new ComentarioDTO();
        BeanUtils.copyProperties(comentario, dto, "tarefa", "autor");
        dto.setTarefaId(comentario.getTarefa().getId());
        if (comentario.getAutor() != null) {
            dto.setAutorId(comentario.getAutor().getId());
            dto.setNomeAutor(comentario.getAutor().getNome());
        }
        return dto;
    }
}
