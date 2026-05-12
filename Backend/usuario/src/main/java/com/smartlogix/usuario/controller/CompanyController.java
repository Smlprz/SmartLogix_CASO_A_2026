package com.smartlogix.usuario.controller;

import com.smartlogix.usuario.model.Company;
import com.smartlogix.usuario.service.CompanyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/companies")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Empresas", description = "Endpoints para gestión de empresas")
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    @GetMapping
    @Operation(summary = "Listar todas las empresas", description = "Retorna la lista completa de empresas")
    public ResponseEntity<List<Company>> getAllCompanies() {
        List<Company> companies = companyService.getAllCompanies();
        return ResponseEntity.ok(companies);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener empresa por ID", description = "Retorna una empresa específica según su ID")
    public ResponseEntity<Company> getCompanyById(@PathVariable BigDecimal id) {
        Company company = companyService.getCompanyById(id);
        if (company != null) {
            return ResponseEntity.ok(company);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    @Operation(summary = "Crear nueva empresa", description = "Crea una nueva empresa en el sistema")
    public ResponseEntity<Company> createCompany(@RequestBody Company company) {
        Company savedCompany = companyService.saveCompany(company);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCompany);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar empresa", description = "Actualiza la información de una empresa existente")
    public ResponseEntity<Company> updateCompany(@PathVariable BigDecimal id, @RequestBody Company company) {
        company.setIdCompany(id);
        Company updatedCompany = companyService.saveCompany(company);
        return ResponseEntity.ok(updatedCompany);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar empresa", description = "Elimina una empresa del sistema")
    public ResponseEntity<Void> deleteCompany(@PathVariable BigDecimal id) {
        companyService.deleteCompany(id);
        return ResponseEntity.noContent().build();
    }
}