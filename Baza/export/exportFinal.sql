-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: dronax
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `archive`
--

DROP TABLE IF EXISTS `archive`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `archive` (
  `idArchive` int NOT NULL AUTO_INCREMENT,
  `idDrone` int NOT NULL,
  `archivedDate` date NOT NULL,
  PRIMARY KEY (`idArchive`),
  KEY `fk_Archive_Drone1_idx` (`idDrone`),
  CONSTRAINT `fk_Archive_Drone1` FOREIGN KEY (`idDrone`) REFERENCES `drone` (`idDrone`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=cp1250 COLLATE=cp1250_croatian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `archive`
--

LOCK TABLES `archive` WRITE;
/*!40000 ALTER TABLE `archive` DISABLE KEYS */;
/*!40000 ALTER TABLE `archive` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discount`
--

DROP TABLE IF EXISTS `discount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discount` (
  `idDiscount` int NOT NULL AUTO_INCREMENT,
  `amount` int NOT NULL,
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  PRIMARY KEY (`idDiscount`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=cp1250 COLLATE=cp1250_croatian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discount`
--

LOCK TABLES `discount` WRITE;
/*!40000 ALTER TABLE `discount` DISABLE KEYS */;
INSERT INTO `discount` VALUES (6,45,'2025-02-18','2025-02-23'),(8,16,'2025-02-22','2025-02-28'),(11,15,'2025-02-17','2025-02-20');
/*!40000 ALTER TABLE `discount` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `drone`
--

DROP TABLE IF EXISTS `drone`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `drone` (
  `idDrone` int NOT NULL AUTO_INCREMENT,
  `idManufacturer` int NOT NULL,
  `name` varchar(255) CHARACTER SET cp1250 COLLATE cp1250_croatian_ci NOT NULL,
  `type` varchar(115) CHARACTER SET cp1250 COLLATE cp1250_croatian_ci DEFAULT NULL,
  `about` longtext COLLATE cp1250_croatian_ci,
  `manufacturingDate` date NOT NULL,
  `price` decimal(10,0) DEFAULT NULL,
  `isArchived` tinyint NOT NULL,
  PRIMARY KEY (`idDrone`),
  KEY `fk_Drone_Manufacturer_idx` (`idManufacturer`),
  CONSTRAINT `fk_Drone_Manufacturer` FOREIGN KEY (`idManufacturer`) REFERENCES `manufacturer` (`idManufacturer`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=cp1250 COLLATE=cp1250_croatian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `drone`
--

LOCK TABLES `drone` WRITE;
/*!40000 ALTER TABLE `drone` DISABLE KEYS */;
INSERT INTO `drone` VALUES (12,2,'Evo I','hobby','A compact and powerful drone with a 4K camera, 3-axis stabilization, and up to 30 minutes of flight time. Its foldable design, advanced safety features, and precise control make it perfect for aerial filming.','2025-02-05',1000,0),(17,7,'FPV','hobby','A high-speed FPV drone that combines a classic FPV experience with advanced DJI technologies. It features a 4K camera, low-latency image transmission, multiple flight modes, and safety functions like automatic return. Perfect for fast, dynamic aerial shots.','2025-05-10',955,0),(56,17,'X10','pro','A cutting-edge autonomous drone designed for public safety, defense, and industrial inspections. It features AI-driven navigation, a 64MP camera, thermal imaging, and a modular design for versatile missions. With 40 minutes of flight time and IP55 weather resistance, it ensures high performance in demanding environments. ','2025-02-01',800,0),(57,7,'Mavic 2 Zoom','hobby','A versatile drone featuring a 12MP camera with 2x optical zoom (24-48mm), allowing for dynamic perspectives and lossless zooming. It offers 4K video recording, 31 minutes of flight time, and Omnidirectional Obstacle Sensing for safe flying. Ideal for aerial photography, videography, and creative shooting. ','2024-07-10',1250,0);
/*!40000 ALTER TABLE `drone` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `drone_discount`
--

DROP TABLE IF EXISTS `drone_discount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `drone_discount` (
  `idDrone` int NOT NULL,
  `idDiscount` int DEFAULT NULL,
  `lastDiscountDate` date NOT NULL,
  `isActive` tinyint NOT NULL,
  KEY `fk_Drone_has_Discount_Discount1_idx` (`idDiscount`),
  KEY `fk_Drone_has_Discount_Drone1_idx` (`idDrone`),
  CONSTRAINT `fk_Drone_has_Discount_Discount1` FOREIGN KEY (`idDiscount`) REFERENCES `discount` (`idDiscount`) ON DELETE SET NULL,
  CONSTRAINT `fk_Drone_has_Discount_Drone1` FOREIGN KEY (`idDrone`) REFERENCES `drone` (`idDrone`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=cp1250 COLLATE=cp1250_croatian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `drone_discount`
--

LOCK TABLES `drone_discount` WRITE;
/*!40000 ALTER TABLE `drone_discount` DISABLE KEYS */;
INSERT INTO `drone_discount` VALUES (17,8,'2025-02-28',0),(12,NULL,'2025-02-20',1),(17,NULL,'2025-02-20',1),(57,6,'2025-02-23',1),(56,NULL,'2025-02-20',1),(17,11,'2025-02-20',1),(12,6,'2025-02-23',1),(56,NULL,'2025-02-20',1),(56,NULL,'2025-02-22',1),(56,11,'2025-02-20',1),(56,8,'2025-02-28',0),(56,11,'2025-02-20',1);
/*!40000 ALTER TABLE `drone_discount` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `drone_image`
--

DROP TABLE IF EXISTS `drone_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `drone_image` (
  `idImage` int NOT NULL AUTO_INCREMENT,
  `idDrone` int NOT NULL,
  `imageUrl` varchar(255) CHARACTER SET cp1250 COLLATE cp1250_croatian_ci NOT NULL,
  PRIMARY KEY (`idImage`),
  KEY `fk_Drone_Image_Drone1_idx` (`idDrone`),
  CONSTRAINT `fk_Drone_Image_Drone1` FOREIGN KEY (`idDrone`) REFERENCES `drone` (`idDrone`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=122 DEFAULT CHARSET=cp1250 COLLATE=cp1250_croatian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `drone_image`
--

LOCK TABLES `drone_image` WRITE;
/*!40000 ALTER TABLE `drone_image` DISABLE KEYS */;
INSERT INTO `drone_image` VALUES (103,17,'fpv.jpg'),(104,17,'fpvv2.png'),(105,17,'fpvv3.png'),(106,12,'evo1.png'),(107,12,'evoo2.png'),(108,12,'evoo3.png'),(109,56,'sky2.webp'),(110,56,'sky.png'),(111,57,'m2z.png'),(112,57,'m2zf.png'),(113,57,'m2zz.jpg');
/*!40000 ALTER TABLE `drone_image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `manufacturer`
--

DROP TABLE IF EXISTS `manufacturer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `manufacturer` (
  `idManufacturer` int NOT NULL AUTO_INCREMENT,
  `name` varchar(155) CHARACTER SET cp1250 COLLATE cp1250_croatian_ci NOT NULL,
  `country` varchar(100) CHARACTER SET cp1250 COLLATE cp1250_croatian_ci NOT NULL,
  PRIMARY KEY (`idManufacturer`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=cp1250 COLLATE=cp1250_croatian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `manufacturer`
--

LOCK TABLES `manufacturer` WRITE;
/*!40000 ALTER TABLE `manufacturer` DISABLE KEYS */;
INSERT INTO `manufacturer` VALUES (2,'Autel','China'),(7,'DJI','China'),(17,'Skydio','California'),(18,'NoviManu','Novi');
/*!40000 ALTER TABLE `manufacturer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shopping_cart`
--

DROP TABLE IF EXISTS `shopping_cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shopping_cart` (
  `idUser` int NOT NULL,
  `idDrone` int NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`idUser`,`idDrone`),
  KEY `fk_ShoppingCart_Drone1_idx` (`idDrone`),
  KEY `fk_ShoppingCart_User1_idx` (`idUser`),
  CONSTRAINT `fk_ShoppingCart_Drone1` FOREIGN KEY (`idDrone`) REFERENCES `drone` (`idDrone`) ON DELETE CASCADE,
  CONSTRAINT `fk_ShoppingCart_User1` FOREIGN KEY (`idUser`) REFERENCES `user` (`idUser`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=cp1250 COLLATE=cp1250_croatian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shopping_cart`
--

LOCK TABLES `shopping_cart` WRITE;
/*!40000 ALTER TABLE `shopping_cart` DISABLE KEYS */;
INSERT INTO `shopping_cart` VALUES (3,17,1),(4,56,1),(4,57,2),(12,12,3),(12,57,1);
/*!40000 ALTER TABLE `shopping_cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `idUser` int NOT NULL AUTO_INCREMENT,
  `username` varchar(150) CHARACTER SET cp1250 COLLATE cp1250_croatian_ci NOT NULL,
  `password` varchar(255) CHARACTER SET cp1250 COLLATE cp1250_croatian_ci NOT NULL,
  `name` varchar(115) CHARACTER SET cp1250 COLLATE cp1250_croatian_ci NOT NULL,
  `role` enum('admin','customer') CHARACTER SET cp1250 COLLATE cp1250_croatian_ci NOT NULL,
  PRIMARY KEY (`idUser`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=cp1250 COLLATE=cp1250_croatian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (3,'ivkoIvkic','$2b$10$SWGzr9pWWhy16jTK1QUEAeFB8E/9Q1P.z95ElL55/GhXE408OmcqW','Ivko','customer'),(4,'mgradiscaj','$2b$10$y5zmuVkI/B1tvNa5X/hr9.DbXyMOPKTT5PxTeL2ZLfeH3P2nGdt5.','Marko','admin'),(12,'noviUser','$2b$10$ggrzvglNsOtfTvZrKAaSwuqX4MmQEn5AQnpYQXTUdAevAHdth89oS','Novi','customer');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-18  7:22:31
