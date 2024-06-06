/*
    Inserts a new DailyLog record.
*/
INSERT INTO daily_log(id, medicine_id, date, status, caregiver_id)
VALUES(${id}, ${medicineId}, ${date}, ${status}, ${caregiverId})
RETURNING *;
