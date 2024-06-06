/*
    Inserts a new DailyLog record.
*/
INSERT INTO daily_log(id, medicine_id, date, status, user_id)
VALUES(${id}, ${medicineId}, ${date}, ${status}, ${userId})
RETURNING *;
