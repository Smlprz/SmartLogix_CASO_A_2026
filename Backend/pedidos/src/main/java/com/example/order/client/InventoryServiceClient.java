package com.example.order.client;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Component
public class InventoryServiceClient {

    private final WebClient client;

    public InventoryServiceClient(@Qualifier("inventoryClient") WebClient client) {
        this.client = client;
    }

    /** Retorna todos los productos del inventario. */
    public List<Map<String, Object>> getAllProducts() {
        try {
            return client.get()
                    .uri("/inventory/products")
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                    .block();
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    /** Retorna un producto por ID o null si no existe. */
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

    /** Verifica si hay stock suficiente de un producto. */
    public boolean hasStock(Long productId, int requiredQuantity) {
        Map<?, ?> product = getProduct(productId);
        if (product == null) return true; // si no se puede verificar, se permite
        Object qty = product.get("quantity");
        if (qty == null) return true;
        return ((Number) qty).intValue() >= requiredQuantity;
    }
}
