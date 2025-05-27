package com.thiagoamorimm.takeatask.service;

import com.thiagoamorimm.takeatask.dto.SubtarefaCreateDTO;
import com.thiagoamorimm.takeatask.dto.SubtarefaDTO;
import com.thiagoamorimm.takeatask.dto.SubtarefaUpdateDTO;
import com.thiagoamorimm.takeatask.exception.ResourceNotFoundException;
import com.thiagoamorimm.takeatask.model.Subtarefa;
import com.thiagoamorimm.takeatask.model.Tarefa;
import com.thiagoamorimm.takeatask.model.Usuario;
import com.thiagoamorimm.takeatask.repository.SubtarefaRepository;
// Import TarefaService para buscar a Tarefa principal. Evitar dependência cíclica direta se possível.
// Alternativamente, o TarefaRepository pode ser injetado aqui se TarefaService for muito complexo.
// Por simplicidade, vamos assumir que TarefaService existe e pode ser usado.
// import com.thiagoamorimm.takeatask.repository.TarefaRepository; // Opção mais simples
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubtarefaServiceImpl implements SubtarefaService {

    private final SubtarefaRepository subtarefaRepository;
    private final TarefaService tarefaService; // Usar @Lazy para quebrar ciclo de dependência se necessário
    private final UsuarioService usuarioService; // Para buscar entidade Usuario

    @Autowired
    public SubtarefaServiceImpl(SubtarefaRepository subtarefaRepository,
            @Lazy TarefaService tarefaService, // @Lazy aqui
            @Lazy UsuarioService usuarioService) {
        this.subtarefaRepository = subtarefaRepository;
        this.tarefaService = tarefaService;
        this.usuarioService = usuarioService;
    }

    @Override
    @Transactional
    public SubtarefaDTO criarSubtarefa(SubtarefaCreateDTO dto, Long tarefaId) {
        Tarefa tarefaPrincipal = tarefaService.findTarefaEntityById(tarefaId); // Busca a tarefa principal
        Subtarefa subtarefa = new Subtarefa();
        subtarefa.setDescricao(dto.getDescricao());
        subtarefa.setTarefaPrincipal(tarefaPrincipal);

        if (dto.getResponsavelId() != null) {
            Usuario responsavel = usuarioService.findUsuarioEntityById(dto.getResponsavelId());
            subtarefa.setResponsavel(responsavel);
        }

        Subtarefa novaSubtarefa = subtarefaRepository.save(subtarefa);
        return convertToDTO(novaSubtarefa);
    }

    @Override
    @Transactional(readOnly = true)
    public SubtarefaDTO buscarSubtarefaPorId(Long id) {
        Subtarefa subtarefa = findSubtarefaEntityById(id);
        return convertToDTO(subtarefa);
    }

    @Override
    @Transactional(readOnly = true)
    public Subtarefa findSubtarefaEntityById(Long id) {
        return subtarefaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subtarefa", "id", id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubtarefaDTO> listarSubtarefasPorTarefaId(Long tarefaId) {
        Tarefa tarefaPrincipal = tarefaService.findTarefaEntityById(tarefaId);
        return subtarefaRepository.findByTarefaPrincipal(tarefaPrincipal).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SubtarefaDTO atualizarSubtarefa(Long id, SubtarefaUpdateDTO dto) {
        Subtarefa subtarefaExistente = findSubtarefaEntityById(id);

        if (dto.getDescricao() != null) {
            subtarefaExistente.setDescricao(dto.getDescricao());
        }
        if (dto.getConcluida() != null) {
            subtarefaExistente.setConcluida(dto.getConcluida());
        }
        if (dto.getResponsavelId() != null) {
            Usuario responsavel = usuarioService.findUsuarioEntityById(dto.getResponsavelId());
            subtarefaExistente.setResponsavel(responsavel);
        } else if (dto.getResponsavelId() == null && subtarefaExistente.getResponsavel() != null) {
            // Se o ID do responsável for explicitamente nulo, remove o responsável
            subtarefaExistente.setResponsavel(null);
        }

        Subtarefa subtarefaAtualizada = subtarefaRepository.save(subtarefaExistente);
        return convertToDTO(subtarefaAtualizada);
    }

    @Override
    @Transactional
    public void deletarSubtarefa(Long id) {
        Subtarefa subtarefa = findSubtarefaEntityById(id);
        subtarefaRepository.delete(subtarefa);
    }

    private SubtarefaDTO convertToDTO(Subtarefa subtarefa) {
        SubtarefaDTO dto = new SubtarefaDTO();
        BeanUtils.copyProperties(subtarefa, dto, "tarefaPrincipal", "responsavel"); // Evita cópia direta de entidades
        dto.setTarefaPrincipalId(subtarefa.getTarefaPrincipal().getId());
        if (subtarefa.getResponsavel() != null) {
            dto.setResponsavelId(subtarefa.getResponsavel().getId());
            dto.setNomeResponsavel(subtarefa.getResponsavel().getNome());
        }
        return dto;
    }
}
