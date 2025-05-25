package com.thiagoamorimm.takeatask.service;

import com.thiagoamorimm.takeatask.dto.UsuarioCreateDTO;
import com.thiagoamorimm.takeatask.dto.UsuarioDTO;
import com.thiagoamorimm.takeatask.dto.UsuarioUpdateDTO;
import com.thiagoamorimm.takeatask.exception.ConflictException;
import com.thiagoamorimm.takeatask.exception.ResourceNotFoundException;
import com.thiagoamorimm.takeatask.model.Usuario;
import com.thiagoamorimm.takeatask.repository.UsuarioRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UsuarioServiceImpl(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public UsuarioDTO criarUsuario(UsuarioCreateDTO usuarioCreateDTO) {
        if (usuarioRepository.findByLogin(usuarioCreateDTO.getLogin()).isPresent()) {
            throw new ConflictException("Usuário", "login", usuarioCreateDTO.getLogin());
        }
        Usuario usuario = new Usuario();
        BeanUtils.copyProperties(usuarioCreateDTO, usuario);
        usuario.setSenha(passwordEncoder.encode(usuarioCreateDTO.getSenha())); // Criptografar senha
        Usuario novoUsuario = usuarioRepository.save(usuario);
        return convertToDTO(novoUsuario);
    }

    @Override
    @Transactional(readOnly = true)
    public UsuarioDTO buscarUsuarioPorId(Long id) {
        Usuario usuario = findUsuarioEntityById(id);
        return convertToDTO(usuario);
    }

    @Override
    @Transactional(readOnly = true)
    public Usuario findUsuarioEntityById(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", "id", id));
    }

    @Override
    @Transactional(readOnly = true)
    public UsuarioDTO buscarUsuarioPorLogin(String login) {
        Usuario usuario = usuarioRepository.findByLogin(login)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", "login", login));
        return convertToDTO(usuario);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UsuarioDTO> listarTodosUsuarios(String query) {
        List<Usuario> usuarios;
        if (query != null && !query.trim().isEmpty()) {
            // Supondo que UsuarioRepository tenha um método para buscar por nome ou email
            // Se não, precisaremos adicionar ou usar Specification
            // Exemplo: tags =
            // tagRepository.findByNomeContainingIgnoreCaseOrDescricaoContainingIgnoreCase(query,
            // query);
            // Para usuários, poderia ser por nome ou email.
            // Vamos precisar adicionar este método ao UsuarioRepository
            usuarios = usuarioRepository.findByNomeContainingIgnoreCaseOrLoginContainingIgnoreCase(query, query);
        } else {
            usuarios = usuarioRepository.findAll();
        }
        return usuarios.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UsuarioDTO atualizarUsuario(Long id, UsuarioUpdateDTO usuarioUpdateDTO) {
        Usuario usuarioExistente = findUsuarioEntityById(id);

        if (usuarioUpdateDTO.getNome() != null) {
            usuarioExistente.setNome(usuarioUpdateDTO.getNome());
        }
        if (usuarioUpdateDTO.getLogin() != null && !usuarioUpdateDTO.getLogin().equals(usuarioExistente.getLogin())) {
            if (usuarioRepository.findByLogin(usuarioUpdateDTO.getLogin()).isPresent()) {
                throw new ConflictException("Usuário", "login", usuarioUpdateDTO.getLogin());
            }
            usuarioExistente.setLogin(usuarioUpdateDTO.getLogin());
        }
        if (usuarioUpdateDTO.getSenha() != null && !usuarioUpdateDTO.getSenha().isEmpty()) {
            usuarioExistente.setSenha(passwordEncoder.encode(usuarioUpdateDTO.getSenha()));
        }
        if (usuarioUpdateDTO.getPerfil() != null) {
            usuarioExistente.setPerfil(usuarioUpdateDTO.getPerfil());
        }
        if (usuarioUpdateDTO.getAtivo() != null) {
            usuarioExistente.setAtivo(usuarioUpdateDTO.getAtivo());
        }

        // Atualizar campos de configuração geral
        if (usuarioUpdateDTO.getTema() != null) {
            usuarioExistente.setTema(usuarioUpdateDTO.getTema());
        }
        if (usuarioUpdateDTO.getIdioma() != null) {
            usuarioExistente.setIdioma(usuarioUpdateDTO.getIdioma());
        }
        if (usuarioUpdateDTO.getFusoHorario() != null) {
            usuarioExistente.setFusoHorario(usuarioUpdateDTO.getFusoHorario());
        }
        if (usuarioUpdateDTO.getFormatoData() != null) {
            usuarioExistente.setFormatoData(usuarioUpdateDTO.getFormatoData());
        }
        if (usuarioUpdateDTO.getFormatoHora() != null) {
            usuarioExistente.setFormatoHora(usuarioUpdateDTO.getFormatoHora());
        }

        Usuario usuarioAtualizado = usuarioRepository.save(usuarioExistente);
        return convertToDTO(usuarioAtualizado);
    }

    @Override
    @Transactional
    public void deletarUsuario(Long id) {
        Usuario usuario = findUsuarioEntityById(id);
        // Em vez de deletar, podemos desativar o usuário:
        // usuario.setAtivo(false);
        // usuarioRepository.save(usuario);
        usuarioRepository.delete(usuario); // Ou deletar de fato
    }

    private UsuarioDTO convertToDTO(Usuario usuario) {
        UsuarioDTO dto = new UsuarioDTO();
        // BeanUtils.copyProperties irá copiar todos os campos com nomes
        // correspondentes,
        // incluindo os novos campos de configuração, pois foram adicionados a ambas as
        // classes.
        BeanUtils.copyProperties(usuario, dto);
        // A senha não é copiada por padrão se não existir no DTO, o que é bom.
        // Se precisasse excluir explicitamente: BeanUtils.copyProperties(usuario, dto,
        // "senha");
        return dto;
    }
}
