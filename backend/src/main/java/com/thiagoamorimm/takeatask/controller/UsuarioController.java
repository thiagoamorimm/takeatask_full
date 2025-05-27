package com.thiagoamorimm.takeatask.controller;

import com.thiagoamorimm.takeatask.dto.UsuarioCreateDTO;
import com.thiagoamorimm.takeatask.dto.UsuarioDTO;
import com.thiagoamorimm.takeatask.dto.UsuarioUpdateDTO;
import com.thiagoamorimm.takeatask.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@Tag(name = "Usuários", description = "Endpoints para gerenciamento de usuários")
public class UsuarioController {

    private final UsuarioService usuarioService;

    @Autowired
    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @Operation(summary = "Cria um novo usuário")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Usuário criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Requisição inválida"),
            @ApiResponse(responseCode = "409", description = "Conflito, login já existe")
    })
    @PostMapping
    public ResponseEntity<UsuarioDTO> criarUsuario(@Valid @RequestBody UsuarioCreateDTO usuarioCreateDTO) {
        UsuarioDTO novoUsuario = usuarioService.criarUsuario(usuarioCreateDTO);
        return new ResponseEntity<>(novoUsuario, HttpStatus.CREATED);
    }

    @Operation(summary = "Busca um usuário pelo ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuário encontrado"),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> buscarUsuarioPorId(@PathVariable Long id) {
        // Aqui, em um cenário real, verificaríamos se o usuário autenticado tem
        // permissão
        // para ver este usuário (ex: se é admin ou o próprio usuário)
        UsuarioDTO usuarioDTO = usuarioService.buscarUsuarioPorId(id);
        return ResponseEntity.ok(usuarioDTO);
    }

    @Operation(summary = "Busca um usuário pelo login")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuário encontrado"),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado")
    })
    @GetMapping("/login/{login}")
    public ResponseEntity<UsuarioDTO> buscarUsuarioPorLogin(@PathVariable String login) {
        // Geralmente restrito a administradores
        UsuarioDTO usuarioDTO = usuarioService.buscarUsuarioPorLogin(login);
        return ResponseEntity.ok(usuarioDTO);
    }

    @Operation(summary = "Lista todos os usuários")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de usuários retornada")
    })
    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> listarTodosUsuarios(
            @RequestParam(required = false) String q) {
        // Geralmente restrito a administradores
        List<UsuarioDTO> usuarios = usuarioService.listarTodosUsuarios(q); // Passar o parâmetro de busca
        return ResponseEntity.ok(usuarios);
    }

    @Operation(summary = "Atualiza um usuário existente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuário atualizado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Requisição inválida"),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado"),
            @ApiResponse(responseCode = "409", description = "Conflito, novo login já existe")
    })
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDTO> atualizarUsuario(@PathVariable Long id,
            @Valid @RequestBody UsuarioUpdateDTO usuarioUpdateDTO) {
        // Verificar permissão (admin ou próprio usuário)
        UsuarioDTO usuarioAtualizado = usuarioService.atualizarUsuario(id, usuarioUpdateDTO);
        return ResponseEntity.ok(usuarioAtualizado);
    }

    @Operation(summary = "Deleta (ou desativa) um usuário")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Usuário deletado/desativado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarUsuario(@PathVariable Long id) {
        // Verificar permissão (admin)
        usuarioService.deletarUsuario(id);
        return ResponseEntity.noContent().build();
    }
}
