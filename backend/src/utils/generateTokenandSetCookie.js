import jwt from "jsonwebtoken";

const generateTokenandSetCookie = (userId, response) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  response.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    sameSite: "strict",
  });
};

export default generateTokenandSetCookie;
