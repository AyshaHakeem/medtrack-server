/*
    Creates table daily_log.
*/
CREATE TABLE medicine_log(
    id UUID PRIMARY KEY,
    medicine_id UUID REFERENCES medicine(id) NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    status BOOLEAN NOT NULL,
    user_id UUID REFERNCES user(id) NOT NULL
)