package com.smartlogix.usuario.filter;

import com.smartlogix.usuario.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

/**
 * Filtro para validar JWT en cada solicitud HTTP
 *
 * Este filtro se ejecuta antes que los controladores y verifica
 * que el token sea válido. Si es válido, extrae la información
 * del usuario y la coloca en el SecurityContext para que pueda
 * ser accedida en los controladores.
 */
@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Métodos y rutas que NO requieren autenticación JWT
     */
    private static final String[] PUBLIC_PATHS = {
            "/users/login",
            "/users/register",
            "/swagger-ui",
            "/v3/api-docs",
            "/swagger-resources"
    };

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String requestPath = request.getRequestURI();

        // Omitir validación de JWT para rutas públicas
        if (isPublicPath(requestPath)) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // Extraer el token del header Authorization
            String token = extractTokenFromRequest(request);

            if (token != null && jwtUtil.isValidToken(token)) {
                // Token es válido
                Long userId = jwtUtil.getUserIdFromToken(token);
                String username = jwtUtil.getUsernameFromToken(token);

                // Crear autenticación y establecerla en el contexto de seguridad
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                username,
                                null,
                                new ArrayList<>() // Roles/Authorities vacíos por ahora
                        );

                // Guardar userId como detalle adicional
                authentication.setDetails(userId);

                SecurityContextHolder.getContext().setAuthentication(authentication);

                // Token validado correctamente
                filterChain.doFilter(request, response);
            } else {
                // Token inválido o no presente
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Token JWT inválido o expirado\"}");
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Error al procesar el token: " + e.getMessage() + "\"}");
        }
    }

    /**
     * Extrae el token del header Authorization
     * Espera formato: "Bearer <token>"
     */
    private String extractTokenFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7); // Remover "Bearer "
        }

        return null;
    }

    /**
     * Verifica si la ruta es pública (no requiere JWT)
     */
    private boolean isPublicPath(String path) {
        for (String publicPath : PUBLIC_PATHS) {
            if (path.contains(publicPath)) {
                return true;
            }
        }
        return false;
    }
}
