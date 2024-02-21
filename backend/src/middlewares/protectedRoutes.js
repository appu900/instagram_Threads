import  jwt from "jsonwebtoken";
import User from "../models/User_Model.js";
const protectedRoutes = async function (request, response, next) {
  try {
    const token = request.cookies.jwt;
    if (!token) return response.status(401).json({ message: "Unauthorized" });
    const decodedToken =  jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.userId).select("-password");
    request.user = user;
    next();
  } catch (error) {
    console.log("Error in protectedRoutes middleware: ", error.message);
    return response.status(500).json({ message: error.message });
  }
};

export default protectedRoutes;
