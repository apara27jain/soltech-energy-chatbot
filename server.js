const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path"); // Import the built-in path module

// Explicitly point to the .env file in the current directory
dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();

app.use(cors());
app.use(express.json());

// 1. Added Home Route to handle http://localhost:5000/
app.get("/", (req, res) => {
  res.send("🚀 Soltech Energy Chatbot Backend is running successfully!");
});

// Your API routes
const leadRoutes = require("./routes/leads");
app.use("/api/leads", leadRoutes);

// Debugging line to verify the URI is loading before trying to connect
console.log("Checking URI:", process.env.MONGO_URI ? "Found! ✅" : "Still Undefined ❌");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server Running On Port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Error");
    console.log(err);
  });