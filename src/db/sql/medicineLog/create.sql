/*
    Creates table daily_log.
*/
CREATE TABLE medicine_log(
    id UUID PRIMARY KEY,
    dose_id UUID REFERENCES medicine(id) NOT NULL,
    date timestamp default CURRENT_TIMESTAMP not null
    user_id UUID REFERNCES user(id) NOT NULL
)