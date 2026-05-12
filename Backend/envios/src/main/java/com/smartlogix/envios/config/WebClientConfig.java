package com.smartlogix.envios.config;

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

    @Bean(name = "inventoryClient")
    public WebClient inventoryClient() {
        return WebClient.builder()
                .baseUrl("http://localhost:8083/api")
                .build();
    }
}
