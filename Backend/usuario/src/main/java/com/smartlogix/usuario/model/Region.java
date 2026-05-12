package com.smartlogix.usuario.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "region")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Region {

    @Id
    @Column(name = "REGION_ID")
    private BigDecimal regionId;

    @Column(name = "REGION_NAME", length = 20)
    private String regionName;
}