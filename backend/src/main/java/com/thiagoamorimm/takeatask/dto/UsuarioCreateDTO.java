package com.thiagoamorimm.takeatask.dto;

import com.thiagoamorimm.takeatask.enums.PerfilUsuario;

import jakarta.validation.constraints.Email;
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

    @NotBlank(message = "O email é obrigatório.")
    @Email(message = "Formato de email inválido.")
    @Size(max = 100, message = "O email deve ter no máximo 100 caracteres.")
    private String email;

    @NotBlank(message = "A senha é obrigatória.")
    @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres.")
    private String senha;

    @NotNull(message = "O perfil do usuário é obrigatório.")
    private PerfilUsuario perfil;

    @NotBlank(message = "O cargo é obrigatório.")
    @Size(max = 100, message = "O cargo deve ter no máximo 100 caracteres.")
    private String cargo;

    @NotBlank(message = "O telefone é obrigatório.")
    @Size(min = 10, max = 20, message = "O telefone deve ter entre 10 e 20 caracteres.")
    private String telefone;

    @NotBlank(message = "O departamento é obrigatório.")
    @Size(max = 100, message = "O departamento deve ter no máximo 100 caracteres.")
    private String departamento;

    public UsuarioCreateDTO(String nome, String login, String email, String senha, PerfilUsuario perfil, String cargo, String telefone, String departamento) {
        this.nome = nome;
        this.login = login;
        this.email = email;
        this.senha = senha;
        this.perfil = perfil;
        this.cargo = cargo;
        this.telefone = telefone;
        this.departamento = departamento;
    }
}
