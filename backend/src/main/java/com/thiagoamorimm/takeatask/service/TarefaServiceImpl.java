package com.thiagoamorimm.takeatask.service;

import com.thiagoamorimm.takeatask.dto.*;
import com.thiagoamorimm.takeatask.enums.PerfilUsuario;
import com.thiagoamorimm.takeatask.enums.PrioridadeTarefa;
import com.thiagoamorimm.takeatask.enums.StatusTarefa;
import com.thiagoamorimm.takeatask.exception.BadRequestException;
import com.thiagoamorimm.takeatask.exception.ResourceNotFoundException;
import com.thiagoamorimm.takeatask.model.*;
import com.thiagoamorimm.takeatask.repository.TarefaRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType; // Adicionado
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TarefaServiceImpl implements TarefaService {

    private final TarefaRepository tarefaRepository;
    private final UsuarioService usuarioService;
    private final TagService tagService;
    private final EmailService emailService;

    public TarefaServiceImpl(TarefaRepository tarefaRepository,
            @Lazy UsuarioService usuarioService,
            @Lazy TagService tagService,
            @Lazy EmailService emailService) {
        this.tarefaRepository = tarefaRepository;
        this.usuarioService = usuarioService;
        this.tagService = tagService;
        this.emailService = emailService;
    }

    @Override
    @Transactional
    public TarefaDTO criarTarefa(TarefaCreateDTO dto, Usuario criadorAutenticado) {
        Tarefa tarefa = new Tarefa();
        BeanUtils.copyProperties(dto, tarefa, "responsavelId", "tags");

        tarefa.setCriador(criadorAutenticado);

        Usuario responsavel = null;
        if (dto.getResponsavelId() != null) {
            responsavel = usuarioService.findUsuarioEntityById(dto.getResponsavelId());
            tarefa.setResponsavel(responsavel);
        } else {
            responsavel = criadorAutenticado;
            tarefa.setResponsavel(criadorAutenticado);
        }

        if (dto.getTags() != null && !dto.getTags().isEmpty()) {
            Set<Tag> tags = tagService.buscarOuCriarTags(dto.getTags());
            tarefa.setTags(tags);
        }

        Tarefa novaTarefa = tarefaRepository.save(tarefa);

        // Envia email se a tarefa for atribuída a outro usuário
        if (responsavel != null && !responsavel.getId().equals(criadorAutenticado.getId())) {
            if (responsavel.getLogin() != null && responsavel.getLogin().contains("@")) {
                emailService.sendSimpleMessage(
                    responsavel.getLogin(),
                    "Nova tarefa atribuída a você",
                    "Olá, uma nova tarefa foi atribuída a você: " + tarefa.getNome()
                );
            }
        }

        return convertToDTO(novaTarefa);
    }

    @Override
    @Transactional(readOnly = true)
    public TarefaDTO buscarTarefaPorId(Long id, Usuario usuarioAutenticado) {
        Tarefa tarefa = findTarefaEntityById(id);
        verificarPermissaoVisualizacao(tarefa, usuarioAutenticado);
        return convertToDTO(tarefa);
    }

    @Override
    @Transactional(readOnly = true)
    public Tarefa findTarefaEntityById(Long id) {
        return tarefaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tarefa", "id", id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TarefaDTO> listarTarefasPorUsuario(Usuario usuarioAutenticado, StatusTarefa status,
            PrioridadeTarefa prioridade, Long responsavelId, LocalDateTime dataPrazoInicio, LocalDateTime dataPrazoFim,
            Set<Long> tagIds) {
        // Este método agora delega para listarTarefasFiltradas
        return listarTarefasFiltradas(usuarioAutenticado, status, prioridade, responsavelId, dataPrazoInicio,
                dataPrazoFim, tagIds, null, "minhas");
    }

    @Override
    @Transactional(readOnly = true)
    public List<TarefaDTO> listarTodasTarefasAdmin(StatusTarefa status, PrioridadeTarefa prioridade, Long responsavelId,
            LocalDateTime dataPrazoInicio, LocalDateTime dataPrazoFim, Set<Long> tagIds) {
        // Simula um usuário admin para chamar o método geral de listagem
        // Em um cenário real, o usuário admin seria obtido do contexto de segurança
        Usuario adminSimulado = new Usuario();
        adminSimulado.setPerfil(PerfilUsuario.ADMINISTRADOR_GESTOR);
        // Pode ser necessário setar um ID se a lógica de getUsuarioAutenticadoSimulado
        // for usada internamente
        // ou se a lógica de permissão em listarTarefasFiltradas depender do ID do
        // admin.
        // Para simplificar, assumimos que o perfil é suficiente para a lógica de admin
        // em listarTarefasFiltradas.

        return listarTarefasFiltradas(adminSimulado, status, prioridade, responsavelId, dataPrazoInicio, dataPrazoFim,
                tagIds, null, "todas");
    }

    @Override
    @Transactional(readOnly = true)
    public List<TarefaDTO> pesquisarTarefas(String keyword, Usuario usuarioAutenticado) {
        return listarTarefasFiltradas(usuarioAutenticado, null, null, null, null, null, null, keyword, "todas");
    }

    @Override
    @Transactional
    public TarefaDTO atualizarTarefa(Long id, TarefaUpdateDTO dto, Usuario usuarioAutenticado) {
        Tarefa tarefa = findTarefaEntityById(id);
        verificarPermissaoModificacao(tarefa, usuarioAutenticado);

        boolean mudouResponsavel = false;
        Long idResponsavelAnterior = tarefa.getResponsavel() != null ? tarefa.getResponsavel().getId() : null;
        StatusTarefa statusAnterior = tarefa.getStatus();

        if (dto.getNome() != null)
            tarefa.setNome(dto.getNome());
        if (dto.getDescricao() != null)
            tarefa.setDescricao(dto.getDescricao());
        if (dto.getStatus() != null)
            tarefa.setStatus(dto.getStatus());
        if (dto.getPrioridade() != null)
            tarefa.setPrioridade(dto.getPrioridade());
        if (dto.getDataPrazo() != null)
            tarefa.setDataPrazo(dto.getDataPrazo());

        if (dto.getResponsavelId() != null) {
            Usuario novoResponsavel = usuarioService.findUsuarioEntityById(dto.getResponsavelId());
            if (usuarioAutenticado.getPerfil() != PerfilUsuario.ADMINISTRADOR_GESTOR &&
                    !novoResponsavel.getId().equals(usuarioAutenticado.getId()) &&
                    !tarefa.getCriador().getId().equals(usuarioAutenticado.getId())) {
                throw new BadRequestException("Você não tem permissão para atribuir esta tarefa a outro usuário.");
            }
            if (idResponsavelAnterior == null || !idResponsavelAnterior.equals(novoResponsavel.getId())) {
                mudouResponsavel = true;
            }
            tarefa.setResponsavel(novoResponsavel);
        }

        if (dto.getTags() != null) {
            Set<Tag> tags = tagService.buscarOuCriarTags(dto.getTags());
            tarefa.setTags(tags);
        }

        Tarefa tarefaAtualizada = tarefaRepository.save(tarefa);

        // Notifica novo responsável se mudou
        if (mudouResponsavel && tarefa.getResponsavel() != null && tarefa.getResponsavel().getLogin() != null && tarefa.getResponsavel().getLogin().contains("@")) {
            emailService.sendSimpleMessage(
                tarefa.getResponsavel().getLogin(),
                "Tarefa atribuída a você",
                "Olá, uma tarefa foi atribuída a você: " + tarefa.getNome()
            );
        }
        // Notifica responsável sobre alteração de status
        if (dto.getStatus() != null && tarefa.getResponsavel() != null && tarefa.getResponsavel().getLogin() != null && tarefa.getResponsavel().getLogin().contains("@")) {
            if (!dto.getStatus().equals(statusAnterior)) {
                emailService.sendSimpleMessage(
                    tarefa.getResponsavel().getLogin(),
                    "Status da tarefa alterado",
                    "O status da tarefa '" + tarefa.getNome() + "' foi alterado para: " + tarefa.getStatus()
                );
            }
        }

        return convertToDTO(tarefaAtualizada);
    }

    @Override
    @Transactional
    public void deletarTarefa(Long id, Usuario usuarioAutenticado) {
        Tarefa tarefa = findTarefaEntityById(id);
        verificarPermissaoModificacao(tarefa, usuarioAutenticado);
        tarefaRepository.delete(tarefa);
    }

    private void verificarPermissaoVisualizacao(Tarefa tarefa, Usuario usuario) {
        if (usuario.getPerfil() == PerfilUsuario.ADMINISTRADOR_GESTOR)
            return;
        if (!isOwnerOrAssignee(tarefa, usuario)) {
            throw new ResourceNotFoundException("Tarefa", "id", tarefa.getId());
        }
    }

    private void verificarPermissaoModificacao(Tarefa tarefa, Usuario usuario) {
        if (usuario.getPerfil() == PerfilUsuario.ADMINISTRADOR_GESTOR)
            return;
        if (!tarefa.getCriador().getId().equals(usuario.getId()) &&
                (tarefa.getResponsavel() == null || !tarefa.getResponsavel().getId().equals(usuario.getId()))) {
            throw new BadRequestException("Você não tem permissão para modificar esta tarefa.");
        }
    }

    private boolean isOwnerOrAssignee(Tarefa tarefa, Usuario usuario) {
        return tarefa.getCriador().getId().equals(usuario.getId()) ||
                (tarefa.getResponsavel() != null && tarefa.getResponsavel().getId().equals(usuario.getId()));
    }

    private TarefaDTO convertToDTO(Tarefa tarefa) {
        TarefaDTO dto = new TarefaDTO();
        BeanUtils.copyProperties(tarefa, dto, "tags", "anexos", "comentarios", "criador", "responsavel");

        if (tarefa.getCriador() != null) {
            dto.setCriadorId(tarefa.getCriador().getId());
            dto.setNomeCriador(tarefa.getCriador().getNome());
        }
        if (tarefa.getResponsavel() != null) {
            dto.setResponsavelId(tarefa.getResponsavel().getId());
            dto.setNomeResponsavel(tarefa.getResponsavel().getNome());
        }

        if (tarefa.getTags() != null) {
            // Hibernate.initialize(tarefa.getTags()); // Removido, confiando no fetch join
            // da Specification
            if (!tarefa.getTags().isEmpty()) {
                Set<TagDTO> tagDTOs = new java.util.HashSet<>();
                for (Tag tag : tarefa.getTags()) { // Iterar sobre a coleção já potencialmente inicializada pelo fetch
                                                   // join
                    TagDTO tagDTO = new TagDTO();
                    BeanUtils.copyProperties(tag, tagDTO);
                    tagDTOs.add(tagDTO);
                }
                dto.setTags(tagDTOs);
            } else {
                dto.setTags(java.util.Collections.emptySet());
            }
        } else {
            dto.setTags(java.util.Collections.emptySet());
        }

        if (tarefa.getAnexos() != null) {
            dto.setAnexos(tarefa.getAnexos().stream().map(anexo -> {
                AnexoDTO anexoDTO = new AnexoDTO();
                BeanUtils.copyProperties(anexo, anexoDTO, "tarefa", "usuarioUpload");
                if (anexo.getTarefa() != null)
                    anexoDTO.setTarefaId(anexo.getTarefa().getId());
                if (anexo.getUsuarioUpload() != null) {
                    anexoDTO.setUsuarioUploadId(anexo.getUsuarioUpload().getId());
                    anexoDTO.setNomeUsuarioUpload(anexo.getUsuarioUpload().getNome());
                }
                return anexoDTO;
            }).collect(Collectors.toList()));
        }

        if (tarefa.getComentarios() != null) {
            dto.setComentarios(tarefa.getComentarios().stream().map(comentario -> {
                ComentarioDTO comentarioDTO = new ComentarioDTO();
                BeanUtils.copyProperties(comentario, comentarioDTO, "tarefa", "autor");
                if (comentario.getTarefa() != null)
                    comentarioDTO.setTarefaId(comentario.getTarefa().getId());
                if (comentario.getAutor() != null) {
                    comentarioDTO.setAutorId(comentario.getAutor().getId());
                    comentarioDTO.setNomeAutor(comentario.getAutor().getNome());
                }
                return comentarioDTO;
            }).collect(Collectors.toList()));
        }
        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public TarefaStatsDTO getTarefaStats(Usuario usuarioAutenticado) {
        long totalTarefas;
        long concluidas;
        long emAndamento;
        long atrasadas;

        if (usuarioAutenticado.getPerfil() == PerfilUsuario.ADMINISTRADOR_GESTOR) {
            totalTarefas = tarefaRepository.count();
            concluidas = tarefaRepository.countByStatus(StatusTarefa.CONCLUIDA);
            emAndamento = tarefaRepository.countByStatus(StatusTarefa.EM_ANDAMENTO);
            atrasadas = tarefaRepository.countByStatusNotAndDataPrazoBefore(StatusTarefa.CONCLUIDA,
                    LocalDateTime.now());
        } else {
            totalTarefas = tarefaRepository.countByResponsavel(usuarioAutenticado);
            concluidas = tarefaRepository.countByResponsavelAndStatus(usuarioAutenticado, StatusTarefa.CONCLUIDA);
            emAndamento = tarefaRepository.countByResponsavelAndStatus(usuarioAutenticado, StatusTarefa.EM_ANDAMENTO);
            atrasadas = tarefaRepository.countByResponsavelAndStatusNotAndDataPrazoBefore(usuarioAutenticado,
                    StatusTarefa.CONCLUIDA, LocalDateTime.now());
        }
        return new TarefaStatsDTO(totalTarefas, concluidas, emAndamento, atrasadas);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TarefaDTO> listarTarefasFiltradas(Usuario usuarioAutenticado, StatusTarefa status,
            PrioridadeTarefa prioridade, Long responsavelIdParam, LocalDateTime dataPrazoInicio,
            LocalDateTime dataPrazoFim, Set<Long> tagIds, String keyword, String tipoFiltro) {

        Specification<Tarefa> spec = (root, query, cb) -> {
            // Adiciona fetch para tags para evitar LazyInitializationException e problemas
            // relacionados
            // Apenas aplicar fetch se não for uma query de contagem (geralmente usada para
            // paginação)
            if (query != null && query.getResultType() != Long.class && query.getResultType() != long.class) {
                root.fetch("tags", JoinType.LEFT);
                // Se outras coleções fossem necessárias e problemáticas, poderiam ser
                // adicionadas aqui:
                // root.fetch("anexos", JoinType.LEFT);
                // root.fetch("comentarios", JoinType.LEFT);
            }
            query.distinct(true); // Essencial ao usar fetch em coleções to-many para evitar duplicatas da
                                  // entidade Tarefa

            List<Predicate> predicates = new ArrayList<>();

            if (keyword != null && !keyword.trim().isEmpty()) {
                String searchTerm = "%" + keyword.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("nome")), searchTerm),
                        cb.like(cb.lower(root.get("descricao")), searchTerm)));
            }
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (prioridade != null) {
                predicates.add(cb.equal(root.get("prioridade"), prioridade));
            }
            if (dataPrazoInicio != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("dataPrazo"), dataPrazoInicio));
            }
            if (dataPrazoFim != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("dataPrazo"), dataPrazoFim));
            }
            if (tagIds != null && !tagIds.isEmpty()) {
                Join<Tarefa, Tag> tagJoin = root.join("tags");
                predicates.add(tagJoin.get("id").in(tagIds));
                query.distinct(true);
            }

            // Lógica de permissão e filtro por tipoFiltro
            if (usuarioAutenticado.getPerfil() == PerfilUsuario.ADMINISTRADOR_GESTOR) {
                if ("minhas".equalsIgnoreCase(tipoFiltro)) {
                    predicates.add(cb.or(
                            cb.equal(root.get("responsavel"), usuarioAutenticado),
                            cb.equal(root.get("criador"), usuarioAutenticado)));
                } else if (responsavelIdParam != null) {
                    predicates.add(cb.equal(root.get("responsavel").get("id"), responsavelIdParam));
                }
                // Para ADMIN, se tipoFiltro for "equipe" ou "todas" e responsavelIdParam não
                // for fornecido,
                // não adiciona filtro de usuário específico, buscando todas (respeitando
                // outros filtros).
            } else { // Usuário Padrão
                Predicate responsavelIsUser = cb.equal(root.get("responsavel"), usuarioAutenticado);
                Predicate criadorIsUser = cb.equal(root.get("criador"), usuarioAutenticado);

                if ("minhas".equalsIgnoreCase(tipoFiltro)) {
                    predicates.add(cb.or(responsavelIsUser, criadorIsUser));
                } else if ("equipe".equalsIgnoreCase(tipoFiltro)) {
                    // Simplificado: Tarefas onde o usuário é responsável.
                    // Poderia ser expandido para incluir uma entidade "Equipe".
                    predicates.add(responsavelIsUser);
                } else { // "todas" para usuário padrão (todas que ele pode ver)
                    predicates.add(cb.or(responsavelIsUser, criadorIsUser));
                }

                // Usuário padrão só pode filtrar por seu próprio ID se responsavelIdParam for
                // fornecido.
                if (responsavelIdParam != null) {
                    if (!responsavelIdParam.equals(usuarioAutenticado.getId())) {
                        throw new BadRequestException(
                                "Você não tem permissão para visualizar tarefas de outro usuário.");
                    }
                    // Adiciona o filtro pelo ID do responsável se for o próprio usuário
                    predicates.add(cb.equal(root.get("responsavel").get("id"), responsavelIdParam));
                }
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        List<Tarefa> tarefasEncontradas = tarefaRepository.findAll(spec);

        return tarefasEncontradas.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}
