package com.thiagoamorimm.takeatask.controller;

import com.thiagoamorimm.takeatask.dto.SubtarefaCreateDTO;
import com.thiagoamorimm.takeatask.dto.SubtarefaDTO;
import com.thiagoamorimm.takeatask.dto.SubtarefaUpdateDTO;
import com.thiagoamorimm.takeatask.service.SubtarefaService;
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
@RequestMapping("/api/tarefas/{tarefaId}/subtarefas") // Aninhado sob tarefas
@Tag(name = "Subtarefas", description = "Endpoints para gerenciamento de subtarefas de uma tarefa específica")
public class SubtarefaController {

    private final SubtarefaService subtarefaService;

    @Autowired
    public SubtarefaController(SubtarefaService subtarefaService, UsuarioService usuarioService) {
        this.subtarefaService = subtarefaService;
    }

    @Operation(summary = "Cria uma nova subtarefa para uma tarefa específica")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Subtarefa criada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Requisição inválida"),
            @ApiResponse(responseCode = "404", description = "Tarefa principal não encontrada ou sem permissão")
    })
    @PostMapping
    public ResponseEntity<SubtarefaDTO> criarSubtarefa(@PathVariable Long tarefaId,
            @Valid @RequestBody SubtarefaCreateDTO subtarefaCreateDTO) {
        // A lógica de permissão para criar subtarefa está em
        // TarefaService/SubtarefaService
        // (ex: só pode adicionar subtarefa se tiver acesso à tarefa principal)
        // O usuário autenticado será pego no service, se necessário para definir
        // responsável padrão.
        // Aqui, o `tarefaId` já define o contexto.
        SubtarefaDTO novaSubtarefa = subtarefaService.criarSubtarefa(subtarefaCreateDTO, tarefaId);
        return new ResponseEntity<>(novaSubtarefa, HttpStatus.CREATED);
    }

    @Operation(summary = "Busca uma subtarefa pelo seu ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Subtarefa encontrada"),
            @ApiResponse(responseCode = "404", description = "Subtarefa não encontrada ou sem permissão de acesso à tarefa pai")
    })
    @GetMapping("/{subtarefaId}")
    public ResponseEntity<SubtarefaDTO> buscarSubtarefaPorId(@PathVariable Long tarefaId,
            @PathVariable Long subtarefaId) {
        // A verificação de permissão da tarefa pai é feita no service
        SubtarefaDTO subtarefaDTO = subtarefaService.buscarSubtarefaPorId(subtarefaId);
        // Adicionalmente, verificar se a subtarefa pertence à tarefaId do path
        if (!subtarefaDTO.getTarefaPrincipalId().equals(tarefaId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // Ou bad request
        }
        return ResponseEntity.ok(subtarefaDTO);
    }

    @Operation(summary = "Lista todas as subtarefas de uma tarefa específica")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de subtarefas retornada"),
            @ApiResponse(responseCode = "404", description = "Tarefa principal não encontrada ou sem permissão")
    })
    @GetMapping
    public ResponseEntity<List<SubtarefaDTO>> listarSubtarefasPorTarefaId(@PathVariable Long tarefaId) {
        // A verificação de permissão da tarefa pai é feita no service
        List<SubtarefaDTO> subtarefas = subtarefaService.listarSubtarefasPorTarefaId(tarefaId);
        return ResponseEntity.ok(subtarefas);
    }

    @Operation(summary = "Atualiza uma subtarefa existente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Subtarefa atualizada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Requisição inválida"),
            @ApiResponse(responseCode = "404", description = "Subtarefa não encontrada ou sem permissão")
    })
    @PutMapping("/{subtarefaId}")
    public ResponseEntity<SubtarefaDTO> atualizarSubtarefa(@PathVariable Long tarefaId,
            @PathVariable Long subtarefaId,
            @Valid @RequestBody SubtarefaUpdateDTO subtarefaUpdateDTO) {
        // Validações de permissão e se subtarefa pertence à tarefaId são feitas no
        // service
        SubtarefaDTO subtarefaAtualizada = subtarefaService.atualizarSubtarefa(subtarefaId, subtarefaUpdateDTO);
        if (!subtarefaAtualizada.getTarefaPrincipalId().equals(tarefaId)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build(); // Subtarefa não pertence a esta tarefa
        }
        return ResponseEntity.ok(subtarefaAtualizada);
    }

    @Operation(summary = "Deleta uma subtarefa")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Subtarefa deletada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Subtarefa não encontrada ou sem permissão")
    })
    @DeleteMapping("/{subtarefaId}")
    public ResponseEntity<Void> deletarSubtarefa(@PathVariable Long tarefaId, @PathVariable Long subtarefaId) {
        // Validações de permissão e se subtarefa pertence à tarefaId são feitas no
        // service
        // Primeiro, buscar a subtarefa para garantir que pertence à tarefaId antes de
        // deletar
        SubtarefaDTO subtarefaDTO = subtarefaService.buscarSubtarefaPorId(subtarefaId);
        if (!subtarefaDTO.getTarefaPrincipalId().equals(tarefaId)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        subtarefaService.deletarSubtarefa(subtarefaId);
        return ResponseEntity.noContent().build();
    }
}
