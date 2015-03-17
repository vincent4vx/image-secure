-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`images`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`images` (
  `idimage` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`idimage`))
  ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(25) NOT NULL,
  `firstname` VARCHAR(50) NULL,
  `lastname` VARCHAR(50) NULL,
  `mail` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`))
  ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`users-images`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`users-images` (
  `userid` INT NOT NULL,
  `imageid` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`userid`, `imageid`),
  INDEX `id_idx` (`imageid` ASC),
  CONSTRAINT `id`
  FOREIGN KEY (`userid`)
  REFERENCES `mydb`.`users` (`username`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `idimage`
  FOREIGN KEY (`imageid`)
  REFERENCES `mydb`.`images` (`idimage`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
  ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
