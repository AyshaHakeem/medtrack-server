/*
    Create table UserMap .
*/

CREATE TABLE user_map(
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES user(id) NOT NULL,
    carecircle_id UUID REFERENCES carecircle(id) NOT NULL,
)