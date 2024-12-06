/*
    Inserts a new UserMap record.
*/

INSERT INTO user_map(id, user_id, carecircle_id) 
VALUES(${id}, ${userId}, ${carecircleId})
RETURNING *