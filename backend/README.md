# Backend da Aplicação "Take a Task"

Este diretório contém o código-fonte do backend da aplicação de gerenciamento de tarefas "Take a Task".

## 1. Visão Geral

O backend é construído utilizando Java com o framework Spring Boot, seguindo os princípios da Arquitetura Limpa para promover um design modular, testável e de fácil manutenção. Ele expõe uma API RESTful para comunicação com o frontend e utiliza um banco de dados MySQL para persistência de dados.

## 2. Tecnologias Utilizadas

-   **Java 21**
-   **Spring Boot 3.4.5**: Framework principal para desenvolvimento rápido e robusto de aplicações Java.
    -   **Spring Web**: Para criação de APIs RESTful.
    -   **Spring Data JPA**: Para persistência de dados e interação com o banco de dados.
    -   **Spring Validation**: Para validação de dados de entrada.
-   **MySQL**: Banco de dados relacional para armazenamento dos dados da aplicação.
-   **Lombok**: Biblioteca para reduzir código boilerplate (getters, setters, construtores, etc.).
-   **Springdoc OpenAPI (Swagger)**: Para documentação automática da API RESTful.
-   **Maven**: Ferramenta de gerenciamento de dependências e build do projeto.

## 3. Estrutura do Projeto (Arquitetura Limpa)

O projeto segue uma estrutura de pacotes baseada na Arquitetura Limpa, com as seguintes camadas principais dentro de `src/main/java/com/thiagoamorimm/takeatask/`:

-   **`config`**: Contém classes de configuração do Spring Boot.
    -   `CorsConfig.java`: Configuração para Cross-Origin Resource Sharing (CORS), permitindo que o frontend (ex: `http://localhost:3000` ou `http://localhost:5173`) acesse a API.
    -   `OpenAPIConfig.java`: Configuração para o Springdoc OpenAPI, personalizando a documentação da API gerada (acessível em `/swagger-ui.html`).
-   **`controller`**: Camada de API (Interface Adapters). Contém os RESTful controllers que expõem os endpoints da aplicação.
    -   `AnexoController.java`: Endpoints para upload, listagem e exclusão de anexos em tarefas.
    -   `ComentarioController.java`: Endpoints para adicionar, listar e excluir comentários em tarefas.
    -   `SubtarefaController.java`: Endpoints para CRUD de subtarefas dentro de uma tarefa principal.
    -   `TagController.java`: Endpoints para CRUD de tags.
    -   `TarefaController.java`: Endpoints para CRUD de tarefas, incluindo filtros e pesquisa.
    -   `UsuarioController.java`: Endpoints para CRUD de usuários.
-   **`dto`**: Data Transfer Objects (DTOs). Classes simples para transportar dados entre as camadas, especialmente entre controllers e services, e para a comunicação com o frontend.
    -   DTOs de criação (ex: `UsuarioCreateDTO`, `TarefaCreateDTO`): Contêm os campos necessários para criar uma nova entidade, com validações.
    -   DTOs de atualização (ex: `UsuarioUpdateDTO`, `TarefaUpdateDTO`): Contêm os campos que podem ser atualizados, geralmente opcionais.
    -   DTOs de visualização (ex: `UsuarioDTO`, `TarefaDTO`): Representam a entidade como ela deve ser exposta pela API, omitindo dados sensíveis (como senhas) e formatando dados conforme necessário.
-   **`enums`**: Enumerações utilizadas em toda a aplicação.
    -   `PerfilUsuario.java`: Define os perfis de usuário (ex: `USUARIO_PADRAO`, `ADMINISTRADOR_GESTOR`).
    -   `PrioridadeTarefa.java`: Define os níveis de prioridade para tarefas (ex: `BAIXA`, `MEDIA`, `ALTA`, `URGENTE`).
    -   `StatusTarefa.java`: Define os status possíveis para uma tarefa (ex: `A_FAZER`, `EM_ANDAMENTO`, `CONCLUIDA`).
-   **`exception`**: Classes de exceção personalizadas para tratamento de erros específicos da aplicação.
    -   `BadRequestException.java` (HTTP 400): Para requisições malformadas ou inválidas.
    -   `ConflictException.java` (HTTP 409): Para conflitos, como tentar criar um recurso que já existe com um identificador único (ex: email duplicado).
    -   `ResourceNotFoundException.java` (HTTP 404): Quando um recurso específico não é encontrado.
-   **`model`**: Camada de Entidades (Enterprise Business Rules). Contém as entidades JPA (Plain Old Java Objects - POJOs) mapeadas para tabelas do banco de dados.
    -   `Anexo.java`: Representa um arquivo anexado a uma tarefa.
    -   `Comentario.java`: Representa um comentário feito em uma tarefa.
    -   `Subtarefa.java`: Representa uma subtarefa de uma tarefa principal.
    -   `Tag.java`: Representa uma tag para categorização de tarefas.
    -   `Tarefa.java`: A entidade central, representando uma tarefa com todos os seus atributos e relacionamentos.
    -   `Usuario.java`: Representa um usuário do sistema.
-   **`repository`**: Camada de Interface de Dados (Interface Adapters). Interfaces que estendem `JpaRepository` (ou similar do Spring Data) para interação com o banco de dados.
    -   Contém uma interface de repositório para cada entidade (ex: `UsuarioRepository`, `TarefaRepository`).
-   **`service`**: Camada de Casos de Uso (Application Business Rules). Contém a lógica de negócios da aplicação.
    -   Interfaces (ex: `UsuarioService`, `TarefaService`) definindo os contratos dos serviços.
    -   Implementações (ex: `UsuarioServiceImpl`, `TarefaServiceImpl`) contendo a lógica de negócios, validações, orquestração de chamadas aos repositórios e conversão entre DTOs e Entidades.

## 4. Funcionalidades Implementadas (Estrutura Base)

A estrutura base do backend inclui:

-   **Gerenciamento de Usuários**: Criação, busca, listagem, atualização e exclusão (ou desativação) de usuários.
-   **Gerenciamento de Tarefas**: Criação, busca, listagem (com filtros básicos), atualização e exclusão de tarefas. Inclui campos como nome, descrição, status, prioridade, responsável, criador, datas e tags.
-   **Gerenciamento de Tags**: Criação, busca, listagem, atualização e exclusão de tags. As tags podem ser associadas a tarefas.
-   **Gerenciamento de Subtarefas**: Criação, busca, listagem, atualização e exclusão de subtarefas vinculadas a uma tarefa principal.
-   **Gerenciamento de Anexos**: Upload, busca, listagem e exclusão de arquivos anexos a tarefas. O armazenamento de arquivos está configurado para um diretório local (`./uploads` por padrão).
-   **Gerenciamento de Comentários**: Adição, busca, listagem e exclusão de comentários em tarefas.
-   **Configuração de CORS**: Permite que o frontend acesse a API.
-   **Documentação da API com OpenAPI (Swagger)**: Disponível em `/swagger-ui.html` quando a aplicação está em execução.

**Observações Importantes:**

-   **Segurança**: A implementação de autenticação e autorização com Spring Security é um passo crucial que ainda precisa ser adicionado. Atualmente, os controllers simulam a obtenção de um usuário autenticado para fins de demonstração da lógica de permissão nos serviços.
-   **Tratamento de Senhas**: A criptografia de senhas (ex: usando `PasswordEncoder` do Spring Security) está comentada nos serviços e precisa ser implementada.
-   **Validações e Permissões**: As validações de entrada estão presentes nos DTOs e algumas verificações de permissão básicas estão nos serviços. Estas precisam ser expandidas e refinadas, especialmente com a introdução do Spring Security.
-   **Armazenamento de Arquivos**: A implementação atual de `AnexoService` salva os arquivos em um diretório local. Para produção, um serviço de armazenamento de objetos (como AWS S3, Google Cloud Storage, etc.) é recomendado.

## 5. Configuração e Execução

### Pré-requisitos

-   JDK 21 ou superior.
-   Maven 3.6 ou superior.
-   Uma instância do MySQL Server em execução.

### Configuração do Banco de Dados

1.  Certifique-se de que o MySQL está instalado e em execução.
2.  Crie um banco de dados para a aplicação (ex: `takeataskdb`).
3.  Configure as credenciais de acesso ao banco de dados no arquivo `src/main/resources/application.properties`:

    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/takeataskdb?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
    spring.datasource.username=seu_usuario_mysql
    spring.datasource.password=sua_senha_mysql
    spring.jpa.hibernate.ddl-auto=update # 'update' para desenvolvimento, 'validate' ou 'none' para produção
    ```

### Executando a Aplicação

1.  Navegue até o diretório raiz do backend (`backend/`).
2.  Compile e execute a aplicação usando o Maven Wrapper:
    -   No Windows: `mvnw spring-boot:run`
    -   No Linux/macOS: `./mvnw spring-boot:run`
3.  A aplicação estará disponível em `http://localhost:8080` (ou a porta configurada em `application.properties`).
4.  A documentação da API (Swagger UI) estará acessível em `http://localhost:8080/swagger-ui.html`.

## 6. Próximos Passos (Desenvolvimento)

-   Implementar Spring Security para autenticação (ex: JWT) e autorização baseada em perfis.
-   Implementar criptografia de senhas.
-   Refinar e expandir as regras de negócio e validações nos serviços.
-   Implementar funcionalidades mais complexas como notificações, templates de tarefas e relatórios.
-   Adicionar testes unitários e de integração.
-   Configurar um sistema de logging mais robusto.
-   Considerar estratégias de paginação para listagens que podem retornar muitos dados.

Este README fornece uma visão geral do estado atual do backend.
