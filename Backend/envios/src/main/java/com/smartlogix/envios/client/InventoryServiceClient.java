package com.smartlogix.envios.client;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.Map;

@Component
public class InventoryServiceClient {

    private final WebClient client;

    public InventoryServiceClient(@Qualifier("inventoryClient") WebClient client) {
        this.client = client;
    }

    /** Retorna datos de un producto/bodega o null si no existe. */
    public Map<?, ?> getProduct(Long productId) {
        try {
            return client.get()
                    .uri("/inventory/products/{id}", productId)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
        } catch (Exception e) {
            return null;
        }
    }
}
