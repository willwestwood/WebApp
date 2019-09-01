DROP DATABASE IF EXISTS crm;

CREATE DATABASE crm;

CREATE TABLE crm.users (
 id INT NOT NULL AUTO_INCREMENT,
 firstName VARCHAR(255) NOT NULL,
 secondName VARCHAR(255) NOT NULL,
 emailAddress VARCHAR(255) NOT NULL,
 isAdmin BOOLEAN NOT NULL,
 passwordHash varchar(60) NOT NULL,
 PRIMARY KEY (id),
 UNIQUE (emailAddress)
 );
 
 CREATE TABLE crm.companies (
 id INT NOT NULL AUTO_INCREMENT,
 name VARCHAR(255) NOT NULL,
 address TEXT,
 telephone VARCHAR(255),
 PRIMARY KEY(id)
 );
 
 CREATE TABLE crm.contacts (
 id INT NOT NULL AUTO_INCREMENT,
 firstName VARCHAR(255) NOT NULL,
 secondName VARCHAR(255) NOT NULL,
 emailAddress VARCHAR(255) NOT NULL,
 companyId INT,
 PRIMARY KEY (id)
 );
 
 CREATE TABLE crm.notes (
 id INT NOT NULL AUTO_INCREMENT,
 contactId INT NOT NULL,
 userId INT NOT NULL,
 note TEXT NOT NULL,
 updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 PRIMARY KEY (id)
 );
 
INSERT INTO crm.users (firstName, secondName, emailAddress, isAdmin, passwordHash)
VALUES ('William', 'Westwood', 'willjwestwood@gmail.com', TRUE, '6d18f698b58037ee33e036773f5ba8db60fd63d1');

INSERT INTO crm.users (firstName, secondName, emailAddress, isAdmin, passwordHash)
VALUES ('Lorna', 'Westwood', 'lorna@company.uk', FALSE, '6d18f698b58037ee33e036773f5ba8db60fd63d1');

INSERT INTO crm.users (firstName, secondName, emailAddress, isAdmin, passwordHash)
VALUES ('Louisa', 'Briguglio', 'louisa@gmail.com', TRUE, '6d18f698b58037ee33e036773f5ba8db60fd63d1');

INSERT INTO crm.companies
VALUES (0, 'Company Ltd', '20 Business Park, London, NW1 5RP', '+442095 551133');

INSERT INTO crm.contacts
VALUES (0, 'Graham', 'Westwood', 'gwestwood@company.uk', 1);

INSERT INTO crm.notes(contactId, userId, note)
VALUES (1, 1, 'Test note');