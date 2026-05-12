package com.smartlogix.envios.model;

public enum ShipmentStatus {
    CREATED("Creado"),
    IN_TRANSIT("En Tránsito"),
    DELIVERED("Entregado");

    private final String displayName;

    ShipmentStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
