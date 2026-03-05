import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import paymentRoutes from "./src/routes/payment.routes.js";



const app = express();


/* -------------------- MIDDLEWARE -------------------- */

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

/* -------------------- ROUTES -------------------- */

app.get("/", (req, res) => {
  res.status(200).json({ message: "Payment service running" });
});

app.use("/api", paymentRoutes);

/* -------------------- ERROR HANDLER -------------------- */

app.use((err, req, res, next) => {
  console.error("Global Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

/* -------------------- SERVER -------------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
