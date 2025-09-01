// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Supabase client using anon key from .env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY; // only anon key for client usage
export const supabase = createClient(supabaseUrl, supabaseKey);

// ES modules helpers for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to parse JSON requests (for POST/PUT)
app.use(express.json());

// Serve static files (CSS, JS, assets)
app.use(express.static(path.join(__dirname)));

// --- Serve HTML pages ---
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/signup.html", (req, res) => {
  res.sendFile(path.join(__dirname, "signup.html"));
});

app.get("/cart.html", (req, res) => {
  res.sendFile(path.join(__dirname, "cart.html"));
});

app.get("/admin.html", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

// --- Example API routes ---
// Products
app.get("/api/products", async (req, res) => {
  try {
    const { data, error } = await supabase.from("products").select("*");
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Orders (checkout)
app.post("/api/orders", async (req, res) => {
  const { user_id, cart } = req.body;
  if (!cart || cart.length === 0) return res.status(400).json({ error: "Cart is empty" });

  try {
    const { error } = await supabase.from("orders").insert(
      cart.map(item => ({
        user_id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }))
    );
    if (error) throw error;
    res.json({ success: true, message: "Order placed successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
// --- Additional routes for login, signup, cart management, admin product management can be added similarly ---