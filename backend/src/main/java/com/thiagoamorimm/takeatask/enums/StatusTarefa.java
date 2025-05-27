package com.thiagoamorimm.takeatask.enums;

public enum StatusTarefa {
    A_FAZER("A Fazer"),
    EM_ANDAMENTO("Em Andamento"),
    BLOQUEADA("Bloqueada"),
    EM_REVISAO("Em Revisão"),
    CONCLUIDA("Concluída");

    private final String descricao;

    StatusTarefa(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
