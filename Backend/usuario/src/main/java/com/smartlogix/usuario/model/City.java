package com.smartlogix.usuario.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "city")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class City {

    @Id
    @Column(name = "CITY_ID")
    private BigDecimal cityId;

    @ManyToOne
    @JoinColumn(name = "REGION_ID")
    private Region region;

    @Column(name = "CITY_NAME", length = 20)
    private String cityName;
}