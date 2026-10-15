const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: [true, "Name is required"],
//         trim: true,
//         minlength: [3, "Name must be at least 3 characters long"],
//         maxlength: [50, "Name cannot exceed 50 characters"],
//     },
//     email: {
//         type: String,
//         required: [true, "Email is required"],
//         unique: true,
//         trim: true,
//         lowercase: true,
//         match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
//     },
//     password: {
//         type: String,
//         required: [true, "Password is required"],
//         minlength: [6, "Password must be at least 6 characters long"],
//     },
//     phone: {
//         type: String,
//         // required: [true, "Phone number is required"],
//         match: [/^\d{10}$/, "Phone number must be exactly 10 digits"],
//     },
//     isAdmin: {
//         type: Boolean,
//         default: false
//     },
//     role: {
//         type: String,
//         enum: ["user", "admin"],
//         default: "user"
//     }
// }, { timestamps: true });
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },

    password: {
      type: String,
      required: function () {
        return this.authProvider !== "google";
      },
      minlength: [6, "Password must be at least 6 characters long"],
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    googleId: {
      type: String,
      sparse: true,
    },

    phone: {
      type: String,
      match: [/^\d{10}$/, "Phone number must be exactly 10 digits"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // NEW FIELDS
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserModel", UserSchema);