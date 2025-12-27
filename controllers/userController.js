import bcrypt from "bcryptjs";
import User from "../model/User.js";
import fs from "fs";
import path from "path";
/* ======================================================
   GET LOGGED-IN USER
====================================================== */
const getMe = async (req, res) => {
  try {
    // authMiddleware already attaches full user (without password)
    res.json({
      success: true,
      user: req.user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   UPDATE PROFILE (NON-SENSITIVE FIELDS)
====================================================== */
const updateProfile = async (req, res) => {
  try {
    const {
      name,
      accountType,
      organizationName,
      businessType,
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        accountType,
        organizationName,
        businessType,
      },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   CHANGE PASSWORD
====================================================== */
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Old password and new password are required",
      });
    }

    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Old password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   UPDATE AVATAR (CLOUDINARY + MULTER)
====================================================== */
const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(req.user._id);

    const avatarUrl = `${req.protocol}://${req.get("host")}/uploads/avatars/${req.file.filename}`;

    user.avatar = avatarUrl;
    await user.save();

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// REMOVE AVATAR

const removeAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.avatar) {
      // avatar is a full URL → extract filename
      const filename = user.avatar.split("/uploads/avatars/")[1];

      if (filename) {
        const filePath = path.join(
          process.cwd(),
          "uploads",
          "avatars",
          filename
        );

        // delete file if exists
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    user.avatar = ""; // 👈 fallback to initials
    await user.save();

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export {
  getMe,
  updateProfile,
  changePassword,
  updateAvatar,
  removeAvatar
};

