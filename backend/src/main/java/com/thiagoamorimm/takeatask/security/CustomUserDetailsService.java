package com.thiagoamorimm.takeatask.security;

import com.thiagoamorimm.takeatask.model.Usuario;
import com.thiagoamorimm.takeatask.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByLogin(login)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
                
        String authority = "USUARIO_PADRAO";
        if (usuario.getPerfil() != null) {
            authority = usuario.getPerfil().name();
        } else {
            System.out.println("ALERTA: Usuário " + login + " tem perfil nulo, usando USUARIO_PADRAO como fallback");
        }
        
        return org.springframework.security.core.userdetails.User
                .withUsername(usuario.getLogin())
                .password(usuario.getSenha())
                .authorities(authority)
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(!usuario.isAtivo())
                .build();
    }
} 