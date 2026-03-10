import jwt from "jsonwebtoken";
import User from "../model/User.js";



const generateRefreshToken = async (user) => {
  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, process.env.SECRET_KEY_REFRESH_TOKEN, {
    expiresIn: "7d",
  });

  // Save refresh token in DB
  await User.updateOne(
    { _id: user._id },
    { refresh_token: token }
  );

  return token;
};

export default generateRefreshToken;