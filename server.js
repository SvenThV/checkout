const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files from the root

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// PostgreSQL connection
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "barcode_scanner",
    password: "your_password",
    port: 5432,
});

// Global variables
let cart = [];
let receipts = []; // In-memory receipts

// API endpoint to fetch a product by barcode
app.get("/api/products/:barcode", async (req, res) => {
    const { barcode } = req.params;

    try {
        // Query the database for the product with the provided barcode
        const result = await pool.query("SELECT * FROM products WHERE barcode = $1", [barcode]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Error fetching product by barcode:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});


// API endpoint to add a product to the cart
app.post("/api/cart", async (req, res) => {
    const { product_id, product_name, price } = req.body;

    if (!product_id || !product_name || typeof price === "undefined" || isNaN(price)) {
        console.error("Invalid product data received:", req.body);
        return res.status(400).json({ message: "Invalid product data" });
    }

    try {
        const existing = await pool.query(
            "SELECT * FROM cart WHERE product_id = $1",
            [product_id]
        );

        if (existing.rows.length > 0) {
            await pool.query(
                "UPDATE cart SET quantity = quantity + 1 WHERE product_id = $1",
                [product_id]
            );
        } else {
            await pool.query(
                "INSERT INTO cart (product_id, product_name, price, quantity) VALUES ($1, $2, $3, $4)",
                [product_id, product_name, price, 1]
            );
        }

        res.status(200).json({ message: "Product added to cart" });
    } catch (err) {
        console.error("Error adding to cart:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// API endpoint to retrieve cart items
app.get("/api/cart", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                c.*, 
                EXISTS (
                    SELECT 1 
                    FROM bookmarks b 
                    WHERE b.product_id = c.product_id
                ) AS bookmarked
            FROM cart c
            ORDER BY c.id ASC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching cart items:", err);
        res.status(500).json({ message: "Server error" });
    }
});



// API endpoint to update product quantity
app.put("/api/cart/:productId", async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
    }

    try {
        // Update the quantity for the given product
        const result = await pool.query(
            "UPDATE cart SET quantity = $1 WHERE product_id = $2 RETURNING *",
            [quantity, productId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        console.log("Updated product quantity:", result.rows[0]);
        res.status(200).json({ message: "Quantity updated", product: result.rows[0] });
    } catch (err) {
        console.error("Error updating quantity:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// API endpoint to remove a specific product from the cart
app.delete("/api/cart/:productId", async (req, res) => {
    const { productId } = req.params;

    try {
        // Attempt to delete the product from the database
        const result = await pool.query("DELETE FROM cart WHERE product_id = $1 RETURNING *", [productId]);

        // Check if a row was deleted
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        res.status(200).json({ message: "Product removed from cart", deletedProduct: result.rows[0] });
    } catch (err) {
        console.error("Error removing product from cart:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// API endpoint to clear the cart (checkout)
app.post("/api/cart/checkout", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM cart");
        if (result.rows.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        const receipt = {
            products: result.rows.map(item => ({
                name: item.product_name,
                quantity: item.quantity,
                price: item.price,
            })),
            totalAmount: result.rows
                .reduce((sum, item) => sum + item.price * item.quantity, 0)
                .toFixed(2),
            date: new Date().toLocaleString(),
        };

        await pool.query("DELETE FROM cart");

        res.status(200).json({ message: "Checkout successful", receipt });
    } catch (err) {
        console.error("Error during checkout:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// API endpoint to add a product to bookmarks
app.post("/api/bookmarks", async (req, res) => {
    const { product_id } = req.body;

    if (!product_id) {
        console.error("Invalid product data received:", req.body);
        return res.status(400).json({ message: "Invalid product data" });
    }

    try {
        // Fetch product details from the products table
        const product = await pool.query("SELECT * FROM products WHERE product_id = $1", [product_id]);

        if (product.rows.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        const { product_name, price } = product.rows[0];

        const result = await pool.query(
            `INSERT INTO bookmarks (product_id, product_name, price) 
             VALUES ($1, $2, $3) 
             ON CONFLICT (product_id) DO NOTHING RETURNING *`,
            [product_id, product_name, price]
        );

        if (result.rowCount === 0) {
            return res.status(409).json({ message: "Product is already bookmarked" });
        }

        res.status(200).json({ message: "Product bookmarked successfully", bookmark: result.rows[0] });
    } catch (err) {
        console.error("Error adding bookmark:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

// API endpoint to retrieve bookmarks
app.get("/api/bookmarks", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT * 
            FROM bookmarks
            ORDER BY product_id ASC
        `);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching bookmarks:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

// API endpoint to remove a bookmark
app.delete("/api/bookmarks/:productId", async (req, res) => {
    const { productId } = req.params;

    if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
    }

    try {
        const result = await pool.query(
            "DELETE FROM bookmarks WHERE product_id = $1 RETURNING *",
            [productId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Bookmark not found" });
        }

        res.status(200).json({ message: "Bookmark removed successfully" });
    } catch (err) {
        console.error("Error removing bookmark:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

// Validation for cart items (assuming cart is loaded in memory)
const isValidCart = cart.every(item =>
    typeof item.product_name === "string" &&
    typeof item.price === "number" &&
    item.price > 0 &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
);

if (!isValidCart) {
    return res.status(400).send("Invalid cart data. Please check your cart.");
}

// Stripe payment process
const stripe = require("stripe")("sk_test_51QR9TSA9PYZCuSc2z5fm8OsTRe93X3x2nV1LXtYzQLh74Rj5z5h3PVQLCh20EUYc1Cj5DIoGHA52ICwi1vLSO4LW008de7QDSr");

app.post("/api/stripe/create-checkout-session", async (req, res) => {
    const cart = req.body.cart;

    if (!Array.isArray(cart) || cart.length === 0) {
        return res.status(400).json({ message: "Cart is empty. Cannot proceed." });
    }

    const isValidCart = cart.every(item =>
        typeof item.product_name === "string" &&
        typeof item.price === "number" &&
        item.price > 0 &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
    );

    if (!isValidCart) {
        return res.status(400).json({ message: "Invalid cart data. Please check your cart." });
    }

    try {
        const payload = {
            payment_method_types: ["card"],
            line_items: cart.map(item => ({
                price_data: {
                    currency: "usd",
                    product_data: { name: item.product_name },
                    unit_amount: Math.round(item.price * 100),
                },
                quantity: item.quantity,
            })),
            mode: "payment",
            success_url: "http://localhost:5000/success.html",
            cancel_url: "http://localhost:5000/cart.html",
            locale: "en",
        };

        const session = await stripe.checkout.sessions.create(payload);
        res.json({ sessionId: session.id });
    } catch (err) {
        console.error("Error creating Stripe checkout session:", err);
        res.status(500).json({ message: "Failed to create checkout session" });
    }
});

// API to handle successful payments and generate a receipt
app.post("/api/stripe/payment-success", async (req, res) => {
    try {
        const shopName = req.body.shopName || "Unknown Shop";

        // Fetch the cart items from the database
        const result = await pool.query("SELECT * FROM cart");
        if (result.rows.length === 0) {
            return res.status(400).send("Cart is empty. Cannot create a receipt.");
        }

        // Generate receipt details
        const receipt = {
            shopName,
            products: result.rows.map(item => ({
                name: item.product_name,
                quantity: item.quantity,
                price: item.price,
            })),
            totalAmount: result.rows
                .reduce((sum, item) => sum + item.price * item.quantity, 0)
                .toFixed(2),
            date: new Date().toLocaleString(),
        };

        // Save the receipt in memory (or persist it in the database)
        receipts.push(receipt);

        // Clear the cart from the database
        await pool.query("DELETE FROM cart");

        res.status(200).send("Payment successful and receipt generated.");
    } catch (err) {
        console.error("Error during payment success processing:", err);
        res.status(500).send("Failed to process payment and generate receipt.");
    }
});

// API to retrieve all receipts
app.get("/api/receipts", (req, res) => {
    res.json(receipts);
});