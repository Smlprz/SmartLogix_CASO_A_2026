package com.smartlogix.inventory.controller;

import com.smartlogix.inventory.model.Product;
import com.smartlogix.inventory.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory/products")
@Tag(name = "Inventario", description = "CRUD para administración de stock")
public class ProductController {

    @Autowired
    private ProductService service;

    @GetMapping
    @Operation(summary = "Ver lista de stock completa")
    public List<Product> getAll() { return service.findAll(); }

    @PostMapping
    @Operation(summary = "Añadir producto nuevo")
    public Product create(@Valid @RequestBody Product product) { return service.save(product); }

    @PutMapping("/{id}")
    @Operation(summary = "Modificar un producto existente")
    public ResponseEntity<Product> update(@PathVariable Long id, @RequestBody Product product) {
        return ResponseEntity.ok(service.update(id, product));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar producto del sistema")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}