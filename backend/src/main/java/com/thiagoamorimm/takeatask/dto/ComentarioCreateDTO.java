package com.thiagoamorimm.takeatask.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ComentarioCreateDTO {

    @NotBlank(message = "O texto do comentário é obrigatório.")
    private String texto;

    private Long tarefaId; // Optional, as it's already in the path parameter

    // O autorId será obtido do usuário autenticado no sistema, não enviado no DTO.

    public ComentarioCreateDTO(String texto) {
        this.texto = texto;
    }

    public ComentarioCreateDTO(String texto, Long tarefaId) {
        this.texto = texto;
        this.tarefaId = tarefaId;
    }
}
