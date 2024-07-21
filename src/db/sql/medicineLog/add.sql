/*
    Inserts a new DailyLog record.
*/
INSERT INTO daily_log(id, dose_id, user_id, date)
VALUES(${id}, ${doseId}, ${userId}, CURRENT_TIMESTAMP)
RETURNING *;
