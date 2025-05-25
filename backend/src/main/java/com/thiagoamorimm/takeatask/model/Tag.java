package com.thiagoamorimm.takeatask.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "tags")
@Data
@NoArgsConstructor
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome da tag é obrigatório.")
    @Size(min = 2, max = 50, message = "O nome da tag deve ter entre 2 e 50 caracteres.")
    @Column(nullable = false, unique = true, length = 50)
    private String nome;

    @Column(length = 7) // Para cores hexadecimais como #RRGGBB
    private String cor;

    @Column(length = 255)
    private String descricao;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime dataCriacao;

    @ManyToMany(mappedBy = "tags")
    private Set<Tarefa> tarefas = new HashSet<>();

    public Tag(String nome) {
        this.nome = nome;
    }

    public Tag(String nome, String cor, String descricao) {
        this.nome = nome;
        this.cor = cor;
        this.descricao = descricao;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        Tag tag = (Tag) o;
        return id != null && id.equals(tag.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode(); // Ou Objects.hash(id) se id puder ser nulo antes de persistir
    }
}
