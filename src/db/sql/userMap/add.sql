/*
    Inserts a new UserMap record.
*/

INSERT INTO user_map(id, user_id, carecicle_id) 
VALUES(${id}, ${userId}, ${carecircleId})
RETURNING *