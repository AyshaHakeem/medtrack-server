INSERT INTO invites(id, email, user_id, carecircle_id, status)
values(${id}, ${email}, ${userId}, ${carecircleId}, ${status})
RETURNING *