package com.smartlogix.usuario.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("SmartLogix API")
                        .version("1.0.0")
                        .description("API para la gestión de usuarios, empresas y productos de SmartLogix")
                        .contact(new Contact()
                                .name("SmartLogix Team")
                                .email("soporte@smartlogix.com")
                                .url("https://www.smartlogix.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("http://springdoc.org")));
    }
}