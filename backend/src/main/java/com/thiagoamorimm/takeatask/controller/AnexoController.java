package com.thiagoamorimm.takeatask.controller;

import com.thiagoamorimm.takeatask.dto.AnexoDTO;
import com.thiagoamorimm.takeatask.exception.ResourceNotFoundException;
import com.thiagoamorimm.takeatask.model.Usuario; // Para simular usuário autenticado
import com.thiagoamorimm.takeatask.service.AnexoService;
import com.thiagoamorimm.takeatask.service.UsuarioService; // Para simular usuário autenticado
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/tarefas/{tarefaId}/anexos")
@Tag(name = "Anexos", description = "Endpoints para gerenciamento de anexos de tarefas")
public class AnexoController {

    private final AnexoService anexoService;
    private final UsuarioService usuarioService; // Simular obtenção do usuário autenticado

    @Autowired
    public AnexoController(AnexoService anexoService, UsuarioService usuarioService) {
        this.anexoService = anexoService;
        this.usuarioService = usuarioService;
    }

    // Método simulado para obter o usuário autenticado
    private Usuario getUsuarioAutenticadoSimulado() {
        try {
            return usuarioService.findUsuarioEntityById(1L);
        } catch (Exception e) {
            System.err.println("AVISO: Usuário simulado com ID 1 não encontrado para AnexoController.");
            return null;
        }
    }

    @Operation(summary = "Faz upload de um novo anexo para uma tarefa")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Anexo enviado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Requisição inválida ou arquivo inválido"),
            @ApiResponse(responseCode = "404", description = "Tarefa não encontrada ou sem permissão")
    })
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AnexoDTO> uploadAnexo(@PathVariable Long tarefaId,
            @Parameter(description = "Arquivo a ser enviado", required = true, content = @Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE)) @RequestPart("arquivo") MultipartFile arquivo) {
        Usuario usuarioAutenticado = getUsuarioAutenticadoSimulado();
        if (usuarioAutenticado == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        if (arquivo.isEmpty()) {
            return ResponseEntity.badRequest().build(); // Ou lançar BadRequestException
        }
        try {
            AnexoDTO anexoDTO = anexoService.salvarAnexo(arquivo, tarefaId, usuarioAutenticado);
            return new ResponseEntity<>(anexoDTO, HttpStatus.CREATED);
        } catch (IOException e) {
            // Logar o erro
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Busca um anexo pelo seu ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Anexo encontrado"),
            @ApiResponse(responseCode = "404", description = "Anexo não encontrado ou sem permissão")
    })
    @GetMapping("/{anexoId}")
    public ResponseEntity<AnexoDTO> buscarAnexoPorId(@PathVariable Long tarefaId, @PathVariable Long anexoId) {
        Usuario usuarioAutenticado = getUsuarioAutenticadoSimulado();
        if (usuarioAutenticado == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        AnexoDTO anexoDTO = anexoService.buscarAnexoPorId(anexoId, usuarioAutenticado);
        // Verificar se o anexo pertence à tarefaId do path
        if (!anexoDTO.getTarefaId().equals(tarefaId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(anexoDTO);
    }

    @Operation(summary = "Lista todos os anexos de uma tarefa específica")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de anexos retornada"),
            @ApiResponse(responseCode = "404", description = "Tarefa não encontrada ou sem permissão")
    })
    @GetMapping
    public ResponseEntity<List<AnexoDTO>> listarAnexosPorTarefaId(@PathVariable Long tarefaId) {
        Usuario usuarioAutenticado = getUsuarioAutenticadoSimulado();
        if (usuarioAutenticado == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        List<AnexoDTO> anexos = anexoService.listarAnexosPorTarefaId(tarefaId, usuarioAutenticado);
        return ResponseEntity.ok(anexos);
    }

    @Operation(summary = "Deleta um anexo")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Anexo deletado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Anexo não encontrado ou sem permissão")
    })
    @DeleteMapping("/{anexoId}")
    public ResponseEntity<Void> deletarAnexo(@PathVariable Long tarefaId, @PathVariable Long anexoId) {
        Usuario usuarioAutenticado = getUsuarioAutenticadoSimulado();
        if (usuarioAutenticado == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        // Verificar se o anexo pertence à tarefaId antes de tentar deletar
        AnexoDTO anexoParaDeletar = anexoService.buscarAnexoPorId(anexoId, usuarioAutenticado);
        if (!anexoParaDeletar.getTarefaId().equals(tarefaId)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build(); // Ou NotFound se preferir esconder a
                                                                          // existência
        }

        try {
            anexoService.deletarAnexo(anexoId, usuarioAutenticado);
            return ResponseEntity.noContent().build();
        } catch (IOException e) {
            // Logar o erro
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Endpoint para download de arquivo pode ser adicionado aqui, retornando
    // ResponseEntity<Resource>

    @Operation(summary = "Baixa um anexo")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Arquivo retornado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Anexo não encontrado ou sem permissão")
    })
    @GetMapping("/{anexoId}/download")
    public ResponseEntity<Resource> baixarAnexo(@PathVariable Long tarefaId, @PathVariable Long anexoId) {
        Usuario usuarioAutenticado = getUsuarioAutenticadoSimulado();
        if (usuarioAutenticado == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            // Primeiro, buscar metadados do anexo para Content-Type e nome do arquivo
            AnexoDTO anexoDTO = anexoService.buscarAnexoPorId(anexoId, usuarioAutenticado);
            if (!anexoDTO.getTarefaId().equals(tarefaId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // Anexo não pertence a esta tarefa
            }

            Resource resource = anexoService.baixarAnexo(anexoId, usuarioAutenticado);
            String contentType = anexoDTO.getTipoArquivo();
            if (contentType == null || contentType.isBlank()) {
                contentType = "application/octet-stream"; // Tipo padrão
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + anexoDTO.getNomeArquivo() + "\"")
                    .body(resource);
        } catch (IOException e) {
            // Logar o erro
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
