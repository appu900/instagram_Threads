import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/databaseconfig.js";
import cookieParser from "cookie-parser";
import {v2 as cloudinary} from "cloudinary";
import bodyParser from "body-parser";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";

const PORT = process.env.PORT || 5000;
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const app = express();
app.use(cors(
  {
    origin: "http://localhost:3000",
  }
));
app.use(express.json({limit:"50mb"}));
app.use(express.urlencoded({limit:"50mb", extended: true}));
app.use(cookieParser());





app.use("/api/users", userRoutes);
app.use("/api/posts",postRoutes);


app.listen(PORT, async () => {
  await connectDB();
  console.log("Server is running on port 5000");
});
