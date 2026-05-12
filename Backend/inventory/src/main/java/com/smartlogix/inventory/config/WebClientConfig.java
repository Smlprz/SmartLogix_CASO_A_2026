package com.smartlogix.inventory.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean(name = "usuarioClient")
    public WebClient usuarioClient() {
        return WebClient.builder()
                .baseUrl("http://localhost:8080/api")
                .build();
    }

    @Bean(name = "pedidosClient")
    public WebClient pedidosClient() {
        return WebClient.builder()
                .baseUrl("http://localhost:8081/api")
                .build();
    }
}
