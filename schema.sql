CREATE TABLE Products (
    product_id SERIAL PRIMARY KEY,       -- Auto-incrementing unique identifier for each product
    product_name VARCHAR(255) NOT NULL, -- Name of the product
    product_description TEXT,           -- Optional description of the product
    barcode VARCHAR(20) UNIQUE NOT NULL, -- Barcode for product identification
    price DECIMAL(10, 2) NOT NULL       -- Price of the product
);

INSERT INTO Products (product_id, product_name, product_description, barcode, price) VALUES  
-- Snacks
(1, 'Lays Classic Chips', 'Crispy and salty potato chips', '0123456789015', 1.50),
(2, 'Doritos Nacho Cheese', 'Corn chips with a cheesy flavor', '0234567890128', 2.00),
(3, 'Pringles Original', 'Stackable potato crisps', '0345678901231', 1.75),
(4, 'Ritz Crackers', 'Butter-flavored crackers', '0456789012344', 2.50),
(5, 'Oreos', 'Chocolate sandwich cookies with cream filling', '0567890123457', 3.00),
(6, 'Cheez-It', 'Baked cheese crackers', '0678901234560', 2.25),
(7, 'Goldfish Crackers', 'Cheddar-flavored crackers', '0789012345673', 2.00),
(8, 'Cheetos Crunchy', 'Crunchy cheese snacks', '0890123456786', 1.75),
(9, 'Popcorn Microwaveable Butter', 'Butter-flavored microwave popcorn', '0901234567899', 3.50),
(10, 'Pretzels', 'Salty baked pretzels', '0123456789012', 2.25),

-- Chocolate Bars
(11, 'Snickers', 'Chocolate bar with nougat, caramel, and peanuts', '0223456789019', 1.25),
(12, 'Twix', 'Chocolate bar with biscuit and caramel', '0323456789012', 1.50),
(13, 'KitKat', 'Crispy wafer fingers covered with chocolate', '0423456789015', 1.75),
(14, 'Mars Bar', 'Chocolate nougat with caramel', '0523456789018', 1.50),
(15, 'Hershey''s Milk Chocolate', 'Creamy milk chocolate bar', '0623456789011', 1.25),
(16, 'M&M''s Peanut', 'Candy-coated chocolate with peanuts', '0723456789014', 1.50),
(17, 'Reese''s Peanut Butter Cups', 'Chocolate cups filled with peanut butter', '0823456789017', 1.75),
(18, 'Toblerone', 'Swiss chocolate with honey and almond nougat', '0923456789010', 2.50),
(19, 'Milky Way', 'Chocolate-covered nougat with caramel', '0133456789016', 1.50),
(20, 'Cadbury Dairy Milk', 'Rich and creamy milk chocolate', '0143456789019', 2.00),

-- Drinks
(21, 'Coca-Cola', 'Classic carbonated soft drink', '0233456789015', 1.25),
(22, 'Pepsi', 'Carbonated cola soft drink', '0333456789018', 1.25),
(23, 'Sprite', 'Lemon-lime flavored soft drink', '0433456789011', 1.25),
(24, 'Fanta Orange', 'Orange-flavored soda', '0533456789014', 1.25),
(25, 'Mountain Dew', 'Citrus-flavored soda', '0633456789017', 1.50),
(26, 'Dr Pepper', 'Unique blend of 23 flavors', '0733456789010', 1.50),
(27, 'Red Bull', 'Energy drink with taurine and caffeine', '0833456789013', 2.50),
(28, 'Monster Energy', 'Energy drink with a bold flavor', '0933456789016', 2.50),
(29, 'Gatorade Lemon-Lime', 'Sports drink for hydration', '0113456789010', 1.75),
(30, 'Lipton Iced Tea', 'Refreshing lemon-flavored tea', '0213456789013', 1.50),

-- Candy
(31, 'Skittles', 'Fruity candy with a chewy texture', '0313456789016', 1.25),
(32, 'Starburst', 'Chewy fruit-flavored candy', '0413456789019', 1.25),
(33, 'Haribo Goldbears', 'Gummy bear candies', '0513456789012', 2.00),
(34, 'Jelly Belly', 'Assorted gourmet jelly beans', '0613456789015', 2.50),
(35, 'Sour Patch Kids', 'Sour-coated gummy candies', '0713456789018', 1.75),
(36, 'Airheads', 'Chewy taffy candy with fruity flavors', '0813456789011', 1.00),
(37, 'Laffy Taffy', 'Fruity and stretchy taffy', '0913456789014', 1.00),
(38, 'Dubble Bubble', 'Classic bubble gum', '0123457789018', 1.00),
(39, 'Smarties', 'Colorful candy-coated chocolate', '0223457789011', 1.25),
(40, 'Warheads', 'Extreme sour hard candy', '0323457789014', 1.50),

-- Miscellaneous
(41, 'Nutella', 'Hazelnut spread with cocoa', '0423457789017', 3.50),
(42, 'Peanut Butter', 'Creamy peanut spread', '0523457789010', 2.50),
(43, 'Hershey''s Syrup', 'Chocolate syrup for desserts', '0623457789013', 2.75),
(44, 'Pop-Tarts', 'Frosted toaster pastries', '0723457789016', 3.25),
(45, 'Breakfast Cereal', 'Assorted cereal variety', '0823457789019', 4.00),
(46, 'Ketchup', 'Tomato-based condiment', '0923457789012', 2.00),
(47, 'Mayonnaise', 'Creamy condiment for sandwiches', '0133457789017', 2.50),
(48, 'Mustard', 'Tangy mustard condiment', '0143457789010', 2.25),
(49, 'Pickles', 'Jar of dill pickles', '0233457789014', 3.00),
(50, 'Hot Sauce', 'Spicy chili sauce', '0333457789017', 1.75);

CREATE TABLE ReceiptItems (
    receipt_item_id SERIAL PRIMARY KEY,  -- Unique identifier for each item in a receipt
    receipt_id INT NOT NULL REFERENCES Receipts(receipt_id) ON DELETE CASCADE, -- Links to Receipts table
    product_id INT NOT NULL REFERENCES Products(product_id) ON DELETE CASCADE, -- Links to Products table
    quantity INT NOT NULL,              -- Quantity of the product purchased
    price DECIMAL(10, 2) NOT NULL       -- Price of the product at the time of purchase
);

CREATE TABLE Receipts (
    receipt_id SERIAL PRIMARY KEY,                     -- Unique identifier for each receipt
    user_id UUID NOT NULL,                             -- Identifier for the user associated with the receipt
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Date and time of the purchase
    shop_name VARCHAR(255) NOT NULL,                  -- Name of the shop where the purchase was made
    total_sum DECIMAL(10, 2) NOT NULL,                -- Total sum of the purchase
);

CREATE TABLE Bookmarks (
    bookmark_id SERIAL PRIMARY KEY,       -- Unique identifier for each bookmark
    product_id INT NOT NULL,              -- Identifier for the product
    product_name VARCHAR(255),            -- Name of the product (nullable)
    price DECIMAL(10, 2),                 -- Price of the product (nullable)
    user_id UUID NOT NULL,                -- Identifier for the user
);

CREATE TABLE Cart (
    id SERIAL PRIMARY KEY,                       -- Unique identifier for each cart entry
    product_id INT NOT NULL,                     -- Identifier for the product
    product_name VARCHAR(255),                   -- Name of the product
    price DECIMAL(10, 2),                        -- Price of the product
    quantity INT NOT NULL,                       -- Quantity of the product
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the cart item was added
    shop_name VARCHAR(255),                      -- Name of the shop
    user_id UUID NOT NULL,                       -- Identifier for the user
    total_amount DECIMAL(10, 2),                 -- Total amount for this cart entry
);