package com.smartlogix.usuario.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "company_category")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompanyCategory {

    @Id
    @Column(name = "COMPANY_CATEGORY_ID")
    private BigDecimal companyCategoryId;

    @Column(name = "COMPANY_CATEGORY_NAME", length = 20)
    private String companyCategoryName;
}