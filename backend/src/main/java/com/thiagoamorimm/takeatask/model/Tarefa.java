package com.thiagoamorimm.takeatask.model;

import com.thiagoamorimm.takeatask.enums.PrioridadeTarefa;
import com.thiagoamorimm.takeatask.enums.StatusTarefa;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "tarefas")
@Data
@NoArgsConstructor
public class Tarefa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome da tarefa é obrigatório.")
    @Size(min = 3, max = 150, message = "O nome da tarefa deve ter entre 3 e 150 caracteres.")
    @Column(nullable = false, length = 150)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @NotNull(message = "O status da tarefa é obrigatório.")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private StatusTarefa status;

    @NotNull(message = "A prioridade da tarefa é obrigatória.")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PrioridadeTarefa prioridade;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "responsavel_id")
    private Usuario responsavel;

    @NotNull(message = "O criador da tarefa é obrigatório.")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "criador_id", nullable = false)
    private Usuario criador;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime dataCriacao;

    @UpdateTimestamp
    private LocalDateTime dataAtualizacao;

    private LocalDateTime dataPrazo;

    @ManyToMany 
    @JoinTable(name = "tarefa_tags", joinColumns = @JoinColumn(name = "tarefa_id"), inverseJoinColumns = @JoinColumn(name = "tag_id"))
    private Set<Tag> tags = new HashSet<>();

    @OneToMany(mappedBy = "tarefa", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Anexo> anexos = new ArrayList<>();

    @OneToMany(mappedBy = "tarefa", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comentario> comentarios = new ArrayList<>();

    // O Histórico de Alterações (Audit Log) pode ser implementado com
    // @EntityListeners
    // e uma entidade separada para registrar as alterações, ou usando bibliotecas
    // como Javers ou Envers.
    // Por simplicidade inicial, não será implementado agora.

    public Tarefa(String nome, String descricao, StatusTarefa status, PrioridadeTarefa prioridade, Usuario responsavel,
            Usuario criador, LocalDateTime dataPrazo) {
        this.nome = nome;
        this.descricao = descricao;
        this.status = status;
        this.prioridade = prioridade;
        this.responsavel = responsavel;
        this.criador = criador;
        this.dataPrazo = dataPrazo;
    }

    // Métodos utilitários para adicionar/remover tags, etc.
    public void addTag(Tag tag) {
        this.tags.add(tag);
        tag.getTarefas().add(this);
    }

    public void removeTag(Tag tag) {
        this.tags.remove(tag);
        tag.getTarefas().remove(this);
    }

    public void addAnexo(Anexo anexo) {
        this.anexos.add(anexo);
        anexo.setTarefa(this);
    }

    public void removeAnexo(Anexo anexo) {
        this.anexos.remove(anexo);
        anexo.setTarefa(null);
    }

    public void addComentario(Comentario comentario) {
        this.comentarios.add(comentario);
        comentario.setTarefa(this);
    }

    public void removeComentario(Comentario comentario) {
        this.comentarios.remove(comentario);
        comentario.setTarefa(null);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        Tarefa tarefa = (Tarefa) o;
        return id != null && id.equals(tarefa.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode(); // Ou Objects.hash(id) se id puder ser nulo antes de persistir
    }
}
