package com.example.order.model;

public enum OrderStatus {
    PENDING("Pendiente"),
    PROCESSED("Procesado"),
    SHIPPED("Enviado"),
    CANCELLED("Cancelado");

    private final String description;

    OrderStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}