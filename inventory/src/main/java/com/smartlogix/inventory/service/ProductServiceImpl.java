package com.smartlogix.inventory.service;

import com.smartlogix.inventory.model.Product;
import com.smartlogix.inventory.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository repository;

    @Override
    public List<Product> findAll() { return repository.findAll(); }

    @Override
    public Optional<Product> findById(Long id) { return repository.findById(id); }

    @Override
    public Product save(Product product) { return repository.save(product); }

    @Override
    public void deleteById(Long id) { repository.deleteById(id); }

    @Override
    public Product update(Long id, Product details) {
        return repository.findById(id).map(p -> {
            p.setQuantity(details.getQuantity());
            p.setValue(details.getValue());
            p.setWarehouseId(details.getWarehouseId());
            return repository.save(p);
        }).orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }
}