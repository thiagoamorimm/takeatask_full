package com.thiagoamorimm.takeatask.dto;

import com.thiagoamorimm.takeatask.enums.PerfilUsuario;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class UsuarioDTO {
    private Long id;
    private String nome;
    private String login;
    private String email; 
    private PerfilUsuario perfil;
    private String cargo; 
    private String telefone; 
    private String departamento; 
    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;
    private boolean ativo;

    // Campos de Configuração Geral
    private String tema;
    private String idioma;
    private String fusoHorario;
    private String formatoData;
    private String formatoHora;

    public UsuarioDTO(Long id, String nome, String login, String email, PerfilUsuario perfil, String cargo, String telefone, String departamento,
                      LocalDateTime dataCriacao, LocalDateTime dataAtualizacao, boolean ativo, String tema,
                      String idioma, String fusoHorario, String formatoData, String formatoHora) {
        this.id = id;
        this.nome = nome;
        this.login = login;
        this.email = email;
        this.perfil = perfil;
        this.cargo = cargo;
        this.telefone = telefone;
        this.departamento = departamento;
        this.dataCriacao = dataCriacao;
        this.dataAtualizacao = dataAtualizacao;
        this.ativo = ativo;
        this.tema = tema;
        this.idioma = idioma;
        this.fusoHorario = fusoHorario;
        this.formatoData = formatoData;
        this.formatoHora = formatoHora;
    }
}
