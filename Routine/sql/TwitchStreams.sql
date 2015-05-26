ALTER TABLE Stream DROP FOREIGN KEY FKStream81470;
ALTER TABLE Routine DROP FOREIGN KEY FKRoutine779991;
DROP TABLE IF EXISTS Stream;
DROP TABLE IF EXISTS Language;
DROP TABLE IF EXISTS `Session`;
DROP TABLE IF EXISTS Routine;
CREATE TABLE Stream (
  ID                 int(15) NOT NULL AUTO_INCREMENT, 
  Game               varchar(500), 
  Viewers            int(6), 
  Created_at         timestamp NULL comment 'uptime of the stream', 
  Average_FPS        int(10), 
  Preview            varchar(255), 
  Display_name       varchar(100) NOT NULL, 
  Logo               varchar(255), 
  isMature           tinyint(1) DEFAULT 0, 
  Status             varchar(255), 
  isPartner          tinyint(1) DEFAULT 0, 
  URL                varchar(255), 
  Channel_created_at timestamp NULL, 
  Followers          int(10) DEFAULT 0, 
  Views              int(10) DEFAULT 0, 
  LanguageID         int(10), 
  PRIMARY KEY (ID));
CREATE TABLE Language (
  ID       int(10) NOT NULL AUTO_INCREMENT, 
  Language varchar(50) NOT NULL UNIQUE, 
  Code     char(2) NOT NULL UNIQUE, 
  PRIMARY KEY (ID));
CREATE TABLE `Session` (
  ID       int(15) NOT NULL AUTO_INCREMENT, 
  Start_at timestamp NOT NULL, 
  End_at   timestamp NULL, 
  Log_file varchar(100), 
  PRIMARY KEY (ID));
CREATE TABLE Routine (
  ID        int(15) NOT NULL AUTO_INCREMENT, 
  SessionID int(15) NOT NULL, 
  Number    int(10) NOT NULL, 
  Valid     int(10) NOT NULL, 
  Invalid   int(10) NOT NULL, 
  Ratio     float NOT NULL, 
  PRIMARY KEY (ID, 
  SessionID));
ALTER TABLE Stream ADD INDEX FKStream81470 (LanguageID), ADD CONSTRAINT FKStream81470 FOREIGN KEY (LanguageID) REFERENCES Language (ID) ON UPDATE Cascade ON DELETE No action;
ALTER TABLE Routine ADD INDEX FKRoutine779991 (SessionID), ADD CONSTRAINT FKRoutine779991 FOREIGN KEY (SessionID) REFERENCES `Session` (ID) ON UPDATE Cascade ON DELETE Cascade;
