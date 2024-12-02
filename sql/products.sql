CREATE TABLE Products (
    product_id SERIAL PRIMARY KEY,       -- Auto-incrementing unique identifier for each product
    product_name VARCHAR(255) NOT NULL, -- Name of the product
    product_description TEXT,           -- Optional description of the product
    barcode VARCHAR(20) UNIQUE NOT NULL, -- Barcode for product identification
    price DECIMAL(10, 2) NOT NULL       -- Price of the product
);
