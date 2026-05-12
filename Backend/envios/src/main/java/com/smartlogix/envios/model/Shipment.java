package com.smartlogix.envios.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "shipment")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Shipment {

    @Id
    @Column(name = "shipment_id")
    private Long shipmentId;

    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "shipment_warehouse")
    private Double shipmentWarehouse;

    @Column(name = "shipment_warehouse_start_location")
    private Double shipmentWarehouseStartLocation;

    @Column(name = "shipment_final_destination")
    private Double shipmentFinalDestination;

    @Column(name = "shipment_status")
    private String shipmentStatus;

    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @Column(name = "current_location")
    private String currentLocation;

    @Column(name = "delivered_date")
    private LocalDateTime deliveredDate;

    @Column(name = "destination_address", nullable = false)
    private String destinationAddress;

    @Column(name = "origin_address")
    private String originAddress;

    @Column(name = "status", nullable = false)
    private String status;

    @PrePersist
    protected void onCreate() {
        createdDate = LocalDateTime.now();
        if (status == null) status = "CREATED";
        if (shipmentStatus == null) shipmentStatus = "CREATED";
    }
}
