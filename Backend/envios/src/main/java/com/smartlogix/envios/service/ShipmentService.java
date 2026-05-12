package com.smartlogix.envios.service;

import com.smartlogix.envios.client.OrderServiceClient;
import com.smartlogix.envios.dto.ShipmentRequest;
import com.smartlogix.envios.dto.ShipmentResponse;
import com.smartlogix.envios.model.Shipment;
import com.smartlogix.envios.repository.ShipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShipmentService {

    @Autowired
    private ShipmentRepository shipmentRepository;

    @Autowired
    private OrderServiceClient orderServiceClient;

    public ShipmentResponse createShipment(ShipmentRequest request) {
        // Validar que la orden exista en el servicio de pedidos
        if (!orderServiceClient.orderExists(request.getOrderId())) {
            throw new RuntimeException("La orden #" + request.getOrderId() + " no existe en el sistema de pedidos.");
        }

        Shipment shipment = new Shipment();
        Long nextId = shipmentRepository.findMaxId().orElse(0L) + 1;
        shipment.setShipmentId(nextId);

        shipment.setOrderId(request.getOrderId());
        shipment.setDestinationAddress(request.getDestinationAddress());
        shipment.setOriginAddress(request.getOriginAddress());
        shipment.setCurrentLocation(request.getCurrentLocation());
        shipment.setShipmentWarehouse(request.getShipmentWarehouse());
        shipment.setShipmentWarehouseStartLocation(request.getShipmentWarehouseStartLocation());
        shipment.setShipmentFinalDestination(request.getShipmentFinalDestination());
        shipment.setStatus("CREATED");
        shipment.setShipmentStatus(request.getShipmentStatus() != null ? request.getShipmentStatus() : "CREATED");

        return convertToResponse(shipmentRepository.save(shipment));
    }

    public List<ShipmentResponse> getAllShipments() {
        return shipmentRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public ShipmentResponse getShipmentById(Long id) {
        Shipment shipment = shipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shipment no encontrado: " + id));
        return convertToResponse(shipment);
    }

    public List<ShipmentResponse> getShipmentsByOrderId(Long orderId) {
        return shipmentRepository.findByOrderId(orderId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<ShipmentResponse> getShipmentsByStatus(String status) {
        return shipmentRepository.findByStatus(status).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public ShipmentResponse updateShipment(Long id, ShipmentRequest request) {
        Shipment shipment = shipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shipment no encontrado: " + id));

        shipment.setOrderId(request.getOrderId());
        shipment.setDestinationAddress(request.getDestinationAddress());
        shipment.setOriginAddress(request.getOriginAddress());
        shipment.setCurrentLocation(request.getCurrentLocation());
        shipment.setShipmentWarehouse(request.getShipmentWarehouse());
        shipment.setShipmentWarehouseStartLocation(request.getShipmentWarehouseStartLocation());
        shipment.setShipmentFinalDestination(request.getShipmentFinalDestination());
        if (request.getShipmentStatus() != null) shipment.setShipmentStatus(request.getShipmentStatus());

        return convertToResponse(shipmentRepository.save(shipment));
    }

    public ShipmentResponse updateShipmentStatus(Long id, String newStatus) {
        Shipment shipment = shipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shipment no encontrado: " + id));

        shipment.setStatus(newStatus.toUpperCase());
        shipment.setShipmentStatus(newStatus.toUpperCase());
        if ("DELIVERED".equals(newStatus.toUpperCase())) {
            shipment.setDeliveredDate(LocalDateTime.now());
        }

        return convertToResponse(shipmentRepository.save(shipment));
    }

    public void deleteShipment(Long id) {
        if (!shipmentRepository.existsById(id)) {
            throw new RuntimeException("Shipment no encontrado: " + id);
        }
        shipmentRepository.deleteById(id);
    }

    private ShipmentResponse convertToResponse(Shipment s) {
        return new ShipmentResponse(
                s.getShipmentId(), s.getOrderId(),
                s.getShipmentWarehouse(), s.getShipmentWarehouseStartLocation(),
                s.getShipmentFinalDestination(), s.getShipmentStatus(),
                s.getCreatedDate(), s.getCurrentLocation(),
                s.getDeliveredDate(), s.getDestinationAddress(),
                s.getOriginAddress(), s.getStatus()
        );
    }
}
