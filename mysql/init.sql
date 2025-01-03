-- 设置字符集
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET character_set_client = utf8mb4;
SET character_set_connection = utf8mb4;
SET character_set_database = utf8mb4;
SET character_set_results = utf8mb4;
SET character_set_server = utf8mb4;

-- 创建并使用数据库
CREATE DATABASE IF NOT EXISTS koa_gold_console DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE koa_gold_console;

-- 设置环境变量
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- 创建Account表
CREATE TABLE `Account` (
    `Id` INT NOT NULL AUTO_INCREMENT COMMENT 'Auto increment primary key ID',
    `Email` VARCHAR(100) NOT NULL COMMENT 'User email address',
    `Password` VARCHAR(100) NOT NULL COMMENT 'User password',
    `Name` VARCHAR(250) NOT NULL COMMENT 'User name',
    `StatusId` TINYINT NOT NULL COMMENT 'User status code: 0 - disabled, 1 - enabled',
    `CreatedBy` VARCHAR(100) NOT NULL COMMENT 'Record created by',
    `LastLoginDateTime` DATETIME(3) DEFAULT '1000-01-01 00:00:00.000' NULL COMMENT 'Last login time',
    `CreatedDateTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT 'Record creation time',
    `UpdatedBy` VARCHAR(100) NULL COMMENT 'Record updated by',
    `UpdatedDateTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) COMMENT 'Record update time',
    PRIMARY KEY (`Id`),
    UNIQUE (`Email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='user account information table';

-- 恢复环境变量
SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS; 