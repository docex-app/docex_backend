import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      select: false, // 🔐 IMPORTANT
    },

    avatar: {
      type: String,
      default: "",
    },

    accountType: {
      type: String,
      enum: ["personal", "business"],
      default: "personal",
    },

    organizationName: {
      type: String,
      default: "",
    },

    businessType: {
      type: String,
      default: "",
    },
    resetPasswordToken: {
  type: String,
},

resetPasswordExpire: {
  type: Date,
},
  },
  { timestamps: true, versionKey: false }
);

const User = mongoose.model("User", userSchema);
export default User;


// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//   },
//   { timestamps: true, versionKey:false }
// );

// const User = mongoose.model("User", userSchema);
// export default User;
