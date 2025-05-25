package com.thiagoamorimm.takeatask.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Take a Task API")
                        .version("v1")
                        .description("API para o gerenciador de tarefas Take a Task.")
                        .termsOfService("http://swagger.io/terms/") // Exemplo
                        .license(new License().name("Apache 2.0").url("http://springdoc.org"))); // Exemplo
    }
}
