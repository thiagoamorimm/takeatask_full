package com.thiagoamorimm.takeatask.service;

import com.thiagoamorimm.takeatask.dto.SubtarefaCreateDTO;
import com.thiagoamorimm.takeatask.dto.SubtarefaDTO;
import com.thiagoamorimm.takeatask.dto.SubtarefaUpdateDTO;
import com.thiagoamorimm.takeatask.model.Subtarefa; // Necessário para findSubtarefaEntityById

import java.util.List;

public interface SubtarefaService {
    SubtarefaDTO criarSubtarefa(SubtarefaCreateDTO subtarefaCreateDTO, Long tarefaId); // tarefaId para associar

    SubtarefaDTO buscarSubtarefaPorId(Long id);

    List<SubtarefaDTO> listarSubtarefasPorTarefaId(Long tarefaId);

    SubtarefaDTO atualizarSubtarefa(Long id, SubtarefaUpdateDTO subtarefaUpdateDTO);

    void deletarSubtarefa(Long id);

    Subtarefa findSubtarefaEntityById(Long id); // Método auxiliar
}
