import express from "express";
import { signup, login } from "../controllers/authController.js";
import { authLimiter } from "../middlewares/rateLimit.js";
const authRoute = express.Router();
authRoute.post("/signup", authLimiter, signup);
authRoute.post("/login", authLimiter, login);
export default authRoute;
