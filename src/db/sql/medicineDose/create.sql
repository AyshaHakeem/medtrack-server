/*
    Creates table medicine_dose.
*/
CREATE TABLE medicine_dose
(
    id uuid PRIMARY KEY,
    medicine_id UUID REFERENCES medicine(id) NOT NULL,
    time TIME NOT NULL,
    dose VARCHAR(60) NOT NULL,
    note VARCHAR(120)
);
