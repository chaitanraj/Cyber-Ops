require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const {urlCheckController, getUrl, extensionUrlCheck} = require("./controller/urlController");

const corsOptions = {
  origin: [
    'chrome-extension://*', // Allow all Chrome extensions
    'http://localhost:*',   // Allow localhost for testing
    'https://localhost:*'   // Allow HTTPS localhost
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight OPTIONS requests
app.options('*', cors(corsOptions))

app.use(express.json());


// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));
  
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
  
app.use("/api/url", require("./routes/urlRoutes"));


// Sample route for testing
app.use("/api", require("./routes/auth"));
app.post("/check-url", extensionUrlCheck);
app.post("/api/check-url", extensionUrlCheck);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});