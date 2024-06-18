CREATE TABLE invites(
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    user_id UUID REFERENCES users(id) NOT NULL,
    carecircle_id UUID REFERENCES carecircle(id) NOT NULL
)