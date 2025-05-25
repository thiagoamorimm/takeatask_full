package com.thiagoamorimm.takeatask.controller;

import com.thiagoamorimm.takeatask.dto.ComentarioCreateDTO;
import com.thiagoamorimm.takeatask.dto.ComentarioDTO;
import com.thiagoamorimm.takeatask.model.Usuario; // Para simular usuário autenticado
import com.thiagoamorimm.takeatask.service.ComentarioService;
import com.thiagoamorimm.takeatask.service.UsuarioService; // Para simular usuário autenticado
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
@RequestMapping("/api/tarefas/{tarefaId}/comentarios")
@Tag(name = "Comentários", description = "Endpoints para gerenciamento de comentários em tarefas")
public class ComentarioController {

    private final ComentarioService comentarioService;
    private final UsuarioService usuarioService; // Simular obtenção do usuário autenticado

    @Autowired
    public ComentarioController(ComentarioService comentarioService, UsuarioService usuarioService) {
        this.comentarioService = comentarioService;
        this.usuarioService = usuarioService;
    }

    // Método simulado para obter o usuário autenticado
    private Usuario getUsuarioAutenticadoSimulado() {
        try {
            return usuarioService.findUsuarioEntityById(1L);
        } catch (Exception e) {
            System.err.println("AVISO: Usuário simulado com ID 1 não encontrado para ComentarioController.");
            return null;
        }
    }

    @Operation(summary = "Adiciona um novo comentário a uma tarefa")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Comentário adicionado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Requisição inválida"),
            @ApiResponse(responseCode = "404", description = "Tarefa não encontrada ou sem permissão para comentar")
    })
    @PostMapping
    public ResponseEntity<ComentarioDTO> adicionarComentario(@PathVariable Long tarefaId,
            @Valid @RequestBody ComentarioCreateDTO comentarioCreateDTO) {
        Usuario usuarioAutenticado = getUsuarioAutenticadoSimulado();
        if (usuarioAutenticado == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        ComentarioDTO novoComentario = comentarioService.adicionarComentario(tarefaId, comentarioCreateDTO,
                usuarioAutenticado);
        return new ResponseEntity<>(novoComentario, HttpStatus.CREATED);
    }

    @Operation(summary = "Busca um comentário pelo seu ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Comentário encontrado"),
            @ApiResponse(responseCode = "404", description = "Comentário não encontrado ou sem permissão")
    })
    @GetMapping("/{comentarioId}")
    public ResponseEntity<ComentarioDTO> buscarComentarioPorId(@PathVariable Long tarefaId,
            @PathVariable Long comentarioId) {
        Usuario usuarioAutenticado = getUsuarioAutenticadoSimulado();
        if (usuarioAutenticado == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        ComentarioDTO comentarioDTO = comentarioService.buscarComentarioPorId(comentarioId, usuarioAutenticado);
        // Verificar se o comentário pertence à tarefaId do path
        if (!comentarioDTO.getTarefaId().equals(tarefaId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(comentarioDTO);
    }

    @Operation(summary = "Lista todos os comentários de uma tarefa específica")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de comentários retornada"),
            @ApiResponse(responseCode = "404", description = "Tarefa não encontrada ou sem permissão")
    })
    @GetMapping
    public ResponseEntity<List<ComentarioDTO>> listarComentariosPorTarefaId(@PathVariable Long tarefaId) {
        Usuario usuarioAutenticado = getUsuarioAutenticadoSimulado();
        if (usuarioAutenticado == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        List<ComentarioDTO> comentarios = comentarioService.listarComentariosPorTarefaId(tarefaId, usuarioAutenticado);
        return ResponseEntity.ok(comentarios);
    }

    @Operation(summary = "Deleta um comentário")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Comentário deletado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Comentário não encontrado ou sem permissão para deletar")
    })
    @DeleteMapping("/{comentarioId}")
    public ResponseEntity<Void> deletarComentario(@PathVariable Long tarefaId, @PathVariable Long comentarioId) {
        Usuario usuarioAutenticado = getUsuarioAutenticadoSimulado();
        if (usuarioAutenticado == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        // Verificar se o comentário pertence à tarefaId antes de tentar deletar
        ComentarioDTO comentarioParaDeletar = comentarioService.buscarComentarioPorId(comentarioId, usuarioAutenticado);
        if (!comentarioParaDeletar.getTarefaId().equals(tarefaId)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        comentarioService.deletarComentario(comentarioId, usuarioAutenticado);
        return ResponseEntity.noContent().build();
    }
}
