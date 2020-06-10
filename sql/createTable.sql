CREATE TABLE users(
    id serial PRIMARY KEY,
    username varchar(50) NOT NULL,
    password varchar(100) NOT NULL,
    email varchar(100) NOT NULL,
    dateOfBirth date NOT NULL,
    dateCreated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, password, email, dateOfBirth)
    VALUES ('Aerith','password123','Aerith@company.com','1985-02-07');