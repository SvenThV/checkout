CREATE TABLE ReceiptItems (
    receipt_item_id SERIAL PRIMARY KEY,  -- Unique identifier for each item in a receipt
    receipt_id INT NOT NULL REFERENCES Receipts(receipt_id) ON DELETE CASCADE, -- Links to Receipts table
    product_id INT NOT NULL REFERENCES Products(product_id) ON DELETE CASCADE, -- Links to Products table
    quantity INT NOT NULL,              -- Quantity of the product purchased
    price DECIMAL(10, 2) NOT NULL       -- Price of the product at the time of purchase
);
