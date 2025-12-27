import jwt from "jsonwebtoken";
import User from "../model/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    // [1] Try to get token from header (normal APIs)
    let token = null;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // [2️] Fallback: allow token from query (for downloads)
    if (!token && req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // [3️] Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // [4] Load user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("AUTH ERROR:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;

