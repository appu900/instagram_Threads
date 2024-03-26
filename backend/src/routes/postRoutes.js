import express from "express";
import postController from "../controllers/postController.js";
import protectedRoutes from "../middlewares/protectedRoutes.js";
const router = express.Router();

router.get("/feed", protectedRoutes, postController.getAllPosts);
router.get("/user/posts/:username", postController.getProfilePosts);
router.post("/create", protectedRoutes, postController.createPost);
router.get("/:id", postController.getPost);
router.delete("/:id", protectedRoutes, postController.deletePost);
router.post("/like/:id", protectedRoutes, postController.likeAndUnlikePost);
router.post("/reply/:id", protectedRoutes, postController.replyToPost);

// for explore page

router.get("/feed/explore", postController.getExplorePosts);

export default router;
