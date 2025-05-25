package com.thiagoamorimm.takeatask.model;

import com.thiagoamorimm.takeatask.enums.PerfilUsuario;
import jakarta.persistence.*;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;


@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome do usuário é obrigatório.")
    @Size(min = 3, max = 100, message = "O nome do usuário deve ter entre 3 e 100 caracteres.")
    @Column(nullable = false, length = 100)
    private String nome;

    @NotBlank(message = "O login do usuário é obrigatório.")
    @Size(min = 3, max = 50, message = "O login do usuário deve ter entre 3 e 50 caracteres.")
    @Column(nullable = false, unique = true, length = 50)
    private String login;

    @NotBlank(message = "A senha é obrigatória.")
    @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres.")
    @Column(nullable = false)
    private String senha;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private PerfilUsuario perfil;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime dataCriacao;

    @UpdateTimestamp
    private LocalDateTime dataAtualizacao;

    private boolean ativo = true;

    // Campos para Configurações Gerais
    @Column(length = 20)
    private String tema; // "claro", "escuro", "sistema"

    @Column(length = 10)
    private String idioma; // "pt-br", "en-us", "es-es"

    @Column(length = 50)
    private String fusoHorario; // Ex: "America/Sao_Paulo", "GMT-3"

    @Column(length = 20)
    private String formatoData; // "dd/mm/aaaa", "mm/dd/aaaa", "aaaa-mm-dd"

    @Column(length = 10)
    private String formatoHora; // "24h", "12h"

    // Relacionamentos (serão adicionados posteriormente conforme necessário)
    // @OneToMany(mappedBy = "responsavel")
    // private Set<Tarefa> tarefasAtribuidas = new HashSet<>();

    // @OneToMany(mappedBy = "criador")
    // private Set<Tarefa> tarefasCriadas = new HashSet<>();

    // @OneToMany(mappedBy = "autor")
    // private Set<Comentario> comentarios = new HashSet<>();

    public Usuario(String nome, String login, String senha, PerfilUsuario perfil) {
        this.nome = nome;
        this.login = login;
        this.senha = senha; // Idealmente, a senha seria hashada antes de ser salva
        this.perfil = perfil;
    }
}
