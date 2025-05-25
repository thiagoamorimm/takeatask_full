package com.thiagoamorimm.takeatask.service;

import com.thiagoamorimm.takeatask.dto.UsuarioCreateDTO;
import com.thiagoamorimm.takeatask.dto.UsuarioDTO;
import com.thiagoamorimm.takeatask.dto.UsuarioUpdateDTO;
import com.thiagoamorimm.takeatask.model.Usuario;

import java.util.List;

public interface UsuarioService {
    UsuarioDTO criarUsuario(UsuarioCreateDTO usuarioCreateDTO);

    UsuarioDTO buscarUsuarioPorId(Long id);

    UsuarioDTO buscarUsuarioPorLogin(String login);

    List<UsuarioDTO> listarTodosUsuarios(String query); // Modificado para aceitar query

    UsuarioDTO atualizarUsuario(Long id, UsuarioUpdateDTO usuarioUpdateDTO);

    void deletarUsuario(Long id); // Ou desativar

    Usuario findUsuarioEntityById(Long id); // Método auxiliar para outros serviços
}
