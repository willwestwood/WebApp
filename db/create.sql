DROP DATABASE IF EXISTS crm;

CREATE DATABASE crm;

CREATE TABLE crm.users (
 id INT NOT NULL AUTO_INCREMENT,
 firstName VARCHAR(255) NOT NULL,
 secondName VARCHAR(255) NOT NULL,
 emailAddress VARCHAR(255) NOT NULL,
 isAdmin BOOLEAN NOT NULL,
 PRIMARY KEY (id));
 
INSERT INTO crm.users
VALUES (0, 'William', 'Westwood', 'willjwestwood@gmail.com', TRUE);

INSERT INTO crm.users
VALUES (0, 'Lorna', 'Westwood', 'lorna@ctech.uk', FALSE);

INSERT INTO crm.users
VALUES (0, 'Louisa', 'Briguglio', 'louisa_is_cool@gmail.com', TRUE);