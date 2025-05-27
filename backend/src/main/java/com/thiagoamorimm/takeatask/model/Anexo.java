package com.thiagoamorimm.takeatask.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "anexos")
@Data
@NoArgsConstructor
public class Anexo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome do arquivo é obrigatório.")
    @Size(max = 255, message = "O nome do arquivo deve ter no máximo 255 caracteres.")
    @Column(nullable = false)
    private String nomeArquivo;

    @NotBlank(message = "O tipo do arquivo (MIME type) é obrigatório.")
    @Size(max = 100, message = "O tipo do arquivo deve ter no máximo 100 caracteres.")
    @Column(nullable = false, length = 100)
    private String tipoArquivo; // Ex: "image/jpeg", "application/pdf"

    @NotNull(message = "O tamanho do arquivo é obrigatório.")
    @Column(nullable = false)
    private Long tamanhoArquivo; // Em bytes

    @NotBlank(message = "O caminho ou URL do arquivo é obrigatório.")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String caminhoArquivo; // Pode ser um caminho no servidor ou uma URL para um S3 bucket, etc.

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tarefa_id", nullable = false)
    private Tarefa tarefa;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuarioUpload; // Quem fez o upload

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime dataUpload;

    public Anexo(String nomeArquivo, String tipoArquivo, Long tamanhoArquivo, String caminhoArquivo, Tarefa tarefa,
            Usuario usuarioUpload) {
        this.nomeArquivo = nomeArquivo;
        this.tipoArquivo = tipoArquivo;
        this.tamanhoArquivo = tamanhoArquivo;
        this.caminhoArquivo = caminhoArquivo;
        this.tarefa = tarefa;
        this.usuarioUpload = usuarioUpload;
    }
}
