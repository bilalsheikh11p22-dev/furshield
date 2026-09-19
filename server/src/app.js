import express from "express";
import cors from "cors";
// ... aapke baqi purane imports (routes wagaira)
import { connectDB } from "./config/db.js";   // <-- NAYA

const app = express();

app.use(cors(/* aapki purani cors settings */));
app.use(express.json());

// NAYA: har request se pehle DB connection confirm karega
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// ... yahan aapke purane routes (app.use("/api/...", ...))
// ... aapka 404 handler aur error handler

export default app;