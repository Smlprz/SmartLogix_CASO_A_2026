package com.smartlogix.usuario.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean(name = "pedidosClient")
    public WebClient pedidosClient() {
        return WebClient.builder()
                .baseUrl("http://localhost:8081/api")
                .build();
    }

    @Bean(name = "enviosClient")
    public WebClient enviosClient() {
        return WebClient.builder()
                .baseUrl("http://localhost:8082/api")
                .build();
    }
}
