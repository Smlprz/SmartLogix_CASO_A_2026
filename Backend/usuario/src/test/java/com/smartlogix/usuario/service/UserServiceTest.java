package com.smartlogix.usuario.service;

import com.smartlogix.usuario.dto.LoginRequest;
import com.smartlogix.usuario.dto.LoginResponse;
import com.smartlogix.usuario.model.Company;
import com.smartlogix.usuario.model.CompanyUser;
import com.smartlogix.usuario.repository.CompanyRepository;
import com.smartlogix.usuario.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserService Tests")
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private CompanyRepository companyRepository;

    @InjectMocks
    private UserService userService;

    private CompanyUser testUser;
    private Company testCompany;

    @BeforeEach
    void setUp() {
        // Setup test company
        testCompany = new Company();
        testCompany.setIdCompany(BigDecimal.ONE);
        testCompany.setCompanyName("Test Company");

        // Setup test user
        testUser = new CompanyUser();
        testUser.setUserId(1L);
        testUser.setUsername("testuser");
        testUser.setPassword("password123");
        testUser.setCompany(testCompany);
    }

    // ==================== LOGIN TESTS ====================

    @Test
    @DisplayName("Should login successfully with correct credentials")
    void testLogin_Success() {
        // Arrange
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("password123");

        when(userRepository.findByUsernameAndPassword("testuser", "password123"))
                .thenReturn(Optional.of(testUser));

        // Act
        LoginResponse response = userService.login(loginRequest);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getUserId());
        assertEquals("testuser", response.getUsername());
        assertEquals("Test Company", response.getCompanyName());
        assertEquals("Login exitoso", response.getMessage());
        verify(userRepository, times(1)).findByUsernameAndPassword("testuser", "password123");
    }

    @Test
    @DisplayName("Should fail login with incorrect password")
    void testLogin_IncorrectPassword() {
        // Arrange
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("wrongpassword");

        when(userRepository.findByUsernameAndPassword("testuser", "wrongpassword"))
                .thenReturn(Optional.empty());

        // Act
        LoginResponse response = userService.login(loginRequest);

        // Assert
        assertNotNull(response);
        assertNull(response.getUserId());
        assertNull(response.getUsername());
        assertEquals("Usuario o contraseña incorrectos", response.getMessage());
    }

    @Test
    @DisplayName("Should fail login with non-existent username")
    void testLogin_NonExistentUsername() {
        // Arrange
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("nonexistent");
        loginRequest.setPassword("password123");

        when(userRepository.findByUsernameAndPassword("nonexistent", "password123"))
                .thenReturn(Optional.empty());

        // Act
        LoginResponse response = userService.login(loginRequest);

        // Assert
        assertNotNull(response);
        assertNull(response.getUserId());
        assertEquals("Usuario o contraseña incorrectos", response.getMessage());
    }

    @Test
    @DisplayName("Should login user without company")
    void testLogin_UserWithoutCompany() {
        // Arrange
        CompanyUser userNoCompany = new CompanyUser();
        userNoCompany.setUserId(2L);
        userNoCompany.setUsername("nocompanyuser");
        userNoCompany.setPassword("password123");
        userNoCompany.setCompany(null);

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("nocompanyuser");
        loginRequest.setPassword("password123");

        when(userRepository.findByUsernameAndPassword("nocompanyuser", "password123"))
                .thenReturn(Optional.of(userNoCompany));

        // Act
        LoginResponse response = userService.login(loginRequest);

        // Assert
        assertNotNull(response);
        assertEquals(2L, response.getUserId());
        assertNull(response.getCompanyId());
        assertNull(response.getCompanyName());
        assertEquals("Login exitoso", response.getMessage());
    }

    // ==================== GET ALL USERS TESTS ====================

    @Test
    @DisplayName("Should retrieve all users")
    void testGetAllUsers_Success() {
        // Arrange
        List<CompanyUser> users = new ArrayList<>();
        users.add(testUser);
        users.add(testUser);
        when(userRepository.findAll()).thenReturn(users);

        // Act
        List<CompanyUser> result = userService.getAllUsers();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should return empty list when no users exist")
    void testGetAllUsers_Empty() {
        // Arrange
        when(userRepository.findAll()).thenReturn(new ArrayList<>());

        // Act
        List<CompanyUser> result = userService.getAllUsers();

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    // ==================== GET USER BY ID TESTS ====================

    @Test
    @DisplayName("Should retrieve user by ID")
    void testGetUserById_Success() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // Act
        CompanyUser result = userService.getUserById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getUserId());
        assertEquals("testuser", result.getUsername());
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should return null when user not found by ID")
    void testGetUserById_NotFound() {
        // Arrange
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // Act
        CompanyUser result = userService.getUserById(999L);

        // Assert
        assertNull(result);
        verify(userRepository, times(1)).findById(999L);
    }

    // ==================== GET USER BY USERNAME TESTS ====================

    @Test
    @DisplayName("Should retrieve user by username")
    void testGetUserByUsername_Success() {
        // Arrange
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        // Act
        CompanyUser result = userService.getUserByUsername("testuser");

        // Assert
        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
        verify(userRepository, times(1)).findByUsername("testuser");
    }

    @Test
    @DisplayName("Should return null when user not found by username")
    void testGetUserByUsername_NotFound() {
        // Arrange
        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        // Act
        CompanyUser result = userService.getUserByUsername("nonexistent");

        // Assert
        assertNull(result);
    }

    // ==================== SAVE USER TESTS ====================

    @Test
    @DisplayName("Should save new user successfully")
    void testSaveUser_NewUser_Success() {
        // Arrange
        CompanyUser newUser = new CompanyUser();
        newUser.setUsername("newuser");
        newUser.setPassword("password123");
        newUser.setCompany(testCompany);

        when(companyRepository.findById(BigDecimal.ONE)).thenReturn(Optional.of(testCompany));
        when(userRepository.save(any(CompanyUser.class))).thenReturn(testUser);

        // Act
        CompanyUser result = userService.saveUser(newUser);

        // Assert
        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
        verify(companyRepository, times(1)).findById(BigDecimal.ONE);
        verify(userRepository, times(1)).save(any(CompanyUser.class));
    }

    @Test
    @DisplayName("Should update existing user")
    void testSaveUser_UpdateUser_Success() {
        // Arrange
        testUser.setPassword("newpassword");

        when(companyRepository.findById(BigDecimal.ONE)).thenReturn(Optional.of(testCompany));
        when(userRepository.save(testUser)).thenReturn(testUser);

        // Act
        CompanyUser result = userService.saveUser(testUser);

        // Assert
        assertNotNull(result);
        assertEquals("newpassword", result.getPassword());
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    @DisplayName("Should save user without company")
    void testSaveUser_UserWithoutCompany_Success() {
        // Arrange
        CompanyUser userNoCompany = new CompanyUser();
        userNoCompany.setUsername("nocompanyuser");
        userNoCompany.setPassword("password123");
        userNoCompany.setCompany(null);

        when(userRepository.save(userNoCompany)).thenReturn(userNoCompany);

        // Act
        CompanyUser result = userService.saveUser(userNoCompany);

        // Assert
        assertNotNull(result);
        assertNull(result.getCompany());
        verify(userRepository, times(1)).save(userNoCompany);
    }

    // ==================== DELETE USER TESTS ====================

    @Test
    @DisplayName("Should delete user by ID")
    void testDeleteUser_Success() {
        // Arrange
        doNothing().when(userRepository).deleteById(1L);

        // Act
        userService.deleteUser(1L);

        // Assert
        verify(userRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Should handle delete of non-existent user")
    void testDeleteUser_NonExistent() {
        // Arrange
        doNothing().when(userRepository).deleteById(999L);

        // Act
        userService.deleteUser(999L);

        // Assert
        verify(userRepository, times(1)).deleteById(999L);
    }
}
