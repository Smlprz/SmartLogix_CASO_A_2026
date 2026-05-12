package com.smartlogix.envios.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentResponse {

    private Long shipmentId;
    private Long orderId;
    private Double shipmentWarehouse;
    private Double shipmentWarehouseStartLocation;
    private Double shipmentFinalDestination;
    private String shipmentStatus;
    private LocalDateTime createdDate;
    private String currentLocation;
    private LocalDateTime deliveredDate;
    private String destinationAddress;
    private String originAddress;
    private String status;
}
