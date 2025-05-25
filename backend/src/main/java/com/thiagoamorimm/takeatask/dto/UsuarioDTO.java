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
    private PerfilUsuario perfil;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;
    private boolean ativo;

    // Campos de Configuração Geral
    private String tema;
    private String idioma;
    private String fusoHorario;
    private String formatoData;
    private String formatoHora;

    public UsuarioDTO(Long id, String nome, String login, PerfilUsuario perfil, LocalDateTime dataCriacao,
            LocalDateTime dataAtualizacao, boolean ativo, String tema, String idioma, String fusoHorario,
            String formatoData, String formatoHora) {
        this.id = id;
        this.nome = nome;
        this.login = login;
        this.perfil = perfil;
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
