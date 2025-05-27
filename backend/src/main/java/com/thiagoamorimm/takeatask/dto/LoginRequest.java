package com.thiagoamorimm.takeatask.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String login;
    private String senha;

    public LoginRequest() {}

    public LoginRequest(String login, String senha) {
        this.login = login;
        this.senha = senha;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }
}