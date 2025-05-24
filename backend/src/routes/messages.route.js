import express from "express";
import asyncCatch from "../lib/asyncCatch.js";
import {
  getUserForSidebar,
  getMessages,
  sendMessage,
} from "../controllers/messages.controller.js";
import isLoggedIn from "../middleware/isLoggedIn.js";

const router = express.Router();

router.get("/users", isLoggedIn, asyncCatch(getUserForSidebar));
router.get("/:id", isLoggedIn, asyncCatch(getMessages));
router.post("/send/:id", isLoggedIn, asyncCatch(sendMessage));
export default router;
