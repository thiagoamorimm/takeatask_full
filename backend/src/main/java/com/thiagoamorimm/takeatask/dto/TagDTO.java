package com.thiagoamorimm.takeatask.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class TagDTO {
    private Long id;
    private String nome;
    private LocalDateTime dataCriacao;
    private String cor;
    private String descricao;

    public TagDTO(Long id, String nome, LocalDateTime dataCriacao, String cor, String descricao) {
        this.id = id;
        this.nome = nome;
        this.dataCriacao = dataCriacao;
        this.cor = cor;
        this.descricao = descricao;
    }
}
