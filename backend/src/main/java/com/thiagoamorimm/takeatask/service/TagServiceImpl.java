package com.thiagoamorimm.takeatask.service;

import com.thiagoamorimm.takeatask.dto.TagCreateDTO;
import com.thiagoamorimm.takeatask.dto.TagDTO;
import com.thiagoamorimm.takeatask.exception.ConflictException;
import com.thiagoamorimm.takeatask.exception.ResourceNotFoundException;
import com.thiagoamorimm.takeatask.model.Tag;
import com.thiagoamorimm.takeatask.repository.TagRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;

    // @Autowired é opcional em construtores de classes @Service mais recentes
    public TagServiceImpl(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    @Override
    @Transactional
    public TagDTO criarTag(TagCreateDTO tagCreateDTO) {
        tagRepository.findByNome(tagCreateDTO.getNome()).ifPresent(t -> {
            throw new ConflictException("Tag", "nome", tagCreateDTO.getNome());
        });
        Tag tag = new Tag();
        tag.setNome(tagCreateDTO.getNome());
        if (tagCreateDTO.getCor() != null) {
            tag.setCor(tagCreateDTO.getCor());
        }
        if (tagCreateDTO.getDescricao() != null) {
            tag.setDescricao(tagCreateDTO.getDescricao());
        }
        Tag novaTag = tagRepository.save(tag);
        return convertToDTO(novaTag);
    }

    @Override
    @Transactional(readOnly = true)
    public TagDTO buscarTagPorId(Long id) {
        Tag tag = findTagEntityById(id);
        return convertToDTO(tag);
    }

    @Override
    @Transactional(readOnly = true)
    public Tag findTagEntityById(Long id) {
        return tagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag", "id", id));
    }

    @Override
    @Transactional(readOnly = true)
    public TagDTO buscarTagPorNome(String nome) {
        Tag tag = tagRepository.findByNome(nome)
                .orElseThrow(() -> new ResourceNotFoundException("Tag", "nome", nome));
        return convertToDTO(tag);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TagDTO> listarTodasTags(String query) {
        List<Tag> tags;
        if (query != null && !query.trim().isEmpty()) {
            // Supondo que TagRepository tenha um método para buscar por nome ou descrição
            // Se não, precisaremos adicionar ou usar Specification
            tags = tagRepository.findByNomeContainingIgnoreCaseOrDescricaoContainingIgnoreCase(query, query);
        } else {
            tags = tagRepository.findAll();
        }
        return tags.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TagDTO atualizarTag(Long id, TagCreateDTO tagCreateDTO) {
        Tag tagExistente = findTagEntityById(id);
        Optional<Tag> tagComMesmoNome = tagRepository.findByNome(tagCreateDTO.getNome());
        if (tagComMesmoNome.isPresent() && !tagComMesmoNome.get().getId().equals(id)) {
            throw new ConflictException("Tag", "nome", tagCreateDTO.getNome());
        }
        tagExistente.setNome(tagCreateDTO.getNome());
        // Atualizar cor e descrição se fornecidos
        if (tagCreateDTO.getCor() != null) {
            tagExistente.setCor(tagCreateDTO.getCor());
        }
        if (tagCreateDTO.getDescricao() != null) {
            tagExistente.setDescricao(tagCreateDTO.getDescricao());
        } else { // Permitir limpar a descrição
            tagExistente.setDescricao(null);
        }
        Tag tagAtualizada = tagRepository.save(tagExistente);
        return convertToDTO(tagAtualizada);
    }

    @Override
    @Transactional
    public void deletarTag(Long id) {
        Tag tag = findTagEntityById(id);
        if (!tag.getTarefas().isEmpty()) {
            throw new ConflictException("Não é possível excluir a tag pois ela está associada a uma ou mais tarefas.");
        }
        tagRepository.delete(tag);
    }

    @Override
    @Transactional
    public Set<Tag> buscarOuCriarTags(Set<String> nomesTags) {
        Set<Tag> tags = new HashSet<>();
        if (nomesTags != null && !nomesTags.isEmpty()) {
            for (String nomeTag : nomesTags) {
                Tag tag = tagRepository.findByNome(nomeTag)
                        .orElseGet(() -> tagRepository.save(new Tag(nomeTag)));
                tags.add(tag);
            }
        }
        return tags;
    }

    private TagDTO convertToDTO(Tag tag) {
        TagDTO dto = new TagDTO();
        BeanUtils.copyProperties(tag, dto);
        return dto;
    }
}
