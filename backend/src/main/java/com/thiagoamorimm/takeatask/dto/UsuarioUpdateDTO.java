package com.thiagoamorimm.takeatask.dto;

import com.thiagoamorimm.takeatask.enums.PerfilUsuario;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UsuarioUpdateDTO {

    @Size(min = 3, max = 100, message = "O nome do usuário deve ter entre 3 e 100 caracteres.")
    private String nome;

    @Size(min = 3, max = 50, message = "O login do usuário deve ter entre 3 e 50 caracteres.")
    private String login;

    @Email(message = "Formato de email inválido.")
    @Size(max = 100, message = "O email deve ter no máximo 100 caracteres.")
    private String email; // Opcional

    @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres.")
    private String senha; // Opcional, apenas se for alterar

    private PerfilUsuario perfil;

    @Size(max = 100, message = "O cargo deve ter no máximo 100 caracteres.")
    private String cargo; // Opcional

    @Size(min = 10, max = 20, message = "O telefone deve ter entre 10 e 20 caracteres.")
    private String telefone; // Opcional

    @Size(max = 100, message = "O departamento deve ter no máximo 100 caracteres.")
    private String departamento; // Opcional

    private Boolean ativo;

    // Campos de Configuração Geral (opcionais na atualização)
    @Size(max = 20, message = "O tema deve ter no máximo 20 caracteres.")
    private String tema;

    @Size(max = 10, message = "O idioma deve ter no máximo 10 caracteres.")
    private String idioma;

    @Size(max = 50, message = "O fuso horário deve ter no máximo 50 caracteres.")
    private String fusoHorario;

    @Size(max = 20, message = "O formato de data deve ter no máximo 20 caracteres.")
    private String formatoData;

    @Size(max = 10, message = "O formato de hora deve ter no máximo 10 caracteres.")
    private String formatoHora;

    public UsuarioUpdateDTO(String nome, String login, String email, String senha, PerfilUsuario perfil, 
                            String cargo, String telefone, String departamento, Boolean ativo,
                            String tema, String idioma, String fusoHorario, String formatoData, String formatoHora) {
        this.nome = nome;
        this.login = login;
        this.email = email;
        this.senha = senha;
        this.perfil = perfil;
        this.cargo = cargo;
        this.telefone = telefone;
        this.departamento = departamento;
        this.ativo = ativo;
        this.tema = tema;
        this.idioma = idioma;
        this.fusoHorario = fusoHorario;
        this.formatoData = formatoData;
        this.formatoHora = formatoHora;
    }
}
