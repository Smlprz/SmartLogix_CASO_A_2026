package com.smartlogix.usuario.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "COMPANY_USER")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompanyUser {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "company_user_id_seq")
    @SequenceGenerator(name = "company_user_id_seq", sequenceName = "company_user_id_seq", allocationSize = 1)
    @Column(name = "USER_ID")
    private Long userId;

    @ManyToOne
    @JoinColumn(name = "USER_COMPANY_ID")
    private Company company;

    @Column(name = "USERNAME", length = 20)
    private String username;

    @Column(name = "PASSWORD", length = 20)
    private String password;
}