package com.thiagoamorimm.takeatask.repository;

import com.thiagoamorimm.takeatask.model.Subtarefa;
import com.thiagoamorimm.takeatask.model.Tarefa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubtarefaRepository extends JpaRepository<Subtarefa, Long> {
    List<Subtarefa> findByTarefaPrincipal(Tarefa tarefaPrincipal);
    // Outros métodos de consulta personalizados podem ser adicionados aqui
}
