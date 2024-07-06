INSERT INTO patients(id, patient_name, carecircle_id, created_at)
VALUES(${id}, ${patientName}, ${careCircleId},CURRENT_TIMESTAMP)
RETURNING *