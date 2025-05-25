package com.thiagoamorimm.takeatask.service;

import com.thiagoamorimm.takeatask.dto.TarefaCreateDTO;
import com.thiagoamorimm.takeatask.dto.TarefaDTO;
import com.thiagoamorimm.takeatask.dto.TarefaStatsDTO;
import com.thiagoamorimm.takeatask.dto.TarefaUpdateDTO;
import com.thiagoamorimm.takeatask.enums.PrioridadeTarefa;
import com.thiagoamorimm.takeatask.enums.StatusTarefa;
import com.thiagoamorimm.takeatask.model.Tarefa; // Necessário para findTarefaEntityById
import com.thiagoamorimm.takeatask.model.Usuario;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public interface TarefaService {
        TarefaDTO criarTarefa(TarefaCreateDTO tarefaCreateDTO, Usuario criador);

        TarefaDTO buscarTarefaPorId(Long id, Usuario usuarioAutenticado); // Considera permissões

        List<TarefaDTO> listarTarefasPorUsuario(Usuario usuarioAutenticado,
                        StatusTarefa status,
                        PrioridadeTarefa prioridade,
                        Long responsavelId,
                        LocalDateTime dataPrazoInicio,
                        LocalDateTime dataPrazoFim,
                        Set<Long> tagIds);

        List<TarefaDTO> listarTodasTarefasAdmin(StatusTarefa status,
                        PrioridadeTarefa prioridade,
                        Long responsavelId,
                        LocalDateTime dataPrazoInicio,
                        LocalDateTime dataPrazoFim,
                        Set<Long> tagIds); // Para admin ver tudo

        List<TarefaDTO> pesquisarTarefas(String keyword, Usuario usuarioAutenticado);

        TarefaDTO atualizarTarefa(Long id, TarefaUpdateDTO tarefaUpdateDTO, Usuario usuarioAutenticado);

        void deletarTarefa(Long id, Usuario usuarioAutenticado);

        Tarefa findTarefaEntityById(Long id); // Método auxiliar, pode precisar de verificação de permissão interna

        TarefaStatsDTO getTarefaStats(Usuario usuarioAutenticado);

        List<TarefaDTO> listarTarefasFiltradas(Usuario usuarioAutenticado,
                        StatusTarefa status,
                        PrioridadeTarefa prioridade,
                        Long responsavelId,
                        LocalDateTime dataPrazoInicio,
                        LocalDateTime dataPrazoFim,
                        Set<Long> tagIds,
                        String keyword,
                        String tipoFiltro);
}
