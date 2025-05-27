package com.thiagoamorimm.takeatask;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

@SpringBootApplication
public class TakeataskApplication {

	@PostConstruct
	public void init() {
		// Define o fuso horário padrão da JVM para America/Sao_Paulo
		TimeZone.setDefault(TimeZone.getTimeZone("America/Sao_Paulo"));
	}

	public static void main(String[] args) {
		SpringApplication.run(TakeataskApplication.class, args);
	}

}
