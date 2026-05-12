package com.smartlogix.inventory.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "product")
@Data
public class Product {
    @Id
    @Column(name = "PRODUCT_ID")
    private Long productId;

    @Column(name = "PRODUCT_QUANTITY")
    private Integer quantity;

    @Column(name = "PRODUCT_VALUE")
    private BigDecimal value;

    @Column(name = "PRODUCT_WAREHOUSE_ID")
    private Long warehouseId;

    @Column(name = "PRODUCT_COMPANY_ID")
    private Long companyId;

    @Column(name = "PRODUCT_CATEGORY_ID")
    private Long categoryId;
}