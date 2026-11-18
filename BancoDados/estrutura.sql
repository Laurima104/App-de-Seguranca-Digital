CREATE DATABASE IF NOT EXISTS cyberseguranca
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE cyberseguranca;

CREATE TABLE IF NOT EXISTS usuarios (
  id BIGINT NOT NULL AUTO_INCREMENT,
  display_name VARCHAR(255) NOT NULL,
  nickname VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  senha VARCHAR(255) NOT NULL COMMENT 'Hash BCrypt; nunca armazenar senha em texto puro',
  progresso INT NOT NULL DEFAULT 0,
  terms_accepted_at DATETIME(6) NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT uk_usuarios_email UNIQUE (email)
) ENGINE=InnoDB;
