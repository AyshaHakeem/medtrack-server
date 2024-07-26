CREATE TABLE patients (
    id UUID PRIMARY KEY,
    patient_name VARCHAR(60) NOT NULL,
    carecircle_id UUID REFERENCES carecircle(id) NOT NULL,
    created_at timestamp default CURRENT_TIMESTAMP not null
)