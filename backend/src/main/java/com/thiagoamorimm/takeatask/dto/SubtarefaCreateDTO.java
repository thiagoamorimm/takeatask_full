package com.thiagoamorimm.takeatask.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SubtarefaCreateDTO {

    @NotBlank(message = "A descrição da subtarefa é obrigatória.")
    @Size(max = 255, message = "A descrição da subtarefa deve ter no máximo 255 caracteres.")
    private String descricao;

    @NotNull(message = "O ID da tarefa principal é obrigatório.")
    private Long tarefaPrincipalId;

    private Long responsavelId; // Opcional

    public SubtarefaCreateDTO(String descricao, Long tarefaPrincipalId, Long responsavelId) {
        this.descricao = descricao;
        this.tarefaPrincipalId = tarefaPrincipalId;
        this.responsavelId = responsavelId;
    }
}
