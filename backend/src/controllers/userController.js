import mongoose from "mongoose";
import User from "../models/User_Model.js";
import bcrypt from "bcryptjs";
import generateTokenandSetCookie from "../utils/generateTokenandSetCookie.js";
import { v2 as cloudinary } from "cloudinary";

class UserController {
  // ** purpose: create a new user

  static async createUser(request, response) {
    try {
      const { name, username, email, password } = request.body;
      console.log("request.body", request.body);
      if (!name || !username || !email || !password) {
        return response
          .status(400)
          .json({ message: "All fields are required" });
      }
      const user = await User.findOne({ $or: [{ email }, { username }] });
      // const user = await User.findOne({ email });

      if (user) {
        return response.status(400).json({ error: "User already exists" });
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const newUser = new User({
        name,
        username,
        email,
        password: hashedPassword,
      });

      console.log("newUser", newUser);

      await newUser.save();

      if (newUser) {
        generateTokenandSetCookie(newUser._id, response);
        return response.status(201).json({
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          bio: newUser.bio,
          profilePic: newUser.profilePic,
          username: newUser.username,
          followers: newUser.followers,
          following: newUser.following,
          message: "User created successfully",
        });
      } else {
        return response.status(400).json({ error: "Invalid userdata" });
      }
    } catch (error) {
      console.log("Error in creating user: ", error.message);
      return response.status(500).json({ error: error.message });
    }
  }

  // **  porpose:login user

  static async loginUser(request, response) {
    try {
      const { username, password } = request.body;
      const user = await User.findOne({ username });
      if (!user) {
        return response
          .status(400)
          .json({ error: "Invalid username or password" });
      }
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return response
          .status(400)
          .json({ error: "Invalid username or password" });
      }
      generateTokenandSetCookie(user._id, response);
      response.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        profilePic: user.profilePic,
        username: user.username,
        followers: user.followers,
        following: user.following,
        message: "User logged in successfully",
      });
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }

  //   ** purpose: logout user

  static async logoutUser(request, response) {
    try {
      response.cookie("jwt", "", { maxAge: 1 });
      return response
        .status(200)
        .json({ message: "User logged out successfully" });
    } catch (error) {
      console.log(error.message);
      return response.status(500).json({ error: error.message });
    }
  }

  //   ** purpose: follow a user

  static async followUser(request, response) {
    try {
      const { id } = request.params;
      const userToFollow = await User.findById(id);
      const currentUser = await User.findById(request.user._id);

      if (id === request.user._id.toString()) {
        return response
          .status(400)
          .json({ error: "You cannot follow yourself" });
      }

      if (!userToFollow || !currentUser) {
        return response.status(400).json({ error: "User not found" });
      }

      const isAlreadyFollowing = currentUser.following.includes(id);
      if (isAlreadyFollowing) {
        //  unfollow the user if already following
        // modify currentUser's following array

        await User.findByIdAndUpdate(request.user._id, {
          $pull: { following: id },
        });

        // modify userToFollow's followers array
        await User.findByIdAndUpdate(id, {
          $pull: { followers: request.user._id },
        });

        // send response
        return response.status(200).json({ message: "User unfollowed" });
      } else {
        // follow the user if not already following
        // modify currentUser's following array

        await User.findByIdAndUpdate(request.user._id, {
          $push: { following: id },
        });

        // modify the userToFollow's followers array

        await User.findByIdAndUpdate(id, {
          $push: { followers: request.user._id },
        });

        // send response
        return response.status(200).json({ message: "User followed" });
      }
    } catch (error) {
      console.log("Error in Follow and Unfollowing the user", error.message);
      return response.status(500).json({ error: error.message });
    }
  }

  // ** purpose update user profile

  static async updateUser(request, response) {
    try {
      const { name, username, email, password, bio } = request.body;
      let { profilePic } = request.body;
      const userId = request.user._id;
      let user = await User.findById(userId);
      if (!user) {
        return response.status(400).json({ message: "User not found" });
      }
      if (request.params.id != userId.toString()) {
        return response.status(401).json({ error: "Unauthorized" });
      }
      if (password) {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        user.password = hashedPassword;
      }

      // if the profile picture is provided from the frontend then upload it to cloudinary and update the profilePic field in the user document
      if (profilePic) {
        // if the user already has a profile picture then delete it from cloudinary
        if (user.profilePic) {
          await cloudinary.uploader.destroy(
            user.profilePic.split("/").pop().split(".")[0]
          );
        }
        const uploadedResponse = await cloudinary.uploader.upload(profilePic);
        profilePic = uploadedResponse.secure_url;
      }
      user.name = name || user.name;
      user.username = username || user.username;
      user.email = email || user.email;
      user.profilePic = profilePic || user.profilePic;
      user.bio = bio || user.bio;

      const updatedUser = await user.save();
      return response.status(200).json({
        updatedUser,
        message: "User updated successfully",
      });
    } catch (error) {
      console.log("Error in updating user", error.message);
      return response.status(500).json({ error: error.message });
    }
  }

  // ** purpose: get user profile

  static async getUserProfile(request, response) {
    try {
      const username = request.params.username;
      const user = await User.findOne({ username }).select("-password");
      if (!user) {
        return response.status(400).json({ error: "User not found" });
      }
      return response.status(200).json({ user });
    } catch (error) {
      console.log("Error in getting user profile", error.message);
      return response.status(500).json({ error: error.message });
    }
  }

  // get a user data by its id
  // end point is  /api/users/profile/id/data.....
  static async getUserProfileById(request, response) {
    try {
      const { id } = request.params;
      const user = await User.findById(id).select("-password");
      if(!user){
        return response.status(404).json({error:"user not found"});
      }

      return response.status(200).json(user);
    } catch (error) {
      console.log("Error in getuserprofile id,", error.message);
      return response.status(500).json({ error: error.message });
    }
  }

  // get all users by default if search params in not given else send the data of users whose username matches the search query
  static async getAllUsers(request, response) {
    try {
      const search = request.query.search;
      let users;
      if (search) {
        users = await User.find({ name: { $regex: search, $options: "i" } }).select("-password");
      } else {
        users = await User.find().select("-password");
      }
      return response.status(200).json(users);
    } catch (error) {
      console.log("Error in getting all users", error.message);
      return response.status(500).json({ error: error.message });
    }
  }
}

export default UserController;
