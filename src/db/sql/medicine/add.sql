/*
    Inserts a new Medicine record.
*/
INSERT INTO medicine(id, patient_id, carecircle_id, name, from_date, to_date, note)
VALUES(${id}, ${patientId}, ${careCircleId}, ${medicineName}, ${fromDate}, ${toDate}, ${note})
RETURNING *;
