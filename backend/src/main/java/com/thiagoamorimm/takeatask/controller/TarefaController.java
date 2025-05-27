package com.thiagoamorimm.takeatask.controller;

import com.thiagoamorimm.takeatask.dto.TarefaCreateDTO;
import com.thiagoamorimm.takeatask.dto.TarefaDTO;
import com.thiagoamorimm.takeatask.dto.TarefaUpdateDTO;
import com.thiagoamorimm.takeatask.enums.PrioridadeTarefa;
import com.thiagoamorimm.takeatask.enums.StatusTarefa;
import com.thiagoamorimm.takeatask.model.Usuario;
import com.thiagoamorimm.takeatask.service.TarefaService;
import com.thiagoamorimm.takeatask.service.UsuarioService; // Para buscar o usuário "autenticado"
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import com.thiagoamorimm.takeatask.dto.TarefaStatsDTO; // Adicionado

@RestController
@RequestMapping("/api/tarefas")
@Tag(name = "Tarefas", description = "Endpoints para gerenciamento de tarefas")
public class TarefaController {

    private final TarefaService tarefaService;
    private final UsuarioService usuarioService; // Simular obtenção do usuário autenticado

    @Autowired
    public TarefaController(TarefaService tarefaService, UsuarioService usuarioService) {
        this.tarefaService = tarefaService;
        this.usuarioService = usuarioService;
    }

    // Método simulado para obter o usuário autenticado
    private Usuario getUsuarioAutenticadoSimulado() {
        // Em um cenário real, isso viria do Spring Security (ex: @AuthenticationPrincipal)
        try {
            // Tenta primeiro o usuário com ID 1
            try {
                return usuarioService.findUsuarioEntityById(1L);
            } catch (Exception e) {
                // Se não encontrar o usuário 1, tenta o ID 2
                try {
                    return usuarioService.findUsuarioEntityById(2L);
                } catch (Exception e2) {
                    // Se ainda não encontrar, busca qualquer usuário disponível
                    // listarTodosUsuarios retorna DTO, não entidades
                    var usuariosDTO = usuarioService.listarTodosUsuarios(null);
                    if (usuariosDTO != null && !usuariosDTO.isEmpty()) {
                        System.out.println("Usando o usuário disponível: " + usuariosDTO.get(0).getLogin());
                        return usuarioService.findUsuarioEntityById(usuariosDTO.get(0).getId());
                    }
                }
            }
            
            System.err.println("ERRO: Nenhum usuário encontrado no sistema. Por favor, crie ao menos um usuário.");
            return null; // Não encontrou nenhum usuário
        } catch (Exception e) {
            System.err.println("ERRO ao buscar usuário simulado: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    @Operation(summary = "Cria uma nova tarefa")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Tarefa criada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Requisição inválida")
    })
    @PostMapping
    public ResponseEntity<TarefaDTO> criarTarefa(@Valid @RequestBody TarefaCreateDTO tarefaCreateDTO) {
        Usuario usuarioAutenticado = getUsuarioAutenticadoSimulado();
        if (usuarioAutenticado == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // Exemplo

        TarefaDTO novaTarefa = tarefaService.criarTarefa(tarefaCreateDTO, usuarioAutenticado);
        return new ResponseEntity<>(novaTarefa, HttpStatus.CREATED);
    }

    @Operation(summary = "Obtém estatísticas das tarefas")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Estatísticas obtidas com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autorizado")
    })
    @GetMapping("/stats")
    public ResponseEntity<TarefaStatsDTO> getTarefaStats() {
        Usuario usuarioAutenticado = getUsuarioAutenticadoSimulado();
        if (usuarioAutenticado == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        TarefaStatsDTO stats = tarefaService.getTarefaStats(usuarioAutenticado);
        return ResponseEntity.ok(stats);
    }

    @Operation(summary = "Busca uma tarefa pelo ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tarefa encontrada"),
            @ApiResponse(responseCode = "404", description = "Tarefa não encontrada ou sem permissão")
    })
    @GetMapping("/{id}")
    public ResponseEntity<TarefaDTO> buscarTarefaPorId(@PathVariable Long id) {
        Usuario usuarioAutenticado = getUsuarioAutenticadoSimulado();
        if (usuarioAutenticado == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        TarefaDTO tarefaDTO = tarefaService.buscarTarefaPorId(id, usuarioAutenticado);
        return ResponseEntity.ok(tarefaDTO);
    }

    @Operation(summary = "Lista tarefas com filtros e pesquisa por palavra-chave")
    @GetMapping
    public ResponseEntity<List<TarefaDTO>> listarTarefas(
            @Parameter(description = "Filtrar por status da tarefa") @RequestParam(required = false) StatusTarefa status,
            @Parameter(description = "Filtrar por prioridade da tarefa") @RequestParam(required = false) PrioridadeTarefa prioridade,
            @Parameter(description = "Filtrar pelo ID do responsável") @RequestParam(required = false) Long responsavelId,
            @Parameter(description = "Data de início para filtro de prazo (formato YYYY-MM-DDTHH:mm:ss)") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataPrazoInicio,
            @Parameter(description = "Data de fim para filtro de prazo (formato YYYY-MM-DDTHH:mm:ss)") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataPrazoFim,
            @Parameter(description = "Filtrar por IDs de tags (separados por vírgula)") @RequestParam(required = false) Set<Long> tagIds,
            @Parameter(description = "Palavra-chave para busca no nome ou descrição") @RequestParam(required = false) String q,
            @Parameter(description = "Tipo de filtro de tarefas (minhas, equipe, todas)") @RequestParam(required = false, defaultValue = "todas") String tipo) {

        Usuario usuarioAutenticado = getUsuarioAutenticadoSimulado();
        if (usuarioAutenticado == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // A lógica de filtragem por 'tipo' e 'q' (keyword) será movida para o
        // TarefaService
        List<TarefaDTO> tarefas = tarefaService.listarTarefasFiltradas(
                usuarioAutenticado, status, prioridade, responsavelId,
                dataPrazoInicio, dataPrazoFim, tagIds, q, tipo);
        return ResponseEntity.ok(tarefas);
    }

    // O endpoint /pesquisar pode ser removido se a funcionalidade for totalmente
    // incorporada em /api/tarefas
    // Por enquanto, vou mantê-lo, mas a ideia é centralizar no GET /api/tarefas
    @Operation(summary = "Pesquisa tarefas por palavra-chave (alternativo)")
    @GetMapping("/pesquisar")
    public ResponseEntity<List<TarefaDTO>> pesquisarTarefas(@RequestParam String keyword) {
        Usuario usuarioAutenticado = getUsuarioAutenticadoSimulado();
        if (usuarioAutenticado == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        List<TarefaDTO> tarefas = tarefaService.pesquisarTarefas(keyword, usuarioAutenticado);
        return ResponseEntity.ok(tarefas);
    }

    @Operation(summary = "Atualiza uma tarefa existente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tarefa atualizada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Requisição inválida"),
            @ApiResponse(responseCode = "404", description = "Tarefa não encontrada ou sem permissão")
    })
    @PutMapping("/{id}")
    public ResponseEntity<TarefaDTO> atualizarTarefa(@PathVariable Long id,
            @Valid @RequestBody TarefaUpdateDTO tarefaUpdateDTO) {
        Usuario usuarioAutenticado = getUsuarioAutenticadoSimulado();
        if (usuarioAutenticado == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        TarefaDTO tarefaAtualizada = tarefaService.atualizarTarefa(id, tarefaUpdateDTO, usuarioAutenticado);
        return ResponseEntity.ok(tarefaAtualizada);
    }

    @Operation(summary = "Deleta uma tarefa")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Tarefa deletada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Tarefa não encontrada ou sem permissão")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarTarefa(@PathVariable Long id) {
        Usuario usuarioAutenticado = getUsuarioAutenticadoSimulado();
        if (usuarioAutenticado == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        tarefaService.deletarTarefa(id, usuarioAutenticado);
        return ResponseEntity.noContent().build();
    }
}
