const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
    user: "postgres",       // Replace with your PostgreSQL username
    host: "localhost",      // Replace with your PostgreSQL host
    database: "barcode_scanner", // Replace with your database name
    password: "your_password",   // Replace with your PostgreSQL password
    port: 5432,             // Default PostgreSQL port
});

// In-memory cart to store scanned products
let cart = [];

// API endpoint to fetch shops
app.get("/api/shops", async (req, res) => {
    try {
        const result = await pool.query("SELECT shop_name FROM Stores");
        res.json(result.rows); // Return the list of shops
    } catch (err) {
        console.error("Error fetching shops:", err.message);
        res.status(500).json({ message: "Server Error" });
    }
});

// API endpoint to fetch products by barcode
app.get("/api/products/:barcode", async (req, res) => {
    const { barcode } = req.params;
    try {
        const result = await pool.query("SELECT * FROM Products WHERE barcode = $1", [barcode]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(result.rows[0]); // Return the product details
    } catch (err) {
        console.error("Error fetching product:", err.message);
        res.status(500).json({ message: "Server Error" });
    }
});

// API endpoint to add a product to the cart
app.post("/api/cart", (req, res) => {
    const product = req.body;
    if (!product || !product.product_id) {
        console.log("Invalid product data received:", product);
        return res.status(400).json({ message: "Invalid product data" });
    }
    cart.push(product);
    console.log("Product added to cart:", product); // Log added product
    console.log("Current cart state:", cart); // Log the entire cart
    res.status(200).send("Product added to cart");
});

// API endpoint to retrieve cart items
app.get("/api/cart", (req, res) => {
    res.json(cart); // Return all items in the cart
});

// API endpoint to clear the cart (checkout)
app.post("/api/cart/checkout", (req, res) => {
    if (cart.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
    }
    cart = []; // Clear the cart
    res.status(200).send("Checkout successful. Cart is now empty.");
});

// API endpoint to remove a specific product from the cart
app.delete("/api/cart/:productId", (req, res) => {
    const { productId } = req.params;
    const initialCartLength = cart.length;
    cart = cart.filter((item) => item.product_id != productId); // Remove product by ID
    if (cart.length === initialCartLength) {
        return res.status(404).json({ message: "Product not found in cart" });
    }
    res.status(200).send("Product removed from cart");
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


