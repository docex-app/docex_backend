import User from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../services/email/mailer.js";
import { signupTemplate } from "../services/email/emailTemplates/signup.template.js";

/* ======================
   SIGNUP
====================== */
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 📧 SEND SIGNUP EMAIL (NON-BLOCKING)
    transporter
      .sendMail({
        from: `"Docex" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Welcome to Docex 🎉",
        html: signupTemplate(name),
      })
      .catch((err) => {
        console.error("Signup email failed:", err.message);
      });

    res.status(201).json({
      success: true,
      message: "Signup successful",
    });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({
      success: false,
      message: "Signup failed",
    });
  }
};

/* ======================
   LOGIN
====================== */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    //  remove password before sending user
    user.password = undefined;

    res.json({
      success: true,
      token,
      user,
    });

  } catch (err) {
    console.error(" Login error:", err);
    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

/* ======================
   FORGOT PASSWORD
====================== */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with this email does not exist",
      });
    }

    // 🔐 Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    user.password = hashedPassword;
    await user.save();

    await transporter.sendMail({
      from: `"Docex" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: "Docex – Temporary Password",
      html: `
        <p>Hello ${user.name},</p>
        <p>Your temporary password is:</p>
        <h2>${tempPassword}</h2>
        <p>Please login and change your password immediately.</p>
        <br/>
        <p>— Team Docex</p>
      `,
    });

    res.json({
      success: true,
      message: "Temporary password sent to your email",
    });

  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to send temporary password",
    });
  }
};

