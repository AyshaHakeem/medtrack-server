/*
    Inserts a new DailyLog record.
*/
INSERT INTO daily_log(id, dose_id, date, status, user_id)
VALUES(${id}, ${doseId}, ${date}, ${status}, ${userId})
RETURNING *;
