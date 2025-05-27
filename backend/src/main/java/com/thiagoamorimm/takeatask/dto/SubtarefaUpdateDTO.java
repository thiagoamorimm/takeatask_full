package com.thiagoamorimm.takeatask.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SubtarefaUpdateDTO {

    @Size(max = 255, message = "A descrição da subtarefa deve ter no máximo 255 caracteres.")
    private String descricao;

    private Boolean concluida;

    private Long responsavelId; // Opcional, permite reatribuir

    public SubtarefaUpdateDTO(String descricao, Boolean concluida, Long responsavelId) {
        this.descricao = descricao;
        this.concluida = concluida;
        this.responsavelId = responsavelId;
    }
}
