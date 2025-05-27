package com.thiagoamorimm.takeatask.repository;

import com.thiagoamorimm.takeatask.model.Comentario;
import com.thiagoamorimm.takeatask.model.Tarefa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComentarioRepository extends JpaRepository<Comentario, Long> {
    List<Comentario> findByTarefaOrderByDataCriacaoDesc(Tarefa tarefa);
    // Outros métodos de consulta personalizados podem ser adicionados aqui
}
