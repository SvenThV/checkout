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

// In-memory cart to store scanned products
let cart = [];

// API endpoint to fetch products by barcode
app.get("/api/products/:barcode", async (req, res) => {
    const { barcode } = req.params;
    try {
        const result = await pool.query("SELECT * FROM Products WHERE barcode = $1", [barcode]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// API endpoint to add a product to the cart
app.post("/api/cart", (req, res) => {
    const product = req.body;

    if (!product || !product.product_id || typeof product.price === "undefined") {
        return res.status(400).json({ message: "Invalid product data" });
    }

    const existingProduct = cart.find(item => item.product_id === product.product_id);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }
    res.status(200).json(cart);
});

// API endpoint to retrieve cart items
// API endpoint to retrieve cart items
app.get("/api/cart", async (req, res) => {
    try {
        // Ensure all products in the cart have valid price values
        const validatedCart = cart.map(item => ({
            ...item,
            price: parseFloat(item.price) || 0, // Convert price to number or default to 0
        }));
        res.json(validatedCart);
    } catch (error) {
        console.error("Error fetching cart items:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// API endpoint to update product quantity
app.put("/api/cart/:productId", (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
        cart = cart.filter(item => String(item.product_id) !== String(productId));
        return res.status(200).send("Product removed from cart");
    }

    const product = cart.find(item => String(item.product_id) === String(productId));
    if (!product) {
        return res.status(404).json({ message: "Product not found in cart" });
    }

    product.quantity = quantity;
    res.status(200).send("Quantity updated");
});

// API endpoint to remove a specific product from the cart
app.delete("/api/cart/:productId", (req, res) => {
    const { productId } = req.params;

    const initialCartLength = cart.length;
    cart = cart.filter(item => String(item.product_id) !== String(productId)); // Ensure type match

    if (cart.length === initialCartLength) {
        return res.status(404).json({ message: "Product not found in cart" });
    }

    res.status(200).send("Product removed from cart");
});

// API endpoint to clear the cart (checkout)
app.post("/api/cart/checkout", (req, res) => {
    if (cart.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
    }

    try {
        // Create receipt for the checkout
        const receipt = {
            products: cart.map(item => ({
                name: item.product_name,
                quantity: item.quantity,
                price: item.price,
            })),
            totalAmount: cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2),
            date: new Date().toLocaleString(),
        };

        receipts.push(receipt); // Save receipt
        cart = []; // Clear the cart

        res.status(200).json({ message: "Checkout successful.", receipt });
    } catch (error) {
        console.error("Error during checkout:", error);
        res.status(500).json({ message: "Checkout failed due to server error." });
    }
});

// API endpoint to add a product to bookmarks
app.post("/api/bookmarks", async (req, res) => {
    const { product_id, product_name, price } = req.body;

    if (!product_id || !product_name || price === undefined) {
        console.log("Invalid product data received:", req.body);
        return res.status(400).json({ message: "Invalid product data" });
    }

    try {
        const productCheck = await pool.query("SELECT * FROM Products WHERE product_id = $1", [product_id]);
        if (productCheck.rows.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        const result = await pool.query(
            "INSERT INTO bookmarks (product_id, product_name, price) VALUES ($1, $2, $3) RETURNING *",
            [product_id, product_name, price]
        );
        res.status(200).json({ message: "Product bookmarked successfully", bookmark: result.rows[0] });
    } catch (err) {
        if (err.code === "23505") { // Unique constraint violation
            return res.status(400).json({ message: "Product is already bookmarked" });
        }
        console.error("Error adding bookmark:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

// API endpoint to retrieve bookmarks
app.get("/api/bookmarks", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM bookmarks");
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching bookmarks:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

// API endpoint to remove a bookmark
app.delete("/api/bookmarks", async (req, res) => {
    const { product_id } = req.body;

    if (!product_id) {
        return res.status(400).json({ message: "Product ID is required" });
    }

    try {
        const result = await pool.query("DELETE FROM bookmarks WHERE product_id = $1 RETURNING *", [product_id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Bookmark not found" });
        }
        res.status(200).json({ message: "Bookmark removed successfully" });
    } catch (err) {
        console.error("Error removing bookmark:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

// Root route for welcome message
app.get("/", (req, res) => {
    res.send("Welcome to the Barcode Scanner API!");
});

// Stripe payment process
const stripe = require("stripe")("sk_test_51QR9TSA9PYZCuSc2z5fm8OsTRe93X3x2nV1LXtYzQLh74Rj5z5h3PVQLCh20EUYc1Cj5DIoGHA52ICwi1vLSO4LW008de7QDSr");

app.post("/api/stripe/create-checkout-session", async (req, res) => {
    try {
        const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2) * 100; // Convert to cents

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: cart.map(item => ({
                price_data: {
                    currency: "usd",
                    product_data: { name: item.product_name },
                    unit_amount: Math.round(item.price * 100), // Convert price to cents
                },
                quantity: item.quantity,
            })),
            mode: "payment",
            success_url: "http://localhost:5000/success.html",
            cancel_url: "http://localhost:5000/cart.html",
            locale: "en",
        });

        res.json({ sessionId: session.id });
    } catch (err) {
        console.error("Error creating Stripe checkout session:", err);
        res.status(500).send("Failed to create checkout session");
    }
});

// API to handle successful payments and generate a receipt
app.post("/api/stripe/payment-success", (req, res) => {
    const shopName = req.body.shopName || "Unknown Shop";
    if (cart.length === 0) {
        return res.status(400).send("Cart is empty. Cannot create a receipt.");
    }

    const receipt = {
        shopName,
        products: cart.map(item => ({
            name: item.product_name,
            quantity: item.quantity,
            price: item.price,
        })),
        totalAmount: cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2),
        date: new Date().toLocaleString(),
    };

    receipts.push(receipt);
    cart = []; // Clear the cart after checkout
    res.status(200).send("Payment successful and receipt generated.");
});

// API to retrieve all receipts
app.get("/api/receipts", (req, res) => {
    res.json(receipts);
});