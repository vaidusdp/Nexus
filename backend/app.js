import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());

//Basic Configurations
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));

//CORS Setup
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
  }),
);

import userRoutes from "./src/routes/auth.route.js";
app.use("/api/v1/users", userRoutes);

import lobbyRoutes from "./src/routes/lobby.route.js";
app.use("/api/v1/lobby", lobbyRoutes);

import configRouter from "./src/routes/config.route.js"
app.use('/api/v1/config', configRouter)

app.get("/", (req, res) => {
  console.log("Nexus's Here");
  res.send("Nexus API Active");
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: err.errors || [],
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

export default app;
