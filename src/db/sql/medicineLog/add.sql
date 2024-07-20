/*
    Inserts a new DailyLog record.
*/
INSERT INTO daily_log(id, dose_id, date, user_id)
VALUES(${id}, ${doseId}, ${time}, ${userId})
RETURNING *;
