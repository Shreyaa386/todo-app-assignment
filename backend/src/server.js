const express = require("express");
const cors = require("cors");
const todoRoutes = require("./routes/todoRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// API status route
app.get("/", (req, res) => {
  res.json({
    message: "Todo API is running",
    endpoints: {
      auth: "/api/auth",
      todos: "/api/todos"
    }
  });
});

// Mount Auth Routes
app.use("/api/auth", authRoutes);

// Mount Todo Routes
app.use("/api/todos", todoRoutes);

// Fallback 404 handler for unknown endpoints
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});