package com.smartlogix.usuario.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Solicitud de login")
public class LoginRequest {

    @Schema(description = "Nombre de usuario", example = "admin", required = true)
    private String username;

    @Schema(description = "Contraseña", example = "admin123", required = true)
    private String password;
}