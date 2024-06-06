/*
    Insery a new medicine_dose record
*/
INSERT INTO medicine_dose(id, medicine_id, time, dose, note)
VALUES(${id}, ${medicineId}, ${time}, ${dose}, ${note})
RETURNING *