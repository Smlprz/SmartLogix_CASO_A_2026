package com.smartlogix.usuario.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@Schema(description = "Respuesta de login con token JWT")
public class LoginResponse {
    @Schema(description = "ID del usuario", example = "1")
    private Long userId;

    @Schema(description = "Nombre de usuario", example = "admin")
    private String username;

    @Schema(description = "ID de la compañía", example = "1")
    private Long companyId;

    @Schema(description = "Nombre de la compañía", example = "SmartLogix")
    private String companyName;

    @Schema(description = "Token JWT para autenticación", example = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...")
    private String token;

    @Schema(description = "Mensaje de respuesta", example = "Login exitoso")
    private String message;
}