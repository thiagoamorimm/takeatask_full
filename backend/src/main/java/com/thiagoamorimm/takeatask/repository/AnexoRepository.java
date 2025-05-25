package com.thiagoamorimm.takeatask.repository;

import com.thiagoamorimm.takeatask.model.Anexo;
import com.thiagoamorimm.takeatask.model.Tarefa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnexoRepository extends JpaRepository<Anexo, Long> {
    List<Anexo> findByTarefa(Tarefa tarefa);
    // Outros métodos de consulta personalizados podem ser adicionados aqui
}
