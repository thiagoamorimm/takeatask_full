package com.thiagoamorimm.takeatask.controller;

import com.thiagoamorimm.takeatask.dto.TagCreateDTO;
import com.thiagoamorimm.takeatask.dto.TagDTO;
import com.thiagoamorimm.takeatask.service.TagService;
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
@RequestMapping("/api/tags")
@Tag(name = "Tags", description = "Endpoints para gerenciamento de tags")
public class TagController {

    private final TagService tagService;

    @Autowired
    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @Operation(summary = "Cria uma nova tag")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Tag criada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Requisição inválida"),
            @ApiResponse(responseCode = "409", description = "Conflito, tag com este nome já existe")
    })
    @PostMapping
    public ResponseEntity<TagDTO> criarTag(@Valid @RequestBody TagCreateDTO tagCreateDTO) {
        // Idealmente, apenas Admin/Gestor poderia criar tags globais.
        // Usuários poderiam criar tags ao adicionar a uma tarefa, e essas seriam
        // validadas/aprovadas ou ficariam "locais".
        // Simplificando: qualquer um pode criar por enquanto.
        TagDTO novaTag = tagService.criarTag(tagCreateDTO);
        return new ResponseEntity<>(novaTag, HttpStatus.CREATED);
    }

    @Operation(summary = "Busca uma tag pelo ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tag encontrada"),
            @ApiResponse(responseCode = "404", description = "Tag não encontrada")
    })
    @GetMapping("/{id}")
    public ResponseEntity<TagDTO> buscarTagPorId(@PathVariable Long id) {
        TagDTO tagDTO = tagService.buscarTagPorId(id);
        return ResponseEntity.ok(tagDTO);
    }

    @Operation(summary = "Busca uma tag pelo nome")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tag encontrada"),
            @ApiResponse(responseCode = "404", description = "Tag não encontrada")
    })
    @GetMapping("/nome/{nome}")
    public ResponseEntity<TagDTO> buscarTagPorNome(@PathVariable String nome) {
        TagDTO tagDTO = tagService.buscarTagPorNome(nome);
        return ResponseEntity.ok(tagDTO);
    }

    @Operation(summary = "Lista todas as tags")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de tags retornada")
    })
    @GetMapping
    public ResponseEntity<List<TagDTO>> listarTodasTags(
            @RequestParam(required = false) String q) {
        List<TagDTO> tags = tagService.listarTodasTags(q); // Passar o parâmetro de busca para o serviço
        return ResponseEntity.ok(tags);
    }

    @Operation(summary = "Atualiza uma tag existente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tag atualizada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Requisição inválida"),
            @ApiResponse(responseCode = "404", description = "Tag não encontrada"),
            @ApiResponse(responseCode = "409", description = "Conflito, já existe outra tag com o novo nome")
    })
    @PutMapping("/{id}")
    public ResponseEntity<TagDTO> atualizarTag(@PathVariable Long id, @Valid @RequestBody TagCreateDTO tagCreateDTO) {
        // Apenas Admin/Gestor deveria poder atualizar tags globais.
        TagDTO tagAtualizada = tagService.atualizarTag(id, tagCreateDTO);
        return ResponseEntity.ok(tagAtualizada);
    }

    @Operation(summary = "Deleta uma tag")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Tag deletada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Tag não encontrada"),
            @ApiResponse(responseCode = "409", description = "Não é possível excluir a tag pois está em uso")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarTag(@PathVariable Long id) {
        // Apenas Admin/Gestor deveria poder deletar tags globais.
        tagService.deletarTag(id);
        return ResponseEntity.noContent().build();
    }
}
