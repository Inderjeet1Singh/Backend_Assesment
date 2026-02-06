import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./connections/dbConnect.js";
import authRoute from "./routes/authRoutes.js";
import userRoute from "./routes/userRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use("/auth", authRoute);
app.use("/user", userRoute);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
