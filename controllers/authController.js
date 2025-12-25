import User from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../services/email/mailer.js";

/* ======================
   SIGNUP
====================== */
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Signup successful",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================
   LOGIN
====================== */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================
   SIMPLE FORGOT PASSWORD
====================== */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User with this email does not exist",
      });
    }

    // 🔑 Generate temporary password (simple)
    const tempPassword = Math.random().toString(36).slice(-8);

    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    user.password = hashedPassword;
    await user.save();

    // 📧 Send temp password
    await transporter.sendMail({
      to: user.email,
      subject: "Docex – Temporary Password",
      html: `
        <p>Your temporary password is:</p>
        <h2>${tempPassword}</h2>
        <p>Please login and change your password immediately.</p>
      `,
    });

    res.json({
      success: true,
      message: "Temporary password sent to your email",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// import User from "../model/User.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// /* ======================
//    SIGNUP
// ====================== */
// export const signup = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({ message: "All fields required" });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await User.create({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Signup successful",
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /* ======================
//    LOGIN
// ====================== */
// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: "All fields required" });
//     }

//     // 🔑 FIX #1: explicitly select password
//     const user = await User.findOne({ email }).select("+password");
//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // 🔑 FIX #2: use consistent JWT payload
//     const token = jwt.sign(
//       { id: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({
//       success: true,
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

