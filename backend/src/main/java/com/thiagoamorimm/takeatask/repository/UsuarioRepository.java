package com.thiagoamorimm.takeatask.repository;

import com.thiagoamorimm.takeatask.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import java.util.List; // Adicionar import para List

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByLogin(String login);
    Optional<Usuario> findByEmail(String email); // Novo método
    Optional<Usuario> findByEmailAndIdNot(String email, Long id); // Novo método

    List<Usuario> findByNomeContainingIgnoreCaseOrLoginContainingIgnoreCase(String nome, String login);
    // Outros métodos de consulta personalizados podem ser adicionados aqui
}
