package com.thiagoamorimm.takeatask.dto;

import com.thiagoamorimm.takeatask.enums.PerfilUsuario;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UsuarioCreateDTO {

    @NotBlank(message = "O nome do usuário é obrigatório.")
    @Size(min = 3, max = 100, message = "O nome do usuário deve ter entre 3 e 100 caracteres.")
    private String nome;

    @NotBlank(message = "O login do usuário é obrigatório.")
    @Size(min = 3, max = 50, message = "O login do usuário deve ter entre 3 e 50 caracteres.")
    private String login;

    @NotBlank(message = "A senha é obrigatória.")
    @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres.")
    private String senha;

    @NotNull(message = "O perfil do usuário é obrigatório.")
    private PerfilUsuario perfil;

    public UsuarioCreateDTO(String nome, String login, String senha, PerfilUsuario perfil) {
        this.nome = nome;
        this.login = login;
        this.senha = senha;
        this.perfil = perfil;
    }
}
