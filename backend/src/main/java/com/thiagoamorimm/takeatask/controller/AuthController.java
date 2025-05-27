package com.thiagoamorimm.takeatask.controller;

import com.thiagoamorimm.takeatask.dto.JwtResponse;
import com.thiagoamorimm.takeatask.dto.LoginRequest;
import com.thiagoamorimm.takeatask.model.Usuario;
import com.thiagoamorimm.takeatask.repository.UsuarioRepository;
import com.thiagoamorimm.takeatask.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("Tentativa de login para: " + loginRequest.getLogin());
            
            // Verificar se o usuário existe
            var userOpt = usuarioRepository.findByLogin(loginRequest.getLogin());
            if (userOpt.isEmpty()) {
                System.out.println("Usuário não encontrado: " + loginRequest.getLogin());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não encontrado");
            }
            
            Usuario usuario = userOpt.get();
            System.out.println("Usuário encontrado: " + usuario.getNome() + ", Perfil: " + 
                             (usuario.getPerfil() != null ? usuario.getPerfil().name() : "NULL"));
            
            try {
                Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getLogin(), loginRequest.getSenha())
                );
                SecurityContextHolder.getContext().setAuthentication(authentication);

                String jwt = jwtUtil.generateToken(loginRequest.getLogin());
                
                return ResponseEntity.ok(new JwtResponse(jwt, usuario.getNome(), usuario.getLogin(), 
                                      usuario.getPerfil() != null ? usuario.getPerfil().name() : "USUARIO_PADRAO"));
            } catch (Exception e) {
                System.out.println("Erro na autenticação: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Senha incorreta");
            }
        } catch (Exception e) {
            System.out.println("Erro geral no login: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Erro ao processar login: " + e.getMessage());
        }
    }
} 