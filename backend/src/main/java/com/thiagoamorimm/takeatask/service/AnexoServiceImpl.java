package com.thiagoamorimm.takeatask.service;

import com.thiagoamorimm.takeatask.dto.AnexoDTO;
import com.thiagoamorimm.takeatask.enums.PerfilUsuario;
import com.thiagoamorimm.takeatask.exception.BadRequestException;
import com.thiagoamorimm.takeatask.exception.ResourceNotFoundException;
import com.thiagoamorimm.takeatask.model.Anexo;
import com.thiagoamorimm.takeatask.model.Tarefa;
import com.thiagoamorimm.takeatask.model.Usuario;
import com.thiagoamorimm.takeatask.repository.AnexoRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AnexoServiceImpl implements AnexoService {

    private final AnexoRepository anexoRepository;
    private final TarefaService tarefaService;
    private final Path fileStorageLocation;

    @Autowired
    public AnexoServiceImpl(AnexoRepository anexoRepository,
            @Lazy TarefaService tarefaService,
            @Value("${file.upload-dir:./uploads}") String uploadDir) { // Define um diretório padrão
        this.anexoRepository = anexoRepository;
        this.tarefaService = tarefaService;
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Não foi possível criar o diretório para upload de arquivos.", ex);
        }
    }

    @Override
    @Transactional
    public AnexoDTO salvarAnexo(MultipartFile arquivo, Long tarefaId, Usuario usuarioUpload) throws IOException {
        Tarefa tarefa = tarefaService.findTarefaEntityById(tarefaId);
        // Verificar permissão para adicionar anexo à tarefa (ex: ser membro,
        // responsável, etc.)
        // Por simplicidade, vamos assumir que se pode buscar a tarefa, pode anexar.
        // Idealmente, TarefaService teria um método para verificar permissão de
        // modificação.
        tarefaService.buscarTarefaPorId(tarefaId, usuarioUpload); // Isso implicitamente verifica a permissão de
                                                                  // visualização

        String nomeOriginal = StringUtils.cleanPath(arquivo.getOriginalFilename());
        String extensao = StringUtils.getFilenameExtension(nomeOriginal);
        if (extensao == null) {
            extensao = "dat"; // Valor padrão caso não haja extensão
        }
        String nomeArquivoArmazenado = UUID.randomUUID().toString() + "." + extensao;

        Path targetLocation = this.fileStorageLocation.resolve(nomeArquivoArmazenado);
        Files.copy(arquivo.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        Anexo anexo = new Anexo();
        anexo.setNomeArquivo(nomeOriginal);
        anexo.setTipoArquivo(arquivo.getContentType());
        anexo.setTamanhoArquivo(arquivo.getSize());
        anexo.setCaminhoArquivo(targetLocation.toString()); // Ou apenas nomeArquivoArmazenado se o base path for
                                                            // conhecido
        anexo.setTarefa(tarefa);
        anexo.setUsuarioUpload(usuarioUpload);

        Anexo anexoSalvo = anexoRepository.save(anexo);
        return convertToDTO(anexoSalvo);
    }

    @Override
    @Transactional(readOnly = true)
    public AnexoDTO buscarAnexoPorId(Long id, Usuario usuarioAutenticado) {
        Anexo anexo = findAnexoEntityById(id);
        tarefaService.buscarTarefaPorId(anexo.getTarefa().getId(), usuarioAutenticado); // Verifica permissão na tarefa
        return convertToDTO(anexo);
    }

    @Override
    @Transactional(readOnly = true)
    public Anexo findAnexoEntityById(Long id) {
        return anexoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Anexo", "id", id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AnexoDTO> listarAnexosPorTarefaId(Long tarefaId, Usuario usuarioAutenticado) {
        Tarefa tarefa = tarefaService.findTarefaEntityById(tarefaId);
        tarefaService.buscarTarefaPorId(tarefaId, usuarioAutenticado); // Verifica permissão na tarefa

        return anexoRepository.findByTarefa(tarefa).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deletarAnexo(Long id, Usuario usuarioAutenticado) throws IOException {
        Anexo anexo = findAnexoEntityById(id);
        Tarefa tarefaDoAnexo = anexo.getTarefa();

        // Verificar permissão para deletar anexo
        // Admin pode deletar qualquer anexo.
        // Usuário que fez upload pode deletar seu próprio anexo.
        // Criador/Responsável da tarefa pode deletar anexos da tarefa.
        boolean temPermissao = false;
        if (usuarioAutenticado.getPerfil() == PerfilUsuario.ADMINISTRADOR_GESTOR ||
                anexo.getUsuarioUpload().getId().equals(usuarioAutenticado.getId()) ||
                tarefaDoAnexo.getCriador().getId().equals(usuarioAutenticado.getId()) ||
                (tarefaDoAnexo.getResponsavel() != null
                        && tarefaDoAnexo.getResponsavel().getId().equals(usuarioAutenticado.getId()))) {
            temPermissao = true;
        }

        if (!temPermissao) {
            throw new BadRequestException("Você não tem permissão para deletar este anexo.");
        }

        Path filePath = Paths.get(anexo.getCaminhoArquivo());
        Files.deleteIfExists(filePath);
        anexoRepository.delete(anexo);
    }

    @Override
    @Transactional(readOnly = true)
    public Resource baixarAnexo(Long id, Usuario usuarioAutenticado) throws IOException {
        Anexo anexo = findAnexoEntityById(id);
        tarefaService.buscarTarefaPorId(anexo.getTarefa().getId(), usuarioAutenticado); // Verifica permissão na tarefa

        try {
            Path filePath = Paths.get(anexo.getCaminhoArquivo()).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("Arquivo do Anexo", "id",
                        id + " (caminho: " + anexo.getCaminhoArquivo() + ")");
            }
        } catch (MalformedURLException ex) {
            throw new ResourceNotFoundException("Arquivo do Anexo", "id",
                    id + " (URL malformada: " + anexo.getCaminhoArquivo() + ")", ex);
        }
    }

    private AnexoDTO convertToDTO(Anexo anexo) {
        AnexoDTO dto = new AnexoDTO();
        BeanUtils.copyProperties(anexo, dto, "tarefa", "usuarioUpload");
        dto.setTarefaId(anexo.getTarefa().getId());
        if (anexo.getUsuarioUpload() != null) {
            dto.setUsuarioUploadId(anexo.getUsuarioUpload().getId());
            dto.setNomeUsuarioUpload(anexo.getUsuarioUpload().getNome());
        }
        // O caminho do arquivo pode ser modificado aqui para ser uma URL de download se
        // necessário
        return dto;
    }
}
