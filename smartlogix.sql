-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:4406
-- Tiempo de generación: 24-03-2026 a las 15:09:07
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `smartlogix`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `city`
--

CREATE TABLE `city` (
  `CITY_ID` decimal(3,0) NOT NULL,
  `REGION_ID` decimal(3,0) DEFAULT NULL,
  `CITY_NAME` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `company`
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
-- Estructura de tabla para la tabla `company_category`
--

CREATE TABLE `company_category` (
  `COMPANY_CATEGORY_ID` decimal(3,0) NOT NULL,
  `COMPANY_CATEGORY_NAME` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `product`
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
-- Estructura de tabla para la tabla `product_category`
--

CREATE TABLE `product_category` (
  `PRODUCT_CATEGORY_ID` decimal(3,0) NOT NULL,
  `PRODUCT_CATEGORY_NAME` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `product_order`
--

CREATE TABLE `product_order` (
  `PRODUCT_ID` decimal(5,0) DEFAULT NULL,
  `ORDER_ID` decimal(5,0) DEFAULT NULL,
  `PRODUCT_VALUE` decimal(12,0) DEFAULT NULL,
  `PRODUCT_ORDER_QUANTITY` decimal(4,0) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `region`
--

CREATE TABLE `region` (
  `REGION_ID` decimal(3,0) NOT NULL,
  `REGION_NAME` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `shipment`
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
-- Estructura de tabla para la tabla `shipment_order`
--

CREATE TABLE `shipment_order` (
  `ORDER_ID` decimal(5,0) NOT NULL,
  `ORDER_VALUE` decimal(12,0) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `warehouse`
--

CREATE TABLE `warehouse` (
  `WAREHOUSE_ID` decimal(4,0) NOT NULL,
  `WAREHOUSE_CITY_ID` decimal(3,0) DEFAULT NULL,
  `WAREHOUSE_REGION_ID` decimal(3,0) DEFAULT NULL,
  `WAREHOUSE_COMPANY_ID` decimal(3,0) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `city`
--
ALTER TABLE `city`
  ADD PRIMARY KEY (`CITY_ID`),
  ADD KEY `REGION_ID` (`REGION_ID`);

--
-- Indices de la tabla `company`
--
ALTER TABLE `company`
  ADD PRIMARY KEY (`ID_COMPANY`),
  ADD KEY `COMPANY_CATEGORY_ID` (`COMPANY_CATEGORY_ID`),
  ADD KEY `COMPANY_CITY_ID` (`COMPANY_CITY_ID`),
  ADD KEY `COMPANY_REGION_ID` (`COMPANY_REGION_ID`);

--
-- Indices de la tabla `company_category`
--
ALTER TABLE `company_category`
  ADD PRIMARY KEY (`COMPANY_CATEGORY_ID`);

--
-- Indices de la tabla `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`PRODUCT_ID`),
  ADD KEY `PRODUCT_CATEGORY_ID` (`PRODUCT_CATEGORY_ID`),
  ADD KEY `PRODUCT_WAREHOUSE_ID` (`PRODUCT_WAREHOUSE_ID`),
  ADD KEY `PRODUCT_COMPANY_ID` (`PRODUCT_COMPANY_ID`);

--
-- Indices de la tabla `product_category`
--
ALTER TABLE `product_category`
  ADD PRIMARY KEY (`PRODUCT_CATEGORY_ID`);

--
-- Indices de la tabla `product_order`
--
ALTER TABLE `product_order`
  ADD KEY `PRODUCT_ID` (`PRODUCT_ID`),
  ADD KEY `ORDER_ID` (`ORDER_ID`);

--
-- Indices de la tabla `region`
--
ALTER TABLE `region`
  ADD PRIMARY KEY (`REGION_ID`);

--
-- Indices de la tabla `shipment`
--
ALTER TABLE `shipment`
  ADD PRIMARY KEY (`SHIPMENT_ID`),
  ADD KEY `ORDER_ID` (`ORDER_ID`),
  ADD KEY `SHIPMENT_WAREHOUSE` (`SHIPMENT_WAREHOUSE`),
  ADD KEY `SHIPMENT_WAREHOUSE_START_LOCATION` (`SHIPMENT_WAREHOUSE_START_LOCATION`),
  ADD KEY `SHIPMENT_FINAL_DESTINATION` (`SHIPMENT_FINAL_DESTINATION`);

--
-- Indices de la tabla `shipment_order`
--
ALTER TABLE `shipment_order`
  ADD PRIMARY KEY (`ORDER_ID`);

--
-- Indices de la tabla `warehouse`
--
ALTER TABLE `warehouse`
  ADD PRIMARY KEY (`WAREHOUSE_ID`),
  ADD KEY `WAREHOUSE_CITY_ID` (`WAREHOUSE_CITY_ID`),
  ADD KEY `WAREHOUSE_REGION_ID` (`WAREHOUSE_REGION_ID`),
  ADD KEY `WAREHOUSE_COMPANY_ID` (`WAREHOUSE_COMPANY_ID`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `city`
--
ALTER TABLE `city`
  ADD CONSTRAINT `city_ibfk_1` FOREIGN KEY (`REGION_ID`) REFERENCES `region` (`REGION_ID`);

--
-- Filtros para la tabla `company`
--
ALTER TABLE `company`
  ADD CONSTRAINT `company_ibfk_1` FOREIGN KEY (`COMPANY_CATEGORY_ID`) REFERENCES `company_category` (`COMPANY_CATEGORY_ID`),
  ADD CONSTRAINT `company_ibfk_2` FOREIGN KEY (`COMPANY_CITY_ID`) REFERENCES `city` (`CITY_ID`),
  ADD CONSTRAINT `company_ibfk_3` FOREIGN KEY (`COMPANY_REGION_ID`) REFERENCES `region` (`REGION_ID`);

--
-- Filtros para la tabla `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`PRODUCT_CATEGORY_ID`) REFERENCES `product_category` (`PRODUCT_CATEGORY_ID`),
  ADD CONSTRAINT `product_ibfk_2` FOREIGN KEY (`PRODUCT_WAREHOUSE_ID`) REFERENCES `warehouse` (`WAREHOUSE_ID`),
  ADD CONSTRAINT `product_ibfk_3` FOREIGN KEY (`PRODUCT_COMPANY_ID`) REFERENCES `company` (`ID_COMPANY`);

--
-- Filtros para la tabla `product_order`
--
ALTER TABLE `product_order`
  ADD CONSTRAINT `product_order_ibfk_1` FOREIGN KEY (`PRODUCT_ID`) REFERENCES `product` (`PRODUCT_ID`),
  ADD CONSTRAINT `product_order_ibfk_2` FOREIGN KEY (`ORDER_ID`) REFERENCES `shipment_order` (`ORDER_ID`);

--
-- Filtros para la tabla `shipment`
--
ALTER TABLE `shipment`
  ADD CONSTRAINT `shipment_ibfk_1` FOREIGN KEY (`ORDER_ID`) REFERENCES `shipment_order` (`ORDER_ID`),
  ADD CONSTRAINT `shipment_ibfk_2` FOREIGN KEY (`SHIPMENT_WAREHOUSE`) REFERENCES `warehouse` (`WAREHOUSE_ID`),
  ADD CONSTRAINT `shipment_ibfk_3` FOREIGN KEY (`SHIPMENT_WAREHOUSE_START_LOCATION`) REFERENCES `warehouse` (`WAREHOUSE_CITY_ID`),
  ADD CONSTRAINT `shipment_ibfk_4` FOREIGN KEY (`SHIPMENT_FINAL_DESTINATION`) REFERENCES `shipment_order` (`ORDER_ID`),
  ADD CONSTRAINT `shipment_ibfk_5` FOREIGN KEY (`SHIPMENT_FINAL_DESTINATION`) REFERENCES `city` (`CITY_ID`);

--
-- Filtros para la tabla `warehouse`
--
ALTER TABLE `warehouse`
  ADD CONSTRAINT `warehouse_ibfk_1` FOREIGN KEY (`WAREHOUSE_CITY_ID`) REFERENCES `city` (`CITY_ID`),
  ADD CONSTRAINT `warehouse_ibfk_2` FOREIGN KEY (`WAREHOUSE_REGION_ID`) REFERENCES `region` (`REGION_ID`),
  ADD CONSTRAINT `warehouse_ibfk_3` FOREIGN KEY (`WAREHOUSE_COMPANY_ID`) REFERENCES `company` (`ID_COMPANY`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
