DROP DATABASE IF EXISTS crm;

CREATE DATABASE crm;

CREATE TABLE crm.users (
 id INT NOT NULL AUTO_INCREMENT,
 firstName VARCHAR(255) NOT NULL,
 secondName VARCHAR(255) NOT NULL,
 emailAddress VARCHAR(255) NOT NULL,
 isAdmin BOOLEAN NOT NULL,
 PRIMARY KEY (id)
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
 
INSERT INTO crm.users
VALUES (0, 'William', 'Westwood', 'willjwestwood@gmail.com', TRUE);

INSERT INTO crm.users
VALUES (0, 'Lorna', 'Westwood', 'lorna@ctech.uk', FALSE);

INSERT INTO crm.users
VALUES (0, 'Louisa', 'Briguglio', 'louisa_is_cool@gmail.com', TRUE);

INSERT INTO crm.companies
VALUES (0, 'cTech Ltd', '20 Finns Business Park, Crondall, Hampshire, GU10 5RP', '+441252 851133');

INSERT INTO crm.contacts
VALUES (0, 'Graham', 'Westwood', 'gwestwood@ctech.uk', 1);

INSERT INTO crm.notes(contactId, userId, note)
VALUES (1, 1, 'Test note');