CREATE DATABASE IF NOT EXISTS fragrance_finder_db;
USE fragrance_finder_db;
CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT
);