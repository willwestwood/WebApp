DROP DATABASE IF EXISTS crm;

CREATE DATABASE crm;

CREATE TABLE crm.users (
 id INT NOT NULL AUTO_INCREMENT,
 firstName VARCHAR(255) NOT NULL,
 secondName VARCHAR(255) NOT NULL,
 emailAddress VARCHAR(255) NOT NULL,
 isAdmin BOOLEAN NOT NULL,
 passwordHash VARCHAR(255) NOT NULL,
 salt VARCHAR(255) NOT NULL,
 pending BOOLEAN DEFAULT TRUE,
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
 
 INSERT INTO crm.users (firstName, secondName, emailAddress, isAdmin, passwordHash, salt, pending)
VALUES ('Admin', '', 'admin', TRUE, 'a3559dbbd6fbb664893c1a290491efa56da76f8e', 'd30fbb9680b985647a46eeff770336bc126a3aab', FALSE);
 
INSERT INTO crm.users (firstName, secondName, emailAddress, isAdmin, passwordHash, salt, pending)
VALUES ('William', 'Westwood', 'willjwestwood@gmail.com', TRUE, 'ebb8377e06760d13633a5d436fdfee494d93090d', 'ccd9d6271bea792615a5cf22642e9563c485573d', FALSE);

INSERT INTO crm.users (firstName, secondName, emailAddress, isAdmin, passwordHash, salt)
VALUES ('Lorna', 'Westwood', 'lorna@company.uk', FALSE, 'a521b50652e163f73018cfb5808c9b1f4c11f49f', '04261b90d25e5c12a2ff0b0385cb2314604c0d8b');

INSERT INTO crm.users (firstName, secondName, emailAddress, isAdmin, passwordHash, salt)
VALUES ('Louisa', 'Briguglio', 'louisa@gmail.com', TRUE, '32cefc1cc349142e71a6a1d209f9f29b09b6328e', '0411c8726f72a2e339f4e303d72f87322b589e7b');

INSERT INTO crm.companies
VALUES (0, 'Company Ltd', '20 Business Park, London, NW1 5RP', '+442095 551133');

INSERT INTO crm.contacts
VALUES (0, 'Graham', 'Westwood', 'gwestwood@company.uk', 1);

INSERT INTO crm.notes(contactId, userId, note)
VALUES (1, 1, 'Test note');