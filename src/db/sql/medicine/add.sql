/*
    Inserts a new Medicine record.
*/
INSERT INTO medicine(id, patient_name, carecircle_id, name, from_date, to_date, note)
VALUES(${id}, ${patientName}, ${careCircleId}, ${medicineName}, ${fromDate}, ${toDate}, ${note})
RETURNING *;
