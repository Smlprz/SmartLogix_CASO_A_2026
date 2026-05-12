package com.smartlogix.usuario.repository;

import com.smartlogix.usuario.model.CompanyUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<CompanyUser, Long> {

    Optional<CompanyUser> findByUsername(String username);

    @Query("SELECT u FROM CompanyUser u WHERE u.username = :username AND u.password = :password")
    Optional<CompanyUser> findByUsernameAndPassword(@Param("username") String username, @Param("password") String password);

    boolean existsByUsername(String username);
}