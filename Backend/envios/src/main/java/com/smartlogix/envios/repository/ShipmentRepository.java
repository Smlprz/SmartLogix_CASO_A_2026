package com.smartlogix.envios.repository;

import com.smartlogix.envios.model.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, Long> {

    List<Shipment> findByOrderId(Long orderId);

    List<Shipment> findByStatus(String status);

    @Query("SELECT MAX(s.shipmentId) FROM Shipment s")
    Optional<Long> findMaxId();
}
