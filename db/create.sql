DROP DATABASE IF EXISTS crm;

CREATE DATABASE crm;

CREATE TABLE crm.users (
id INT NOT NULL AUTO_INCREMENT,
firstName VARCHAR(255) NOT NULL,
secondName VARCHAR(255) NOT NULL,
emailAddress VARCHAR(255) NOT NULL,
passwordHash VARCHAR(255) NOT NULL,
salt VARCHAR(255) NOT NULL,
isAdmin BOOLEAN NOT NULL DEFAULT FALSE,
isPending BOOLEAN NOT NULL DEFAULT TRUE,
isDeleted BOOLEAN NOT NULL DEFAULT FALSE,
PRIMARY KEY (id),
UNIQUE (emailAddress)
);

CREATE TABLE crm.companies (
id INT NOT NULL AUTO_INCREMENT,
name VARCHAR(255) NOT NULL,
address TEXT,
telephone VARCHAR(255),
isDeleted BOOLEAN NOT NULL DEFAULT FALSE,
PRIMARY KEY(id)
);

CREATE TABLE crm.contacts (
id INT NOT NULL AUTO_INCREMENT,
firstName VARCHAR(255) NOT NULL,
secondName VARCHAR(255),
companyId INT,
title VARCHAR(255),
position VARCHAR(255),
isDeleted BOOLEAN NOT NULL DEFAULT FALSE,
PRIMARY KEY (id),
FOREIGN KEY (companyId) REFERENCES users(id)
);

CREATE TABLE crm.notes (
id INT NOT NULL AUTO_INCREMENT,
contactId INT NOT NULL,
userId INT NOT NULL,
note TEXT NOT NULL,
updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
isDeleted BOOLEAN NOT NULL DEFAULT FALSE,
PRIMARY KEY (id),
FOREIGN KEY (userId) REFERENCES users(id),
FOREIGN KEY (contactId) REFERENCES contacts(id)
);

CREATE TABLE crm.phoneNumbers (
    id INT NOT NULL AUTO_INCREMENT,
    contactId INT NOT NULL,
    phoneNumber VARCHAR(255),
    PRIMARY KEY (id),
    FOREIGN KEY (contactId) REFERENCES contacts(id)
);

CREATE TABLE crm.emailAddresses (
    id INT NOT NULL AUTO_INCREMENT,
    contactId INT NOT NULL,
    emailAddress VARCHAR(255),
    PRIMARY KEY (id),
    FOREIGN KEY (contactId) REFERENCES contacts(id)
);
 
INSERT INTO crm.users (firstName, secondName, emailAddress, isAdmin, passwordHash, salt, isPending)
VALUES ('Admin', '', 'admin', TRUE, 'a3559dbbd6fbb664893c1a290491efa56da76f8e', 'd30fbb9680b985647a46eeff770336bc126a3aab', FALSE);
 
INSERT INTO crm.users (firstName, secondName, emailAddress, isAdmin, passwordHash, salt, isPending)
VALUES ('William', 'Westwood', 'willjwestwood@gmail.com', TRUE, 'ebb8377e06760d13633a5d436fdfee494d93090d', 'ccd9d6271bea792615a5cf22642e9563c485573d', FALSE);

INSERT INTO crm.users (firstName, secondName, emailAddress, isAdmin, passwordHash, salt)
VALUES ('Lorna', 'Westwood', 'lorna@company.uk', FALSE, 'a521b50652e163f73018cfb5808c9b1f4c11f49f', '04261b90d25e5c12a2ff0b0385cb2314604c0d8b');

INSERT INTO crm.users (firstName, secondName, emailAddress, isAdmin, passwordHash, salt)
VALUES ('Louisa', 'Briguglio', 'louisa@gmail.com', TRUE, '32cefc1cc349142e71a6a1d209f9f29b09b6328e', '0411c8726f72a2e339f4e303d72f87322b589e7b');

INSERT INTO crm.companies (name, address, telephone)
VALUES ('Company Ltd', '20 Business Park, London, NW1 5RP', '+442095 551133');

INSERT INTO crm.companies (name, address, telephone)
VALUES ('Other Company Ltd', '21 Business Park, London, NW1 5RP', '+442095 5511334');

INSERT INTO crm.contacts (firstName, secondName, companyId)
VALUES ('Graham', 'Westwood', 1);

INSERT INTO crm.contacts (firstName, secondName, companyId)
VALUES ('Charlie', 'Westwood', 2);

INSERT INTO crm.notes(contactId, userId, note)
VALUES (1, 2, 'Test note');

INSERT INTO crm.notes(contactId, userId, note)
VALUES (2, 4, 'Test note');

INSERT INTO crm.phoneNumbers(contactId, phoneNumber)
VALUES (1, '01234 567890');

INSERT INTO crm.emailAddresses(contactId, emailAddress)
VALUES (2, 'charlie@company.uk');