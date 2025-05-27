package com.thiagoamorimm.takeatask.service;

import com.thiagoamorimm.takeatask.dto.TagCreateDTO;
import com.thiagoamorimm.takeatask.dto.TagDTO;
import com.thiagoamorimm.takeatask.model.Tag;

import java.util.List;
import java.util.Set;

public interface TagService {
    TagDTO criarTag(TagCreateDTO tagCreateDTO);

    TagDTO buscarTagPorId(Long id);

    TagDTO buscarTagPorNome(String nome);

    List<TagDTO> listarTodasTags(String query); // Modificado para aceitar query

    TagDTO atualizarTag(Long id, TagCreateDTO tagCreateDTO);

    void deletarTag(Long id);

    Set<Tag> buscarOuCriarTags(Set<String> nomesTags); // Método auxiliar para TarefaService

    Tag findTagEntityById(Long id); // Método auxiliar
}
