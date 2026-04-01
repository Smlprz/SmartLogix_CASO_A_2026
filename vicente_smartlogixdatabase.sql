-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mysql-vicente.alwaysdata.net
-- Generation Time: Apr 01, 2026 at 05:03 PM
-- Server version: 11.4.9-MariaDB
-- PHP Version: 8.4.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vicente_smartlogixdatabase`
--

-- --------------------------------------------------------

--
-- Table structure for table `city`
--

CREATE TABLE `city` (
  `CITY_ID` decimal(3,0) NOT NULL,
  `REGION_ID` decimal(3,0) DEFAULT NULL,
  `CITY_NAME` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `company`
--

CREATE TABLE `company` (
  `ID_COMPANY` decimal(3,0) NOT NULL,
  `COMPANY_NAME` varchar(30) DEFAULT NULL,
  `COMPANY_CITY_ID` decimal(3,0) DEFAULT NULL,
  `COMPANY_REGION_ID` decimal(3,0) DEFAULT NULL,
  `COMPANY_CATEGORY_ID` decimal(3,0) DEFAULT NULL,
  `COMPANY_CONTRACT_START` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `company_category`
--

CREATE TABLE `company_category` (
  `COMPANY_CATEGORY_ID` decimal(3,0) NOT NULL,
  `COMPANY_CATEGORY_NAME` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `COMPANY_USER`
--

CREATE TABLE `COMPANY_USER` (
  `USER_ID` decimal(6,0) NOT NULL,
  `USER_COMPANY_ID` decimal(3,0) DEFAULT NULL,
  `USERNAME` varchar(20) DEFAULT NULL,
  `PASSWORD` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `PRODUCT_ID` decimal(5,0) NOT NULL,
  `PRODUCT_CATEGORY_ID` decimal(3,0) DEFAULT NULL,
  `PRODUCT_QUANTITY` decimal(6,0) DEFAULT NULL,
  `PRODUCT_VALUE` decimal(11,0) DEFAULT NULL,
  `PRODUCT_WAREHOUSE_ID` decimal(4,0) DEFAULT NULL,
  `PRODUCT_COMPANY_ID` decimal(3,0) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_category`
--

CREATE TABLE `product_category` (
  `PRODUCT_CATEGORY_ID` decimal(3,0) NOT NULL,
  `PRODUCT_CATEGORY_NAME` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_order`
--

CREATE TABLE `product_order` (
  `PRODUCT_ID` decimal(5,0) DEFAULT NULL,
  `ORDER_ID` decimal(5,0) DEFAULT NULL,
  `PRODUCT_VALUE` decimal(12,0) DEFAULT NULL,
  `PRODUCT_ORDER_QUANTITY` decimal(4,0) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `region`
--

CREATE TABLE `region` (
  `REGION_ID` decimal(3,0) NOT NULL,
  `REGION_NAME` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shipment`
--

CREATE TABLE `shipment` (
  `SHIPMENT_ID` decimal(6,0) NOT NULL,
  `ORDER_ID` decimal(5,0) DEFAULT NULL,
  `SHIPMENT_WAREHOUSE` decimal(4,0) DEFAULT NULL,
  `SHIPMENT_WAREHOUSE_START_LOCATION` decimal(3,0) DEFAULT NULL,
  `SHIPMENT_FINAL_DESTINATION` decimal(3,0) DEFAULT NULL,
  `SHIPMENT_STATUS` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shipment_order`
--

CREATE TABLE `shipment_order` (
  `ORDER_ID` decimal(5,0) NOT NULL,
  `ORDER_VALUE` decimal(12,0) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `warehouse`
--

CREATE TABLE `warehouse` (
  `WAREHOUSE_ID` decimal(4,0) NOT NULL,
  `WAREHOUSE_CITY_ID` decimal(3,0) DEFAULT NULL,
  `WAREHOUSE_REGION_ID` decimal(3,0) DEFAULT NULL,
  `WAREHOUSE_COMPANY_ID` decimal(3,0) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `city`
--
ALTER TABLE `city`
  ADD PRIMARY KEY (`CITY_ID`),
  ADD KEY `REGION_ID` (`REGION_ID`);

--
-- Indexes for table `company`
--
ALTER TABLE `company`
  ADD PRIMARY KEY (`ID_COMPANY`),
  ADD KEY `COMPANY_CATEGORY_ID` (`COMPANY_CATEGORY_ID`),
  ADD KEY `COMPANY_CITY_ID` (`COMPANY_CITY_ID`),
  ADD KEY `COMPANY_REGION_ID` (`COMPANY_REGION_ID`);

--
-- Indexes for table `company_category`
--
ALTER TABLE `company_category`
  ADD PRIMARY KEY (`COMPANY_CATEGORY_ID`);

--
-- Indexes for table `COMPANY_USER`
--
ALTER TABLE `COMPANY_USER`
  ADD PRIMARY KEY (`USER_ID`),
  ADD KEY `fk_customer` (`USER_COMPANY_ID`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`PRODUCT_ID`),
  ADD KEY `PRODUCT_CATEGORY_ID` (`PRODUCT_CATEGORY_ID`),
  ADD KEY `PRODUCT_WAREHOUSE_ID` (`PRODUCT_WAREHOUSE_ID`),
  ADD KEY `PRODUCT_COMPANY_ID` (`PRODUCT_COMPANY_ID`);

--
-- Indexes for table `product_category`
--
ALTER TABLE `product_category`
  ADD PRIMARY KEY (`PRODUCT_CATEGORY_ID`);

--
-- Indexes for table `product_order`
--
ALTER TABLE `product_order`
  ADD KEY `PRODUCT_ID` (`PRODUCT_ID`),
  ADD KEY `ORDER_ID` (`ORDER_ID`);

--
-- Indexes for table `region`
--
ALTER TABLE `region`
  ADD PRIMARY KEY (`REGION_ID`);

--
-- Indexes for table `shipment`
--
ALTER TABLE `shipment`
  ADD PRIMARY KEY (`SHIPMENT_ID`),
  ADD KEY `ORDER_ID` (`ORDER_ID`),
  ADD KEY `SHIPMENT_WAREHOUSE` (`SHIPMENT_WAREHOUSE`),
  ADD KEY `SHIPMENT_WAREHOUSE_START_LOCATION` (`SHIPMENT_WAREHOUSE_START_LOCATION`),
  ADD KEY `SHIPMENT_FINAL_DESTINATION` (`SHIPMENT_FINAL_DESTINATION`);

--
-- Indexes for table `shipment_order`
--
ALTER TABLE `shipment_order`
  ADD PRIMARY KEY (`ORDER_ID`);

--
-- Indexes for table `warehouse`
--
ALTER TABLE `warehouse`
  ADD PRIMARY KEY (`WAREHOUSE_ID`),
  ADD KEY `WAREHOUSE_CITY_ID` (`WAREHOUSE_CITY_ID`),
  ADD KEY `WAREHOUSE_REGION_ID` (`WAREHOUSE_REGION_ID`),
  ADD KEY `WAREHOUSE_COMPANY_ID` (`WAREHOUSE_COMPANY_ID`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `city`
--
ALTER TABLE `city`
  ADD CONSTRAINT `city_ibfk_1` FOREIGN KEY (`REGION_ID`) REFERENCES `region` (`REGION_ID`);

--
-- Constraints for table `company`
--
ALTER TABLE `company`
  ADD CONSTRAINT `company_ibfk_1` FOREIGN KEY (`COMPANY_CATEGORY_ID`) REFERENCES `company_category` (`COMPANY_CATEGORY_ID`),
  ADD CONSTRAINT `company_ibfk_2` FOREIGN KEY (`COMPANY_CITY_ID`) REFERENCES `city` (`CITY_ID`),
  ADD CONSTRAINT `company_ibfk_3` FOREIGN KEY (`COMPANY_REGION_ID`) REFERENCES `region` (`REGION_ID`);

--
-- Constraints for table `COMPANY_USER`
--
ALTER TABLE `COMPANY_USER`
  ADD CONSTRAINT `fk_customer` FOREIGN KEY (`USER_COMPANY_ID`) REFERENCES `company` (`ID_COMPANY`);

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`PRODUCT_CATEGORY_ID`) REFERENCES `product_category` (`PRODUCT_CATEGORY_ID`),
  ADD CONSTRAINT `product_ibfk_2` FOREIGN KEY (`PRODUCT_WAREHOUSE_ID`) REFERENCES `warehouse` (`WAREHOUSE_ID`),
  ADD CONSTRAINT `product_ibfk_3` FOREIGN KEY (`PRODUCT_COMPANY_ID`) REFERENCES `company` (`ID_COMPANY`);

--
-- Constraints for table `product_order`
--
ALTER TABLE `product_order`
  ADD CONSTRAINT `product_order_ibfk_1` FOREIGN KEY (`PRODUCT_ID`) REFERENCES `product` (`PRODUCT_ID`),
  ADD CONSTRAINT `product_order_ibfk_2` FOREIGN KEY (`ORDER_ID`) REFERENCES `shipment_order` (`ORDER_ID`);

--
-- Constraints for table `shipment`
--
ALTER TABLE `shipment`
  ADD CONSTRAINT `shipment_ibfk_1` FOREIGN KEY (`ORDER_ID`) REFERENCES `shipment_order` (`ORDER_ID`),
  ADD CONSTRAINT `shipment_ibfk_2` FOREIGN KEY (`SHIPMENT_WAREHOUSE`) REFERENCES `warehouse` (`WAREHOUSE_ID`),
  ADD CONSTRAINT `shipment_ibfk_3` FOREIGN KEY (`SHIPMENT_WAREHOUSE_START_LOCATION`) REFERENCES `warehouse` (`WAREHOUSE_CITY_ID`),
  ADD CONSTRAINT `shipment_ibfk_4` FOREIGN KEY (`SHIPMENT_FINAL_DESTINATION`) REFERENCES `shipment_order` (`ORDER_ID`),
  ADD CONSTRAINT `shipment_ibfk_5` FOREIGN KEY (`SHIPMENT_FINAL_DESTINATION`) REFERENCES `city` (`CITY_ID`);

--
-- Constraints for table `warehouse`
--
ALTER TABLE `warehouse`
  ADD CONSTRAINT `warehouse_ibfk_1` FOREIGN KEY (`WAREHOUSE_CITY_ID`) REFERENCES `city` (`CITY_ID`),
  ADD CONSTRAINT `warehouse_ibfk_2` FOREIGN KEY (`WAREHOUSE_REGION_ID`) REFERENCES `region` (`REGION_ID`),
  ADD CONSTRAINT `warehouse_ibfk_3` FOREIGN KEY (`WAREHOUSE_COMPANY_ID`) REFERENCES `company` (`ID_COMPANY`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
