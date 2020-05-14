USE EVENTPRIME
GO

CREATE TABLE _user.e_creator(
id BIGINT IDENTITY PRIMARY KEY NOT NULL,
email VARCHAR(50),
name VARCHAR(100),
password VARCHAR(50)
)

CREATE TABLE _event.events(
id BIGINT IDENTITY PRIMARY KEY NOT NULL,
creatorid BIGINT FOREIGN KEY REFERENCES _user.e_creator(id),
name VARCHAR(250)
)

ALTER TABLE _event.events 
ADD 
title VARCHAR(50) NOT NULL,
event_type SMALLINT NOT NULL,
event_category SMALLINT NOT NULL,
online_event BIT NOT NULL,
event_location VARCHAR(50) NOT NULL,
event_start_date DATE NOT NULL,
event_end_date DATE NOT NULL,
frequency SMALLINT NOT NULL

ALTER TABLE _event.events 
DROP COLUMN name