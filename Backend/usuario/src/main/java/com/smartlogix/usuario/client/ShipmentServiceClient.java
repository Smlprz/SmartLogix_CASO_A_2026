package com.smartlogix.usuario.client;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Component
public class ShipmentServiceClient {

    private final WebClient client;

    public ShipmentServiceClient(@Qualifier("enviosClient") WebClient client) {
        this.client = client;
    }

    /** Retorna todos los envíos asociados a una orden. */
    public List<Map<String, Object>> getShipmentsByOrder(Long orderId) {
        try {
            return client.get()
                    .uri("/shipments/order/{orderId}", orderId)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                    .block();
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }
}
