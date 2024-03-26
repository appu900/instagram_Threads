import Post from "../models/Post_Model.js";
import User from "../models/User_Model.js";
import {v2 as cloudinary} from "cloudinary";

class postController {
  // ** purpose : create a post

  static async createPost(request, response) {
    try {
      const { postedBy, title} = request.body;
      let{image} = request.body;

      if (!postedBy || !title) {
        return response.status(400).json({ error: "All fields are required" });
      }

      //   check the user exists or not
      const user = await User.findById(postedBy);
      if (!user) {
        return response.status(404).json({ error: "User not found" });
      }

      if (user._id.toString() !== request.user._id.toString()) {
        return response
          .status(403)
          .json({ error: "You are not authorized to perform this action" });
      }

      const maxLength = 500;
      if (title.length > maxLength) {
        return response
          .status(400)
          .json({ error: `Title should not exceed ${maxLength} characters` });
      }

      // if we have a image use cloudinary to upload the image
      // if we don't have a image then create a post without image

      if(image){
        // upload the image to cloudinary
        const uploadedResponse = await cloudinary.uploader.upload(image);
        image = uploadedResponse.secure_url;
      }

      const newPost = new Post({
        postedBy,
        title,
        image,
      });

      const savedPost = await newPost.save();

      return response
        .status(201)
        .json({ message: "Post created successfully", savedPost });
    } catch (error) {
      console.log("Error in postController.createPost: ", error.message);
      return response.status(500).json({ error: error.message });
    }
  }

  //   ** purpose : get a post

  static async getPost(request, response) {
    try {
      const { id } = request.params;
      const post = await Post.findById(id);
      if (!post) {
        return response.status(404).json({ error: "Post not found" });
      }
      return response.status(200).json(post);
    } catch (error) {
      console.log("Error in postController.getPost: ", error.message);
      return response.status(500).json({ error: error.message });
    }
  }

  //   ** purpose : delete a post

  static async deletePost(request, response) {
    try {
      const { id } = request.params;
      const post = await Post.findById(id);
      if (!post) {
        return response.status(404).json({ error: "Post not found" });
      }
      const user = await User.findById(request.user._id);
      if (post.postedBy.toString() !== request.user._id.toString()) {
        return response
          .status(403)
          .json({ error: "You are not authorized to perform this action" });
      }

      //** delete the image associated with the post from cloudinary server if it is present in the post
      if(post.image){
        const publicId = post.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      const deletedPost = await Post.findByIdAndDelete(id);
      return response
        .status(200)
        .json({ message: "Post deleted successfully", deletedPost });
    } catch (error) {
      console.log("Error in postController.deletePost: ", error.message);
      return response.status(500).json({ error: error.message });
    }
  }

  //   ** purpose : like a post

  static async likeAndUnlikePost(request, response) {
    try {
      const { id: postId } = request.params;
      const userId = request.user._id;
      const post = await Post.findById(postId);
      if (!post) {
        return response.status(404).json({ error: "Post not found" });
      }

      if (!userId) {
        return response
          .status(401)
          .json({ error: "you need to login first to like a post" });
      }

      const isUserLikedThePost = post.likes.includes(userId);
      if (isUserLikedThePost) {
        // apply unlike
        await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
        return response
          .status(200)
          .json({ message: "Post unliked successfully" });
      } else {
        // apply like
        post.likes.push(userId);
        await post.save();
        return response
          .status(200)
          .json({ message: "Post liked successfully" });
      }
    } catch (error) {
      console.log("Error in postController.likeAndUnlikePost: ", error.message);
      return response.status(500).json({ error: error.message });
    }
  }

  //   ** purpose: replay to a post or add a comment to a post

  static async replyToPost(request, response) {
    try {
      const { text } = request.body;
      const { id: postId } = request.params;
      const userId = request.user._id;
      const profilePic = request.user.profilePic;
      console.log(profilePic);
      const username = request.user.username;

      // check if the comment is not empty or blank
      if (!text) {
        return response
          .status(400)
          .json({ error: "Comment should not be empty or blank" });
      }

      // check if the post exists or not
      const post = await Post.findById(postId);
      if (!post) {
        return response.status(404).json({ error: "Post not found" });
      }

      const replay = {
        userId,
        username,
        text,
        userProfilePic: profilePic,
      };

      console.log("replay: ", replay);

      post.replies.push(replay);
      await post.save();
      return response
        .status(200)
        .json({ message: "Replay added successfully", post });
    } catch (error) {
      console.log("Error in postController.replyToPost: ", error.message);
      return response.status(500).json({ error: error.message });
    }
  }

  //   ** purpose : get all posts for feed

  static async getAllPosts(request, response) {
    try {
      const userId = request.user._id;
      const user = await User.findById(userId);
      if (!user) {
        return response
          .status(404)
          .json({
            error:
              "login and follow some people to see their posts in your feed",
          });
      }
      const following = user.following;
      console.log("user follwing: ", following);
      const feedPost = await Post.find({ postedBy: { $in: following } }).sort({
        createdAt: -1,
      });
      return response.status(200).json(feedPost );
    } catch (error) {
      console.log("Error in postController.getAllPosts: ", error.message);
      return response.status(500).json({ error: error.message });
    }
  }

  //   ** purpose : get all posts for profile

  static async getProfilePosts(request, response) {
    try {
      const { username } = request.params;
      const user = await User.findOne({ username });
      if (!user) {
        return response.status(404).json({ error: "User not found" });
      }
      const profilePost = await Post.find({ postedBy: user._id }).sort({
        createdAt: -1,
      });
      return response.status(200).json({ profilePost });
    } catch (error) {
      console.log("Error in postController.getProfilePosts: ", error.message);
      return response.status(500).json({ error: error.message });
    }
  }


  // ** get all post for explore page if they have image in it
  static async getExplorePosts(request, response) {
    try {
      const posts = await Post.find({ image: { $exists: true, $ne: "" } }).sort({
        createdAt: -1,
      });
      // const posts = await Post.find();
      return response.status(200).json(posts);
    } catch (error) {
      console.log("Error in postController.getExplorePosts: ", error.message);
      return response.status(500).json({ error: error.message });
    }
  }


  
}

export default postController;
