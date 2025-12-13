-- MySQL Workbench Synchronization
-- Generated: 2025-02-18 00:52
-- Model: New Model
-- Version: 1.0
-- Project: Name of the project
-- Author: mgrad

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

ALTER SCHEMA `dronax`  DEFAULT CHARACTER SET cp1250  DEFAULT COLLATE cp1250_croatian_ci ;

ALTER TABLE `dronax`.`Drone` 
DROP FOREIGN KEY `fk_Drone_Manufacturer`;

ALTER TABLE `dronax`.`Drone_Discount` 
DROP FOREIGN KEY `fk_Drone_has_Discount_Discount1`;

ALTER TABLE `dronax`.`Archive` 
DROP FOREIGN KEY `fk_Archive_Drone1`;

ALTER TABLE `dronax`.`Drone_Image` 
DROP FOREIGN KEY `fk_Drone_Image_Drone1`;

ALTER TABLE `dronax`.`Shopping_Cart` 
DROP FOREIGN KEY `fk_ShoppingCart_Drone1`,
DROP FOREIGN KEY `fk_ShoppingCart_User1`;

ALTER TABLE `dronax`.`Drone` 
CHANGE COLUMN `about` `about` LONGTEXT NULL DEFAULT NULL ,
CHANGE COLUMN `price` `price` DECIMAL NULL DEFAULT NULL ;

ALTER TABLE `dronax`.`Drone` 
ADD CONSTRAINT `fk_Drone_Manufacturer`
  FOREIGN KEY (`idManufacturer`)
  REFERENCES `dronax`.`Manufacturer` (`idManufacturer`)
  ON DELETE CASCADE
  ON UPDATE NO ACTION;

ALTER TABLE `dronax`.`Drone_Discount` 
DROP FOREIGN KEY `fk_Drone_has_Discount_Drone1`;

ALTER TABLE `dronax`.`Drone_Discount` ADD CONSTRAINT `fk_Drone_has_Discount_Drone1`
  FOREIGN KEY (`idDrone`)
  REFERENCES `dronax`.`Drone` (`idDrone`)
  ON DELETE CASCADE
  ON UPDATE NO ACTION,
ADD CONSTRAINT `fk_Drone_has_Discount_Discount1`
  FOREIGN KEY (`idDiscount`)
  REFERENCES `dronax`.`Discount` (`idDiscount`)
  ON DELETE SET NULL
  ON UPDATE NO ACTION;

ALTER TABLE `dronax`.`Archive` 
ADD CONSTRAINT `fk_Archive_Drone1`
  FOREIGN KEY (`idDrone`)
  REFERENCES `dronax`.`Drone` (`idDrone`)
  ON DELETE CASCADE
  ON UPDATE NO ACTION;

ALTER TABLE `dronax`.`Drone_Image` 
ADD CONSTRAINT `fk_Drone_Image_Drone1`
  FOREIGN KEY (`idDrone`)
  REFERENCES `dronax`.`Drone` (`idDrone`)
  ON DELETE CASCADE
  ON UPDATE NO ACTION;

ALTER TABLE `dronax`.`Shopping_Cart` 
ADD CONSTRAINT `fk_ShoppingCart_Drone1`
  FOREIGN KEY (`idDrone`)
  REFERENCES `dronax`.`Drone` (`idDrone`)
  ON DELETE CASCADE
  ON UPDATE NO ACTION,
ADD CONSTRAINT `fk_ShoppingCart_User1`
  FOREIGN KEY (`idUser`)
  REFERENCES `dronax`.`User` (`idUser`)
  ON DELETE CASCADE
  ON UPDATE NO ACTION;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
