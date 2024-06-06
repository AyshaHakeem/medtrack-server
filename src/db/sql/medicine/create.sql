/*
    Creates table medicine.
*/
CREATE TABLE medicine
(
    id UUID PRIMARY KEY,
    patient_name VARCHAR(60) NOT NULL,
    carecircle_id UUID REFERENCES carecircle(id) NOT NULL,
    name VARCHAR(100) NOT NULL,
    from_date TIMESTAMPTZ NOT NULL,
    to_date TIMESTAMPTZ NOT NULL,
    note VARCHAR(200)
);
