package com.thiagoamorimm.takeatask.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class ComentarioDTO {
    private Long id;
    private String texto;
    private Long tarefaId;
    private Long autorId;
    private String nomeAutor;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;

    public ComentarioDTO(Long id, String texto, Long tarefaId, Long autorId, String nomeAutor,
            LocalDateTime dataCriacao, LocalDateTime dataAtualizacao) {
        this.id = id;
        this.texto = texto;
        this.tarefaId = tarefaId;
        this.autorId = autorId;
        this.nomeAutor = nomeAutor;
        this.dataCriacao = dataCriacao;
        this.dataAtualizacao = dataAtualizacao;
    }
}
