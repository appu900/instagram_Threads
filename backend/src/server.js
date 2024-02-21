import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/databaseconfig.js";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/userRoutes.js";

const PORT = process.env.PORT || 5000;
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/api/users", userRoutes);


app.listen(PORT, async () => {
  await connectDB();
  console.log("Server is running on port 5000");
});
