package com.thiagoamorimm.takeatask.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "subtarefas")
@Data
@NoArgsConstructor
public class Subtarefa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "A descrição da subtarefa é obrigatória.")
    @Size(max = 255, message = "A descrição da subtarefa deve ter no máximo 255 caracteres.")
    @Column(nullable = false)
    private String descricao;

    @Column(nullable = false)
    private boolean concluida = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tarefa_id", nullable = false)
    private Tarefa tarefaPrincipal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "responsavel_id")
    private Usuario responsavel;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime dataCriacao;

    @UpdateTimestamp
    private LocalDateTime dataAtualizacao;

    public Subtarefa(String descricao, Tarefa tarefaPrincipal) {
        this.descricao = descricao;
        this.tarefaPrincipal = tarefaPrincipal;
    }

    public Subtarefa(String descricao, Tarefa tarefaPrincipal, Usuario responsavel) {
        this.descricao = descricao;
        this.tarefaPrincipal = tarefaPrincipal;
        this.responsavel = responsavel;
    }
}
