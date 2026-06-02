package com.smartlogix.usuario.service;

import com.smartlogix.usuario.dto.LoginRequest;
import com.smartlogix.usuario.dto.LoginResponse;
import com.smartlogix.usuario.model.Company;
import com.smartlogix.usuario.model.CompanyUser;
import com.smartlogix.usuario.repository.CompanyRepository;
import com.smartlogix.usuario.repository.UserRepository;
import com.smartlogix.usuario.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Autentica un usuario y genera un JWT si las credenciales son válidas
     *
     * @param loginRequest Contiene username y password
     * @return LoginResponse con token JWT si es exitoso, sin token si falla
     */
    public LoginResponse login(LoginRequest loginRequest) {
        CompanyUser user = userRepository.findByUsernameAndPassword(
                loginRequest.getUsername(),
                loginRequest.getPassword()
        ).orElse(null);

        if (user != null) {
            // Generar JWT con información del usuario
            String token = jwtUtil.generateToken(user.getUserId(), user.getUsername());

            return new LoginResponse(
                    user.getUserId(),
                    user.getUsername(),
                    user.getCompany() != null ? user.getCompany().getIdCompany().longValue() : null,
                    user.getCompany() != null ? user.getCompany().getCompanyName() : null,
                    token,  // Token JWT
                    "Login exitoso"
            );
        } else {
            return new LoginResponse(null, null, null, null, null, "Usuario o contraseña incorrectos");
        }
    }

    public List<CompanyUser> getAllUsers() {
        return userRepository.findAll();
    }

    public CompanyUser getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public CompanyUser getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    public CompanyUser saveUser(CompanyUser user) {
        // Si viene una company con ID, cargar la entidad real desde la DB
        // para evitar TransientPropertyValueException
        if (user.getCompany() != null && user.getCompany().getIdCompany() != null) {
            BigDecimal companyId = user.getCompany().getIdCompany();
            Company managedCompany = companyRepository.findById(companyId)
                    .orElse(null);
            user.setCompany(managedCompany);
        } else {
            // Si no tiene idCompany, no intentar persistir una entidad transiente
            user.setCompany(null);
        }
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
