package com.thiagoamorimm.takeatask.dto;

import com.thiagoamorimm.takeatask.enums.PrioridadeTarefa;
import com.thiagoamorimm.takeatask.enums.StatusTarefa;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
public class TarefaCreateDTO {

    @NotBlank(message = "O nome da tarefa é obrigatório.")
    @Size(min = 3, max = 150, message = "O nome da tarefa deve ter entre 3 e 150 caracteres.")
    private String nome;

    private String descricao;

    @NotNull(message = "O status da tarefa é obrigatório.")
    private StatusTarefa status;

    @NotNull(message = "A prioridade da tarefa é obrigatória.")
    private PrioridadeTarefa prioridade;

    private Long responsavelId; // Pode ser nulo se o criador atribuir a si mesmo ou deixar sem responsável
                                // inicial

    // criadorId será pego do usuário autenticado
    private LocalDateTime dataPrazo;

    private Set<String> tags; // Nomes das tags para criar ou associar

    // Subtarefas podem ser adicionadas depois ou através de um endpoint específico
    // Anexos e Comentários também

    public TarefaCreateDTO(String nome, String descricao, StatusTarefa status, PrioridadeTarefa prioridade,
            Long responsavelId, LocalDateTime dataPrazo, Set<String> tags) {
        this.nome = nome;
        this.descricao = descricao;
        this.status = status;
        this.prioridade = prioridade;
        this.responsavelId = responsavelId;
        this.dataPrazo = dataPrazo;
        this.tags = tags;
    }
}
