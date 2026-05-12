package com.smartlogix.inventory.client;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Component
public class UserServiceClient {

    private final WebClient client;

    public UserServiceClient(@Qualifier("usuarioClient") WebClient client) {
        this.client = client;
    }

    /** Retorna todos los usuarios/empresas. */
    public List<Map<String, Object>> getAllUsers() {
        try {
            return client.get()
                    .uri("/users")
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                    .block();
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    /** Verifica que una empresa (companyId) tenga usuarios registrados. */
    public boolean companyHasUsers(Long companyId) {
        try {
            List<Map<String, Object>> users = getAllUsers();
            return users.stream().anyMatch(u -> {
                Object comp = u.get("company");
                if (comp instanceof Map<?, ?> m) {
                    Object id = m.get("idCompany");
                    return id != null && ((Number) id).longValue() == companyId;
                }
                return false;
            });
        } catch (Exception e) {
            return true; // si no se puede verificar, se permite
        }
    }
}
