-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';


-- -----------------------------------------------------
-- Table `image-secure`.`images`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `image-secure`.`images` (
  `idimage` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`idimage`))
  ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `image-secure`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `image-secure`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(25) NOT NULL,
  `firstname` VARCHAR(50) NULL,
  `lastname` VARCHAR(50) NULL,
  `mail` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `master_key` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`))
  ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `image-secure`.`users-images`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `image-secure`.`users-images` (
  `userid` INT NOT NULL,
  `imageid` VARCHAR(255) NOT NULL,
  `key` varchar(255) DEFAULT NULL,
  `uploaded` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`userid`, `imageid`),
  INDEX `id_idx` (`imageid` ASC),
  CONSTRAINT `id`
  FOREIGN KEY (`userid`)
  REFERENCES `image-secure`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `idimage`
  FOREIGN KEY (`imageid`)
  REFERENCES `image-secure`.`images` (`idimage`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
  ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
