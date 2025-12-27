import express from "express";
import {
  getMe,
  updateProfile,
  changePassword,
  updateAvatar,
} from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import avatarUpload from "../middlewares/avatarUpload.js";
import { removeAvatar } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", authMiddleware, getMe);
router.put("/profile", authMiddleware, updateProfile);
router.put("/password", authMiddleware, changePassword);

router.put(
  "/avatar",
  authMiddleware,
  avatarUpload.single("avatar"),
  updateAvatar
);

router.delete(
  "/avatar",
  authMiddleware,
  removeAvatar
);



export default router;


// import express from "express";
// import {
//   getMe,
//   updateProfile,
//   changePassword,
//   updateAvatar,
// } from "../controllers/userController.js";
// import authMiddleware from "../middlewares/authMiddleware.js";

// const router = express.Router();

// router.get("/me", authMiddleware, getMe);
// router.put("/profile", authMiddleware, updateProfile);
// router.put("/password", authMiddleware, changePassword);
// router.put("/avatar", authMiddleware, updateAvatar);

// export default router;

