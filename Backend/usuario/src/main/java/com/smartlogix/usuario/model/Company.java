package com.smartlogix.usuario.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "company")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Company {

    @Id
    @Column(name = "ID_COMPANY")
    private BigDecimal idCompany;

    @Column(name = "COMPANY_NAME", length = 30)
    private String companyName;

    @ManyToOne
    @JoinColumn(name = "COMPANY_CITY_ID")
    private City city;

    @ManyToOne
    @JoinColumn(name = "COMPANY_REGION_ID")
    private Region region;

    @ManyToOne
    @JoinColumn(name = "COMPANY_CATEGORY_ID")
    private CompanyCategory companyCategory;

    @Column(name = "COMPANY_CONTRACT_START")
    private LocalDate contractStart;
}