import express from "express";
import asyncCatch from "../lib/asyncCatch.js";
import {
  login,
  logout,
  signup,
  updateProfile,
  checkAuth,
} from "../controllers/auth.controller.js";
import isLoggedIn from "../middleware/isLoggedIn.js";

const router = express.Router();

router.post("/signup", asyncCatch(signup));
router.post("/login", asyncCatch(login));
router.post("/logout", isLoggedIn, asyncCatch(logout));
router.put("/updateProfile", isLoggedIn, asyncCatch(updateProfile));
router.get("/checkAuth", isLoggedIn, asyncCatch(checkAuth));

export default router;
