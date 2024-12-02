CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,         -- Auto-incrementing unique identifier for each user
    first_name VARCHAR(255) NOT NULL,  -- First name of the user
    last_name VARCHAR(255) NOT NULL,   -- Last name of the user
    email VARCHAR(255) UNIQUE NOT NULL, -- Email address for contact
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp when the user was created
);
