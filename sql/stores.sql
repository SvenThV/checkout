CREATE TABLE Stores (
    store_id SERIAL PRIMARY KEY,       -- Unique identifier for each store
    shop_name VARCHAR(255) NOT NULL   -- Name of the store
);


INSERT INTO Stores (shop_name) VALUES
('Hanaro Mart'),
('CU'),
('GS25'),
('7-Eleven'),
('Emart24'),
('Lotte Super'),
('E-Mart'),
('Homeplus'),
('Lotte Mart');

