package com.thiagoamorimm.takeatask.config;

import com.thiagoamorimm.takeatask.enums.PerfilUsuario;
import com.thiagoamorimm.takeatask.enums.PrioridadeTarefa;
import com.thiagoamorimm.takeatask.enums.StatusTarefa;
import com.thiagoamorimm.takeatask.model.*;
import com.thiagoamorimm.takeatask.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private TarefaRepository tarefaRepository;

    @Autowired
    private TagRepository tagRepository;


    @Override
    public void run(String... args) throws Exception {
        if (usuarioRepository.count() == 0) { // Popular apenas se estiver vazio
            criarTagsIniciais();
            criarUsuariosIniciais();
            criarTarefasIniciais();
        }
    }

    private void criarTagsIniciais() {
        tagRepository.save(new Tag("Backend", "#3B82F6", "Desenvolvimento do lado do servidor"));
        tagRepository.save(new Tag("Frontend", "#10B981", "Desenvolvimento da interface do usuário"));
        tagRepository.save(new Tag("Infraestrutura", "#F59E0B", "Configuração de servidores e serviços"));
        tagRepository.save(new Tag("Urgente", "#EF4444", "Tarefas com alta prioridade e prazo curto"));
        tagRepository.save(new Tag("Segurança", "#8B5CF6", "Questões relacionadas à segurança da aplicação"));
        tagRepository.save(new Tag("Database", "#6366F1", "Gerenciamento e modelagem de banco de dados"));
        tagRepository.save(new Tag("UI/UX", "#EC4899", "Design de interface e experiência do usuário"));
        tagRepository.save(new Tag("Documentação", "#78716C", "Criação e revisão de documentação"));
    }

    private void criarUsuariosIniciais() {
        Usuario admin = new Usuario();
        admin.setNome("Administrador");
        admin.setLogin("admin");
        admin.setSenha("$2b$10$QN/PJ6BCPZLAGlCdNlEoNeN.RR0cKHPaxM/i7XvJEs/t3CFPPx8OS");
        admin.setPerfil(PerfilUsuario.ADMINISTRADOR_GESTOR);
        usuarioRepository.save(admin);

        Usuario usuario = new Usuario();
        usuario.setNome("Usuário Teste");
        usuario.setLogin("usuario");
        usuario.setSenha("$2b$10$w1Qw8Qw8Qw8Qw8Qw8Qw8QeQw8Qw8Qw8Qw8Qw8Qw8Qw8Qw8Qw8Qw8Q");
        usuario.setPerfil(PerfilUsuario.USUARIO_PADRAO);
        usuarioRepository.save(usuario);
    }

    private void criarTarefasIniciais() {
        Usuario admin = usuarioRepository.findByLogin("admin").orElseThrow();
        Usuario usuario = usuarioRepository.findByLogin("usuario").orElseThrow();

        // Tarefa 1: Implementar Autenticação
        Tarefa tarefa1 = new Tarefa(
            "Implementar Autenticação JWT",
            "Implementar sistema de autenticação usando JWT",
            StatusTarefa.EM_ANDAMENTO,
            PrioridadeTarefa.ALTA,
            usuario,
            admin,
            LocalDateTime.now().plusDays(7)
        );
        tarefaRepository.save(tarefa1);

        // Tarefa 2: Desenvolver Frontend
        Tarefa tarefa2 = new Tarefa(
            "Desenvolver Interface do Usuário",
            "Criar interface responsiva usando React",
            StatusTarefa.A_FAZER,
            PrioridadeTarefa.MEDIA,
            usuario,
            admin,
            LocalDateTime.now().plusDays(14)
        );
        tarefaRepository.save(tarefa2);
    }
}
