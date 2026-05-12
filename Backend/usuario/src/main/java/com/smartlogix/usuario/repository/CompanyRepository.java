package com.smartlogix.usuario.repository;

import com.smartlogix.usuario.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;

@Repository
public interface CompanyRepository extends JpaRepository<Company, BigDecimal> {
}