-- CREATE DATABASE sleep_tracker 

-- switch to our db
-- USE sleep_tracker;

-- Creating the table for entries
CREATE TABLE sleep_entries(
	id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    hours INT NOT NULL
    
);