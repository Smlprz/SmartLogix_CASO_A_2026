package com.smartlogix.envios.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentRequest {

    @NotNull(message = "Order ID es requerido")
    private Long orderId;

    @NotBlank(message = "Dirección de destino es requerida")
    private String destinationAddress;

    private String originAddress;
    private String currentLocation;

    // Columnas reales de la DB
    private Double shipmentWarehouse;
    private Double shipmentWarehouseStartLocation;
    private Double shipmentFinalDestination;
    private String shipmentStatus;
}
