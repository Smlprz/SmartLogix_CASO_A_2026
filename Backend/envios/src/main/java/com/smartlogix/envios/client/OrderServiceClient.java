package com.smartlogix.envios.client;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.Map;

@Component
public class OrderServiceClient {

    private final WebClient client;

    public OrderServiceClient(@Qualifier("pedidosClient") WebClient client) {
        this.client = client;
    }

    /** Verifica que la orden exista. Retorna true si existe, false si no. */
    public boolean orderExists(Long orderId) {
        try {
            client.get()
                    .uri("/orders/{id}", orderId)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /** Retorna datos básicos de la orden o null si no existe. */
    public Map<?, ?> getOrder(Long orderId) {
        try {
            return client.get()
                    .uri("/orders/{id}", orderId)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
        } catch (Exception e) {
            return null;
        }
    }
}
