-- MySQL dump 10.13  Distrib 5.7.36, for Linux (x86_64)
--
-- Host: localhost    Database: curriculum
-- ------------------------------------------------------
-- Server version	5.7.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `curriculum`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `curriculum` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `curriculum`;

--
-- Table structure for table `curriculum_setting`
--

DROP TABLE IF EXISTS `curriculum_setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `curriculum_setting` (
  `semester_year` varchar(45) CHARACTER SET utf8 NOT NULL,
  `summer_date_month` varchar(45) CHARACTER SET utf8 NOT NULL,
  `summer_date_day` varchar(45) CHARACTER SET utf8 NOT NULL,
  `winter_date_month` varchar(45) CHARACTER SET utf8 NOT NULL,
  `winter_date_day` varchar(45) CHARACTER SET utf8 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `static_purpose`
--

DROP TABLE IF EXISTS `static_purpose`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `static_purpose` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `semester_year` varchar(45) CHARACTER SET utf8 NOT NULL,
  `semester_type` varchar(45) CHARACTER SET utf8 NOT NULL,
  `name` varchar(45) CHARACTER SET utf8 NOT NULL,
  `office` varchar(45) CHARACTER SET utf8 NOT NULL,
  `week` varchar(45) CHARACTER SET utf8 NOT NULL,
  `start_time` varchar(45) CHARACTER SET utf8 NOT NULL,
  `end_time` varchar(45) CHARACTER SET utf8 NOT NULL,
  `classroom` varchar(45) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `temporary_purpose`
--

DROP TABLE IF EXISTS `temporary_purpose`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `temporary_purpose` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `semester_year` varchar(45) CHARACTER SET utf8 NOT NULL,
  `semester_type` varchar(45) CHARACTER SET utf8 NOT NULL,
  `name` varchar(45) CHARACTER SET utf8 NOT NULL,
  `office` varchar(45) CHARACTER SET utf8 NOT NULL,
  `date` varchar(45) CHARACTER SET utf8 NOT NULL,
  `start_time` varchar(45) CHARACTER SET utf8 NOT NULL,
  `end_time` varchar(45) CHARACTER SET utf8 NOT NULL,
  `classroom` varchar(45) CHARACTER SET utf8 NOT NULL,
  `rRule` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=668 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `website_curriculum`
--

DROP TABLE IF EXISTS `website_curriculum`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `website_curriculum` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `semester_year` varchar(45) CHARACTER SET utf8 NOT NULL,
  `semester_type` varchar(45) CHARACTER SET utf8 NOT NULL,
  `class_id` int(11) NOT NULL,
  `name` varchar(45) CHARACTER SET utf8 NOT NULL,
  `grade` varchar(45) CHARACTER SET utf8 NOT NULL,
  `week` varchar(45) CHARACTER SET utf8 NOT NULL,
  `start_time` varchar(45) DEFAULT NULL,
  `end_time` varchar(45) DEFAULT NULL,
  `classroom` varchar(45) CHARACTER SET utf8 NOT NULL,
  `teacher` varchar(45) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=371 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-06-11 14:19:04
