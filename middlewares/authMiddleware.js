import jwt from "jsonwebtoken";
import User from "../model/User.js";

// const authMiddleware = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "No token provided" });
//     }

//     const token = authHeader.split(" ")[1];

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // 🔑 THIS MUST MATCH LOGIN PAYLOAD
//     const user = await User.findById(decoded.id).select("-password");

//     if (!user) {
//       return res.status(401).json({ message: "User not found" });
//     }

//     req.user = user;
//     next();
//   } catch (err) {
//     console.error("AUTH ERROR:", err.message);
//     return res.status(401).json({ message: "Invalid or expired token" });
//   }
// };


const authMiddleware = async (req, res, next) => {
  try {
 //   console.log("AUTH HEADER:", req.headers.authorization);

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
   // console.log("TOKEN RECEIVED:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   // console.log("DECODED TOKEN:", decoded);

    const user = await User.findById(decoded.id).select("-password");
   // console.log("USER FOUND:", user?._id);

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


// import jwt from "jsonwebtoken";
// import User from "../model/User.js";

// const authMiddleware = async (req, res, next) => {
//   try {
//     const header = req.headers.authorization;

//     if (!header || !header.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "No token provided" });
//     }

//     const token = header.split(" ")[1];

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.userId).select("-password");
//     if (!user) {
//       return res.status(401).json({ message: "User not found" });
//     }

//     req.user = user; // 🔥 THIS IS THE MAGIC
//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };

// export default authMiddleware;
