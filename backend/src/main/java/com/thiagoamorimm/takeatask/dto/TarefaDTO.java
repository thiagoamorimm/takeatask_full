package com.thiagoamorimm.takeatask.dto;

import com.thiagoamorimm.takeatask.enums.PrioridadeTarefa;
import com.thiagoamorimm.takeatask.enums.StatusTarefa;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
public class TarefaDTO {
    private Long id;
    private String nome;
    private String descricao;
    private StatusTarefa status;
    private PrioridadeTarefa prioridade;
    private Long responsavelId;
    private String nomeResponsavel;
    private Long criadorId;
    private String nomeCriador;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;
    private LocalDateTime dataPrazo;
    private Set<TagDTO> tags;
    private List<AnexoDTO> anexos;
    private List<ComentarioDTO> comentarios;
    // Histórico de Alterações pode ser um DTO separado se necessário

    public TarefaDTO(Long id, String nome, String descricao, StatusTarefa status, PrioridadeTarefa prioridade,
            Long responsavelId, String nomeResponsavel, Long criadorId, String nomeCriador,
            LocalDateTime dataCriacao, LocalDateTime dataAtualizacao, LocalDateTime dataPrazo,
            Set<TagDTO> tags, List<AnexoDTO> anexos, List<ComentarioDTO> comentarios) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.status = status;
        this.prioridade = prioridade;
        this.responsavelId = responsavelId;
        this.nomeResponsavel = nomeResponsavel;
        this.criadorId = criadorId;
        this.nomeCriador = nomeCriador;
        this.dataCriacao = dataCriacao;
        this.dataAtualizacao = dataAtualizacao;
        this.dataPrazo = dataPrazo;
        this.tags = tags;
        this.anexos = anexos;
        this.comentarios = comentarios;
    }
}
