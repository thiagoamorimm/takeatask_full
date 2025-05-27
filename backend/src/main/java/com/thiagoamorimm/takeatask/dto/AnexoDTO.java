package com.thiagoamorimm.takeatask.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class AnexoDTO {
    private Long id;
    private String nomeArquivo;
    private String tipoArquivo;
    private Long tamanhoArquivo;
    private String caminhoArquivo; // Ou URL para download
    private Long tarefaId;
    private Long usuarioUploadId;
    private String nomeUsuarioUpload;
    private LocalDateTime dataUpload;

    public AnexoDTO(Long id, String nomeArquivo, String tipoArquivo, Long tamanhoArquivo, String caminhoArquivo,
            Long tarefaId, Long usuarioUploadId, String nomeUsuarioUpload, LocalDateTime dataUpload) {
        this.id = id;
        this.nomeArquivo = nomeArquivo;
        this.tipoArquivo = tipoArquivo;
        this.tamanhoArquivo = tamanhoArquivo;
        this.caminhoArquivo = caminhoArquivo;
        this.tarefaId = tarefaId;
        this.usuarioUploadId = usuarioUploadId;
        this.nomeUsuarioUpload = nomeUsuarioUpload;
        this.dataUpload = dataUpload;
    }
}
