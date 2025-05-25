package com.thiagoamorimm.takeatask.repository;

import com.thiagoamorimm.takeatask.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import java.util.List; // Adicionar import para List

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    Optional<Tag> findByNome(String nome);

    List<Tag> findByNomeContainingIgnoreCaseOrDescricaoContainingIgnoreCase(String nome, String descricao);
    // Outros métodos de consulta personalizados podem ser adicionados aqui
}
