import express from "express";
import auth from "../middlewares/auth.js";
import {
  getProfile,
  updateProfile,
  searchBySkill,
  getUserById,
} from "../controllers/userController.js";
import { searchLimiter } from "../middlewares/rateLimit.js";
const userRoute = express.Router();
userRoute.get("/profile", auth, getProfile);
userRoute.post("/update-profile", auth, updateProfile);
userRoute.get("/search", searchLimiter, searchBySkill);
userRoute.get("/:id", auth, getUserById);
export default userRoute;
