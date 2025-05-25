package com.thiagoamorimm.takeatask.dto;

public class TarefaStatsDTO {
    private long totalTarefas;
    private long tarefasConcluidas;
    private long tarefasEmAndamento;
    private long tarefasAtrasadas;

    // Construtor padrão (necessário para algumas bibliotecas de
    // serialização/deserialização)
    public TarefaStatsDTO() {
    }

    public TarefaStatsDTO(long totalTarefas, long tarefasConcluidas, long tarefasEmAndamento, long tarefasAtrasadas) {
        this.totalTarefas = totalTarefas;
        this.tarefasConcluidas = tarefasConcluidas;
        this.tarefasEmAndamento = tarefasEmAndamento;
        this.tarefasAtrasadas = tarefasAtrasadas;
    }

    // Getters e Setters
    public long getTotalTarefas() {
        return totalTarefas;
    }

    public void setTotalTarefas(long totalTarefas) {
        this.totalTarefas = totalTarefas;
    }

    public long getTarefasConcluidas() {
        return tarefasConcluidas;
    }

    public void setTarefasConcluidas(long tarefasConcluidas) {
        this.tarefasConcluidas = tarefasConcluidas;
    }

    public long getTarefasEmAndamento() {
        return tarefasEmAndamento;
    }

    public void setTarefasEmAndamento(long tarefasEmAndamento) {
        this.tarefasEmAndamento = tarefasEmAndamento;
    }

    public long getTarefasAtrasadas() {
        return tarefasAtrasadas;
    }

    public void setTarefasAtrasadas(long tarefasAtrasadas) {
        this.tarefasAtrasadas = tarefasAtrasadas;
    }
}
