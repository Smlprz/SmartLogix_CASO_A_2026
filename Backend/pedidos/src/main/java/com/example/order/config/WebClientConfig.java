package com.example.order.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean(name = "inventoryClient")
    public WebClient inventoryClient() {
        return WebClient.builder()
                .baseUrl("http://localhost:8083/api")
                .build();
    }

    @Bean(name = "usuarioClient")
    public WebClient usuarioClient() {
        return WebClient.builder()
                .baseUrl("http://localhost:8080/api")
                .build();
    }
}
