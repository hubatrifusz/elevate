CREATE TABLE IF NOT EXISTS AspNetUsers(
  Id char PRIMARY KEY,
  Email varchar(255),
  FirstName longtext,
  LastName longtext
);

INSERT INTO AspNetUsers(Id, Email, FirstName, LastName) VALUES
  ('08dd6065-5177-41ca-81b0-3ee0511bbcc0', 'asd@asd.asd', 'Bela', 'Toth')