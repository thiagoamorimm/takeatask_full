package com.thiagoamorimm.takeatask.dto;

import com.thiagoamorimm.takeatask.enums.PrioridadeTarefa;
import com.thiagoamorimm.takeatask.enums.StatusTarefa;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
public class TarefaUpdateDTO {

    @Size(min = 3, max = 150, message = "O nome da tarefa deve ter entre 3 e 150 caracteres.")
    private String nome;

    private String descricao;

    private StatusTarefa status;

    private PrioridadeTarefa prioridade;

    private Long responsavelId;

    private LocalDateTime dataPrazo;

    private Set<String> tags; // Nomes das tags para atualizar (pode adicionar/remover)

    public TarefaUpdateDTO(String nome, String descricao, StatusTarefa status, PrioridadeTarefa prioridade,
            Long responsavelId, LocalDateTime dataPrazo, Set<String> tags) {
        this.nome = nome;
        this.descricao = descricao;
        this.status = status;
        this.prioridade = prioridade;
        this.responsavelId = responsavelId;
        this.dataPrazo = dataPrazo;
        this.tags = tags;
    }
}
