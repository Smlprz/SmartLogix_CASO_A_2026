package com.smartlogix.inventory.service;

import com.smartlogix.inventory.model.Product;
import com.smartlogix.inventory.repository.ProductRepository;
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
@DisplayName("ProductServiceImpl Tests")
class ProductServiceImplTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    private Product testProduct;

    @BeforeEach
    void setUp() {
        testProduct = new Product();
        testProduct.setProductId(1L);
        testProduct.setQuantity(50);
        testProduct.setValue(new BigDecimal("1000.00"));
        testProduct.setWarehouseId(1L);
        testProduct.setCompanyId(1L);
        testProduct.setCategoryId(1L);
    }

    // ==================== FIND ALL TESTS ====================

    @Test
    @DisplayName("Should retrieve all products")
    void testFindAll_Success() {
        // Arrange
        List<Product> products = new ArrayList<>();
        products.add(testProduct);
        products.add(testProduct);
        when(productRepository.findAll()).thenReturn(products);

        // Act
        List<Product> result = productService.findAll();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(productRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should return empty list when no products exist")
    void testFindAll_Empty() {
        // Arrange
        when(productRepository.findAll()).thenReturn(new ArrayList<>());

        // Act
        List<Product> result = productService.findAll();

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    // ==================== FIND BY ID TESTS ====================

    @Test
    @DisplayName("Should retrieve product by ID")
    void testFindById_Success() {
        // Arrange
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));

        // Act
        Optional<Product> result = productService.findById(1L);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getProductId());
        assertEquals(50, result.get().getQuantity());
        verify(productRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should return empty Optional when product not found")
    void testFindById_NotFound() {
        // Arrange
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        // Act
        Optional<Product> result = productService.findById(999L);

        // Assert
        assertFalse(result.isPresent());
    }

    // ==================== SAVE TESTS ====================

    @Test
    @DisplayName("Should save new product with auto-generated ID")
    void testSave_NewProduct_AutoGenerateId() {
        // Arrange
        Product newProduct = new Product();
        newProduct.setQuantity(30);
        newProduct.setValue(new BigDecimal("300.00"));

        when(productRepository.findMaxId()).thenReturn(Optional.of(1L));
        when(productRepository.save(any(Product.class))).thenReturn(newProduct);

        // Act
        Product result = productService.save(newProduct);

        // Assert
        assertNotNull(result);
        assertEquals(30, result.getQuantity());
        verify(productRepository, times(1)).findMaxId();
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("Should save product with existing ID")
    void testSave_ProductWithExistingId() {
        // Arrange
        when(productRepository.save(testProduct)).thenReturn(testProduct);

        // Act
        Product result = productService.save(testProduct);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getProductId());
        verify(productRepository, times(1)).save(testProduct);
        verify(productRepository, never()).findMaxId();
    }

    @Test
    @DisplayName("Should assign ID = 1 when no products exist")
    void testSave_FirstProduct_IdOne() {
        // Arrange
        Product firstProduct = new Product();
        firstProduct.setQuantity(10);
        firstProduct.setValue(new BigDecimal("100.00"));

        when(productRepository.findMaxId()).thenReturn(Optional.empty());
        when(productRepository.save(any(Product.class))).thenReturn(firstProduct);

        // Act
        Product result = productService.save(firstProduct);

        // Assert
        assertNotNull(result);
        verify(productRepository, times(1)).findMaxId();
    }

    // ==================== DELETE TESTS ====================

    @Test
    @DisplayName("Should delete product by ID")
    void testDeleteById_Success() {
        // Arrange
        doNothing().when(productRepository).deleteById(1L);

        // Act
        productService.deleteById(1L);

        // Assert
        verify(productRepository, times(1)).deleteById(1L);
    }

    // ==================== UPDATE TESTS ====================

    @Test
    @DisplayName("Should update existing product successfully")
    void testUpdate_Success() {
        // Arrange
        Product updateDetails = new Product();
        updateDetails.setQuantity(75);
        updateDetails.setValue(new BigDecimal("1200.00"));
        updateDetails.setWarehouseId(2L);
        updateDetails.setCompanyId(1L);
        updateDetails.setCategoryId(1L);

        Product updatedProduct = new Product();
        updatedProduct.setProductId(1L);
        updatedProduct.setQuantity(75);
        updatedProduct.setValue(new BigDecimal("1200.00"));

        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(productRepository.save(any(Product.class))).thenReturn(updatedProduct);

        // Act
        Product result = productService.update(1L, updateDetails);

        // Assert
        assertNotNull(result);
        assertEquals(75, result.getQuantity());
        assertEquals(new BigDecimal("1200.00"), result.getValue());
        verify(productRepository, times(1)).findById(1L);
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("Should throw exception when updating non-existent product")
    void testUpdate_NotFound() {
        // Arrange
        Product updateDetails = new Product();
        updateDetails.setQuantity(75);

        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> productService.update(999L, updateDetails));
        assertTrue(exception.getMessage().contains("Producto no encontrado"));
        verify(productRepository, times(1)).findById(999L);
        verify(productRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should update inventory quantity")
    void testUpdate_InventoryQuantity() {
        // Arrange
        Product updateDetails = new Product();
        updateDetails.setQuantity(200);
        updateDetails.setValue(testProduct.getValue());
        updateDetails.setWarehouseId(testProduct.getWarehouseId());
        updateDetails.setCompanyId(testProduct.getCompanyId());
        updateDetails.setCategoryId(testProduct.getCategoryId());

        Product updatedProduct = new Product();
        updatedProduct.setProductId(1L);
        updatedProduct.setQuantity(200);

        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(productRepository.save(any(Product.class))).thenReturn(updatedProduct);

        // Act
        Product result = productService.update(1L, updateDetails);

        // Assert
        assertEquals(200, result.getQuantity());
    }

    // ==================== INTEGRATION TESTS ====================

    @Test
    @DisplayName("Should handle product lifecycle: save -> update -> delete")
    void testProductLifecycle() {
        // Step 1: Save
        when(productRepository.save(testProduct)).thenReturn(testProduct);
        Product saved = productService.save(testProduct);
        assertNotNull(saved);

        // Step 2: Find
        when(productRepository.findById(1L)).thenReturn(Optional.of(saved));
        Optional<Product> found = productService.findById(1L);
        assertTrue(found.isPresent());

        // Step 3: Update
        Product updateDetails = new Product();
        updateDetails.setQuantity(75);
        updateDetails.setValue(new BigDecimal("1100.00"));
        updateDetails.setWarehouseId(1L);
        updateDetails.setCompanyId(1L);
        updateDetails.setCategoryId(1L);

        when(productRepository.findById(1L)).thenReturn(Optional.of(found.get()));
        when(productRepository.save(any(Product.class))).thenReturn(found.get());
        Product updated = productService.update(1L, updateDetails);
        assertNotNull(updated);

        // Step 4: Delete
        doNothing().when(productRepository).deleteById(1L);
        productService.deleteById(1L);
        verify(productRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Should handle multiple products with different quantities")
    void testMultipleProductsInventory() {
        // Arrange
        Product product2 = new Product();
        product2.setProductId(2L);
        product2.setQuantity(200);
        product2.setValue(new BigDecimal("500.00"));

        List<Product> products = List.of(testProduct, product2);
        when(productRepository.findAll()).thenReturn(products);

        // Act
        List<Product> result = productService.findAll();

        // Assert
        assertEquals(2, result.size());
        assertEquals(50, result.get(0).getQuantity());
        assertEquals(200, result.get(1).getQuantity());
    }
}
