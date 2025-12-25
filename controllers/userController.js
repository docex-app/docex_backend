import bcrypt from "bcryptjs";
import User from "../model/User.js";

/* ======================================================
   GET LOGGED-IN USER
====================================================== */
const getMe = async (req, res) => {
  try {
    // req.user is already populated by authMiddleware
    res.json({
      success: true,
      user: req.user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   UPDATE PROFILE
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
      req.user._id, // ✅ FIX
      {
        name,
        accountType,
        organizationName,
        businessType,
      },
      { new: true }
    ).select("-password");

    res.json({ success: true, user: updatedUser });
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

    const user = await User.findById(req.user._id).select("+password"); // ✅ FIX

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
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
   UPDATE AVATAR
====================================================== */
const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, // ✅ FIX
      { avatar },
      { new: true }
    ).select("-password");

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export {
  getMe,
  updateProfile,
  changePassword,
  updateAvatar,
};


// import bcrypt from "bcryptjs";
// import User from "../model/User.js";

// /* ======================================================
//    GET LOGGED-IN USER
// ====================================================== */
// const getMe = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json({ success: true, user });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /* ======================================================
//    UPDATE PROFILE
// ====================================================== */
// const updateProfile = async (req, res) => {
//   try {
//     const {
//       name,
//       accountType,
//       organizationName,
//       businessType,
//     } = req.body;

//     const updatedUser = await User.findByIdAndUpdate(
//       req.user.id,
//       {
//         name,
//         accountType,
//         organizationName,
//         businessType,
//       },
//       { new: true }
//     ).select("-password");

//     res.json({ success: true, user: updatedUser });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /* ======================================================
//    CHANGE PASSWORD
// ====================================================== */
// const changePassword = async (req, res) => {
//   try {
//     const { oldPassword, newPassword } = req.body;

//     const user = await User.findById(req.user.id).select("+password");

//     const isMatch = await bcrypt.compare(oldPassword, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Old password is incorrect" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(newPassword, salt);

//     await user.save();

//     res.json({
//       success: true,
//       message: "Password updated successfully",
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /* ======================================================
//    UPDATE AVATAR (URL BASED)
// ====================================================== */
// const updateAvatar = async (req, res) => {
//   try {
//     const { avatar } = req.body;

//     const user = await User.findByIdAndUpdate(
//       req.user.id,
//       { avatar },
//       { new: true }
//     ).select("-password");

//     res.json({ success: true, user });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// export {
//   getMe,
//   updateProfile,
//   changePassword,
//   updateAvatar,
// };
