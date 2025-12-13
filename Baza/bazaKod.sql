-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema dronax
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema dronax
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `dronax` DEFAULT CHARACTER SET cp1250 COLLATE cp1250_croatian_ci ;
USE `dronax` ;

-- -----------------------------------------------------
-- Table `dronax`.`Manufacturer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dronax`.`Manufacturer` (
  `idManufacturer` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(155) NOT NULL,
  `country` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`idManufacturer`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `dronax`.`Archive`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dronax`.`Archive` (
  `idArchive` INT NOT NULL AUTO_INCREMENT,
  `idDrone` INT NOT NULL,
  `archivedDate` DATE NOT NULL,
  PRIMARY KEY (`idArchive`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `dronax`.`Drone`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dronax`.`Drone` (
  `idDrone` INT NOT NULL AUTO_INCREMENT,
  `idManufacturer` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `type` VARCHAR(115) NULL,
  `about` VARCHAR(255) NULL,
  `dateAdded` DATE NOT NULL,
  `price` DECIMAL NULL,
  `idArchive` INT NULL,
  PRIMARY KEY (`idDrone`),
  INDEX `fk_Drone_Manufacturer_idx` (`idManufacturer` ASC) VISIBLE,
  INDEX `fk_Drone_Archive1_idx` (`idArchive` ASC) VISIBLE,
  CONSTRAINT `fk_Drone_Manufacturer`
    FOREIGN KEY (`idManufacturer`)
    REFERENCES `dronax`.`Manufacturer` (`idManufacturer`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Drone_Archive1`
    FOREIGN KEY (`idArchive`)
    REFERENCES `dronax`.`Archive` (`idArchive`)
    ON DELETE SET NULL
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `dronax`.`Discount`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dronax`.`Discount` (
  `idDiscount` INT NOT NULL AUTO_INCREMENT,
  `isActive` TINYINT NOT NULL,
  `amount` DECIMAL(5,2) NULL,
  `startDate` DATE NULL,
  `endDate` DATE NULL,
  PRIMARY KEY (`idDiscount`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `dronax`.`Drone_Discount`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dronax`.`Drone_Discount` (
  `Drone_idDrone` INT NOT NULL,
  `Discount_idDiscount` INT NOT NULL,
  PRIMARY KEY (`Drone_idDrone`, `Discount_idDiscount`),
  INDEX `fk_Drone_has_Discount_Discount1_idx` (`Discount_idDiscount` ASC) VISIBLE,
  INDEX `fk_Drone_has_Discount_Drone1_idx` (`Drone_idDrone` ASC) VISIBLE,
  CONSTRAINT `fk_Drone_has_Discount_Drone1`
    FOREIGN KEY (`Drone_idDrone`)
    REFERENCES `dronax`.`Drone` (`idDrone`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Drone_has_Discount_Discount1`
    FOREIGN KEY (`Discount_idDiscount`)
    REFERENCES `dronax`.`Discount` (`idDiscount`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `dronax`.`Drone_Image`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dronax`.`Drone_Image` (
  `idImage` INT NOT NULL AUTO_INCREMENT,
  `idDrone` INT NOT NULL,
  `imageUrl` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`idImage`),
  INDEX `fk_Drone_Image_Drone1_idx` (`idDrone` ASC) VISIBLE,
  CONSTRAINT `fk_Drone_Image_Drone1`
    FOREIGN KEY (`idDrone`)
    REFERENCES `dronax`.`Drone` (`idDrone`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `dronax`.`User`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dronax`.`User` (
  `idUser` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(150) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(115) NOT NULL,
  `role` ENUM('admin', 'customer') NOT NULL,
  PRIMARY KEY (`idUser`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
