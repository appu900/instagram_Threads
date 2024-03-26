import express from "express";
import UserController from "../controllers/userController.js";
import protectedRoutes from "../middlewares/protectedRoutes.js";
const router = express.Router();


router.get("/profile/:username",UserController.getUserProfile);
router.get("/profile/id/:id",UserController.getUserProfileById);
router.post("/signup", UserController.createUser);
router.post("/login", UserController.loginUser);
router.post("/logout", UserController.logoutUser);
router.post("/follow/:id",protectedRoutes, UserController.followUser);
router.put("/update/:id", protectedRoutes, UserController.updateUser);
router.get("/allusers", UserController.getAllUsers);


export default router;
