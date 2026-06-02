package com.smartlogix.usuario.service;

import com.smartlogix.usuario.dto.LoginRequest;
import com.smartlogix.usuario.dto.LoginResponse;
import com.smartlogix.usuario.model.Company;
import com.smartlogix.usuario.model.CompanyUser;
import com.smartlogix.usuario.repository.CompanyRepository;
import com.smartlogix.usuario.repository.UserRepository;
import com.smartlogix.usuario.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Tests para la funcionalidad de Login con JWT
 *
 * Verifica que:
 * - El login exitoso genera un token JWT válido
 * - El token contiene la información correcta del usuario
 * - Los credenciales incorrectos no generan token
 */
@ExtendWith(MockitoExtension.class)
public class UserServiceJwtTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private CompanyRepository companyRepository;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private UserService userService;

    private CompanyUser testUser;
    private LoginRequest loginRequest;
    private String generatedToken;

    @BeforeEach
    void setUp() {
        // Preparar datos de prueba
        testUser = new CompanyUser();
        testUser.setUserId(1L);
        testUser.setUsername("juan");
        testUser.setPassword("password123");

        Company testCompany = new Company();
        testCompany.setIdCompany(new BigDecimal(1));
        testCompany.setCompanyName("SmartLogix");
        testUser.setCompany(testCompany);

        loginRequest = new LoginRequest();
        loginRequest.setUsername("juan");
        loginRequest.setPassword("password123");

        // Token de prueba
        generatedToken = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqdWFuIiwidXNlcklkIjoxLCJpYXQiOjE2ODAwMDAwMDAsImV4cCI6MTY4MDA4NjQwMH0.test";
    }

    @Test
    void testLoginSuccessfulGeneratesToken() {
        // Arrange
        when(userRepository.findByUsernameAndPassword("juan", "password123"))
                .thenReturn(Optional.of(testUser));
        when(jwtUtil.generateToken(1L, "juan"))
                .thenReturn(generatedToken);

        // Act
        LoginResponse response = userService.login(loginRequest);

        // Assert
        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals(1L, response.getUserId());
        assertEquals("juan", response.getUsername());
        assertEquals(1L, response.getCompanyId());
        assertEquals("SmartLogix", response.getCompanyName());
        assertEquals(generatedToken, response.getToken());
        assertEquals("Login exitoso", response.getMessage());

        // Verify que generateToken fue llamado
        verify(jwtUtil, times(1)).generateToken(1L, "juan");
    }

    @Test
    void testLoginWithIncorrectPassword() {
        // Arrange
        when(userRepository.findByUsernameAndPassword("juan", "wrongpassword"))
                .thenReturn(Optional.empty());

        LoginRequest wrongPasswordRequest = new LoginRequest();
        wrongPasswordRequest.setUsername("juan");
        wrongPasswordRequest.setPassword("wrongpassword");

        // Act
        LoginResponse response = userService.login(wrongPasswordRequest);

        // Assert
        assertNull(response.getUserId());
        assertNull(response.getUsername());
        assertNull(response.getCompanyId());
        assertNull(response.getCompanyName());
        assertNull(response.getToken());
        assertEquals("Usuario o contraseña incorrectos", response.getMessage());

        // Verify que generateToken NO fue llamado
        verify(jwtUtil, never()).generateToken(anyLong(), anyString());
    }

    @Test
    void testLoginWithNonExistentUser() {
        // Arrange
        when(userRepository.findByUsernameAndPassword("nonexistent", "password123"))
                .thenReturn(Optional.empty());

        LoginRequest nonExistentRequest = new LoginRequest();
        nonExistentRequest.setUsername("nonexistent");
        nonExistentRequest.setPassword("password123");

        // Act
        LoginResponse response = userService.login(nonExistentRequest);

        // Assert
        assertNull(response.getUserId());
        assertNull(response.getToken());
        assertEquals("Usuario o contraseña incorrectos", response.getMessage());

        // Verify que generateToken NO fue llamado
        verify(jwtUtil, never()).generateToken(anyLong(), anyString());
    }

    @Test
    void testLoginWithoutCompany() {
        // Arrange
        CompanyUser userWithoutCompany = new CompanyUser();
        userWithoutCompany.setUserId(2L);
        userWithoutCompany.setUsername("maria");
        userWithoutCompany.setPassword("password123");
        userWithoutCompany.setCompany(null);

        when(userRepository.findByUsernameAndPassword("maria", "password123"))
                .thenReturn(Optional.of(userWithoutCompany));
        when(jwtUtil.generateToken(2L, "maria"))
                .thenReturn(generatedToken);

        LoginRequest mariasRequest = new LoginRequest();
        mariasRequest.setUsername("maria");
        mariasRequest.setPassword("password123");

        // Act
        LoginResponse response = userService.login(mariasRequest);

        // Assert
        assertNotNull(response);
        assertEquals(2L, response.getUserId());
        assertEquals("maria", response.getUsername());
        assertNull(response.getCompanyId());
        assertNull(response.getCompanyName());
        assertNotNull(response.getToken());
        assertEquals(generatedToken, response.getToken());
    }

    @Test
    void testTokenIsGeneratedOnlyAfterSuccessfulAuthentication() {
        // Arrange
        when(userRepository.findByUsernameAndPassword("juan", "password123"))
                .thenReturn(Optional.of(testUser));
        when(jwtUtil.generateToken(1L, "juan"))
                .thenReturn(generatedToken);

        // Act
        userService.login(loginRequest);

        // Assert - Verificar que generateToken fue llamado exactamente una vez
        verify(jwtUtil, times(1)).generateToken(1L, "juan");

        // Act - Login fallido
        loginRequest.setPassword("wrongpassword");
        when(userRepository.findByUsernameAndPassword("juan", "wrongpassword"))
                .thenReturn(Optional.empty());

        userService.login(loginRequest);

        // Assert - Verificar que generateToken NO se llamó nuevamente
        verify(jwtUtil, times(1)).generateToken(anyLong(), anyString());
    }
}
