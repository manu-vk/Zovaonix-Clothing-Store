
// const mongoose = require("mongoose");

// const cartSchema = new mongoose.Schema({
//   productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
//   quantity: { type: Number, required: true, default: 1, min: 1 },
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   }
// }, { timestamps: true });

// // Create compound unique index to prevent duplicate items per user
// cartSchema.index({ user: 1, productId: 1 }, { unique: true, sparse: true });

// module.exports = mongoose.model("Cart", cartSchema);
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    selectedImage: {
      type: String,
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// ONE product per user only
// cartSchema.index({ user: 1, productId: 1 }, { unique: true });
cartSchema.index(
  { user: 1, productId: 1, selectedImage: 1 },
  { unique: true }
);

module.exports = mongoose.model("Cart", cartSchema);