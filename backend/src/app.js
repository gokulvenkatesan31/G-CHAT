import express from "express";
import connectDB from "./lib/connectDB.js";
import dotenv from "dotenv";
import cors from "cors";
import authRoute from "./routes/auth.route.js";
import messagesRoute from "./routes/messages.route.js";
import cookieParser from "cookie-parser";
import { app, server } from "./lib/socket.js"; // Import the socket server

dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173", // or the frontend Postman origin
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/messages", messagesRoute);

server.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port:" + PORT);
});
