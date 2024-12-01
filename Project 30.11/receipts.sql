CREATE TABLE Receipts (
    receipt_id SERIAL PRIMARY KEY,        -- Unique identifier for each receipt
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Date and time of the purchase
    shop_name VARCHAR(255) NOT NULL,     -- Name of the shop where the purchase was made
    total_sum DECIMAL(10, 2) NOT NULL    -- Total sum of the purchase
);
