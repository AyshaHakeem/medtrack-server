/*
    Inserts a new CareCircle record.
*/
INSERT INTO carecircle(id, name)
VALUES(${id}, ${name})
RETURNING *;
