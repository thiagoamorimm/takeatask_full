package com.thiagoamorimm.takeatask.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class SubtarefaDTO {
    private Long id;
    private String descricao;
    private boolean concluida;
    private Long tarefaPrincipalId; // Apenas o ID da tarefa principal
    private Long responsavelId; // Apenas o ID do responsável (opcional)
    private String nomeResponsavel; // Nome do responsável para exibição (opcional)
    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;

    public SubtarefaDTO(Long id, String descricao, boolean concluida, Long tarefaPrincipalId, Long responsavelId,
            String nomeResponsavel, LocalDateTime dataCriacao, LocalDateTime dataAtualizacao) {
        this.id = id;
        this.descricao = descricao;
        this.concluida = concluida;
        this.tarefaPrincipalId = tarefaPrincipalId;
        this.responsavelId = responsavelId;
        this.nomeResponsavel = nomeResponsavel;
        this.dataCriacao = dataCriacao;
        this.dataAtualizacao = dataAtualizacao;
    }
}
