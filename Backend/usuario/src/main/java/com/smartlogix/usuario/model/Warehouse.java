package com.smartlogix.usuario.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "warehouse")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Warehouse {

    @Id
    @Column(name = "WAREHOUSE_ID")
    private BigDecimal warehouseId;

    @ManyToOne
    @JoinColumn(name = "WAREHOUSE_CITY_ID")
    private City city;

    @ManyToOne
    @JoinColumn(name = "WAREHOUSE_REGION_ID")
    private Region region;

    @ManyToOne
    @JoinColumn(name = "WAREHOUSE_COMPANY_ID")
    private Company company;
}