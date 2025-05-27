package com.thiagoamorimm.takeatask.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TagCreateDTO {

    @NotBlank(message = "O nome da tag é obrigatório.")
    @Size(min = 2, max = 50, message = "O nome da tag deve ter entre 2 e 50 caracteres.")
    private String nome;

    @Size(max = 7, message = "A cor da tag deve estar no formato hexadecimal (ex: #RRGGBB).") // Ex: #RRGGBB
    private String cor;

    @Size(max = 255, message = "A descrição da tag deve ter no máximo 255 caracteres.")
    private String descricao; // Opcional

    public TagCreateDTO(String nome, String cor, String descricao) {
        this.nome = nome;
        this.cor = cor;
        this.descricao = descricao;
    }
}
