package com.example.order.dto;

import jakarta.validation.constraints.*;

public class OrderItemRequest {

    private String productId;

    @NotBlank(message = "Product name is required")
    private String productName;

    @Positive(message = "Quantity must be positive")
    private Integer quantity;

    @Positive(message = "Price must be positive")
    private Double unitPrice;

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(Double unitPrice) { this.unitPrice = unitPrice; }
}