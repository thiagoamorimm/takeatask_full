package com.thiagoamorimm.takeatask.repository;

import com.thiagoamorimm.takeatask.enums.PrioridadeTarefa;
import com.thiagoamorimm.takeatask.enums.StatusTarefa;
import com.thiagoamorimm.takeatask.model.Tarefa;
import com.thiagoamorimm.takeatask.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor; // Adicionado
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Repository
public interface TarefaRepository extends JpaRepository<Tarefa, Long>, JpaSpecificationExecutor<Tarefa> {

        // Para Usuário Padrão: tarefas atribuídas a ele ou criadas por ele e atribuídas
        // a si mesmo
        @Query("SELECT t FROM Tarefa t WHERE t.responsavel = :usuario OR (t.criador = :usuario AND t.responsavel = :usuario)")
        List<Tarefa> findByResponsavelOrCriadorAndResponsavel(@Param("usuario") Usuario usuario);

        List<Tarefa> findByResponsavel(Usuario responsavel);

        List<Tarefa> findByCriador(Usuario criador);

        List<Tarefa> findByStatus(StatusTarefa status);

        List<Tarefa> findByPrioridade(PrioridadeTarefa prioridade);

        List<Tarefa> findByDataPrazoBetween(LocalDateTime inicio, LocalDateTime fim);

        List<Tarefa> findByDataPrazoBeforeAndStatusNot(LocalDateTime data, StatusTarefa status); // Tarefas atrasadas

        // Filtro combinado (exemplo inicial, pode ser expandido com Specification API
        // para mais flexibilidade)
        @Query("SELECT t FROM Tarefa t WHERE " +
                        "(:status IS NULL OR t.status = :status) AND " +
                        "(:prioridade IS NULL OR t.prioridade = :prioridade) AND " +
                        "(:responsavelId IS NULL OR t.responsavel.id = :responsavelId) AND " +
                        "(:dataPrazoInicio IS NULL OR t.dataPrazo >= :dataPrazoInicio) AND " +
                        "(:dataPrazoFim IS NULL OR t.dataPrazo <= :dataPrazoFim) AND " +
                        "(COALESCE(:tagIds, NULL) IS NULL OR EXISTS (SELECT tag FROM t.tags tag WHERE tag.id IN :tagIds))")
        List<Tarefa> findTarefasByFiltros(
                        @Param("status") StatusTarefa status,
                        @Param("prioridade") PrioridadeTarefa prioridade,
                        @Param("responsavelId") Long responsavelId,
                        @Param("dataPrazoInicio") LocalDateTime dataPrazoInicio,
                        @Param("dataPrazoFim") LocalDateTime dataPrazoFim,
                        @Param("tagIds") Set<Long> tagIds);

        // Pesquisa global (exemplo inicial)
        @Query("SELECT t FROM Tarefa t WHERE " +
                        "LOWER(t.nome) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
                        "LOWER(t.descricao) LIKE LOWER(CONCAT('%', :keyword, '%'))")
        List<Tarefa> searchByKeyword(@Param("keyword") String keyword);

        // Para Dashboard do Administrador
        List<Tarefa> findByStatusIn(Set<StatusTarefa> statuses);

        Long countByStatus(StatusTarefa status);

        Long countByPrioridade(PrioridadeTarefa prioridade);

        @Query("SELECT t.responsavel, COUNT(t) FROM Tarefa t WHERE t.status <> com.thiagoamorimm.takeatask.enums.StatusTarefa.CONCLUIDA GROUP BY t.responsavel")
        List<Object[]> countTarefasAtivasPorResponsavel();

        // Métodos para estatísticas
        long countByResponsavel(Usuario responsavel);

        long countByResponsavelAndStatus(Usuario responsavel, StatusTarefa status);

        // Para tarefas atrasadas de um usuário específico
        long countByResponsavelAndStatusNotAndDataPrazoBefore(Usuario responsavel, StatusTarefa statusExcluido,
                        LocalDateTime dataReferencia);

        // Para tarefas atrasadas globais (ADMIN)
        long countByStatusNotAndDataPrazoBefore(StatusTarefa statusExcluido, LocalDateTime dataReferencia);
}
