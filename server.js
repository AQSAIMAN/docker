// server.js
// Node.js + Express + MySQL backend with CRUD operations for "products"

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const PORT = process.env.PORT || 5000;

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());

// ---------- Root Route ----------
app.get("/", (req, res) => {
  res.json({
    message: "Products API is running",
    endpoints: {
      products: "/products",
      productById: "/products/:id"
    }
  });
});

// ---------- MySQL Connection ----------
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "operations",
  port: Number(process.env.DB_PORT) || 3307,
});

// ---------- Connect to MySQL with retry ----------
function connectWithRetry() {
  db.connect((err) => {
    if (err) {
      console.error("MySQL not ready yet. Retrying in 3 seconds...");
      console.error(err.message);

      setTimeout(connectWithRetry, 3000);
      return;
    }

    console.log("Connected to MySQL database.");

    // IMPORTANT for Docker:
    // Listen on 0.0.0.0 so the container can receive external requests.
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}

connectWithRetry();

// ---------- CREATE ----------
app.post("/products", (req, res) => {
  const { name, product } = req.body;

  if (!name || !product) {
    return res.status(400).json({
      error: "name and product are required",
    });
  }

  const sql = "INSERT INTO products (name, product) VALUES (?, ?)";

  db.query(sql, [name, product], (err, result) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }

    res.status(201).json({
      id: result.insertId,
      name,
      product,
    });
  });
});

// ---------- READ ALL ----------
app.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }

    res.json(rows);
  });
});

// ---------- READ ONE ----------
app.get("/products/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT * FROM products WHERE id = ?",
    [id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          error: err.message,
        });
      }

      if (rows.length === 0) {
        return res.status(404).json({
          error: "Product not found",
        });
      }

      res.json(rows[0]);
    }
  );
});

// ---------- UPDATE ----------
app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const { name, product } = req.body;

  if (!name || !product) {
    return res.status(400).json({
      error: "name and product are required",
    });
  }

  const sql =
    "UPDATE products SET name = ?, product = ? WHERE id = ?";

  db.query(sql, [name, product, id], (err, result) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    res.json({
      id: Number(id),
      name,
      product,
    });
  });
});

// ---------- DELETE ----------
app.delete("/products/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM products WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          error: err.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          error: "Product not found",
        });
      }

      res.json({
        message: `Product ${id} deleted successfully`,
      });
    }
  );
});   