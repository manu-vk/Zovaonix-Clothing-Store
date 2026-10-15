// const Cart = require("../model/cartModel");
// const Product = require("../model/productModel");

// // GET CART
// const getCart = async (req, res) => {
//   try {
//     const cartItems = await Cart.find({ user: req.user.id })
//       .populate("productId");

//     const formattedCart = cartItems.map((item) => ({
//       id: item.productId._id,
//       cartId: item._id,
//       title: item.productId.title,
//       price: item.productId.price,
//       offerPrice: item.productId.offerPrice,
//       image: item.productId.image,
//       quantity: item.quantity,
//     }));

//     res.status(200).json({
//       cart: formattedCart,
//     });

//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// const addToCart = async (req, res) => {
//   try {
//     const { productId, quantity } = req.body;

//     // ✅ safety checks
//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ message: "User not found" });
//     }

//     if (!productId) {
//       return res.status(400).json({ message: "ProductId missing" });
//     }

//     const product = await Product.findById(productId);

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     // Check if item already exists
//     const existingItem = await Cart.findOne({
//       productId: productId,
//       user: req.user.id
//     });

//     let cartItem;

//     if (existingItem) {
//       // Update existing item - increment quantity
//       existingItem.quantity = (existingItem.quantity || 1) + (quantity || 1);
//       cartItem = await existingItem.save();

//       return res.status(200).json({
//         message: "Cart updated",
//         cart: cartItem
//       });
//     } else {
//       // Create new cart item
//       cartItem = await Cart.create({
//         productId: productId,
//         user: req.user.id,
//         quantity: quantity || 1
//       });

//       return res.status(201).json({
//         message: "Added to cart",
//         cart: cartItem
//       });
//     }

//   } catch (error) {
//     console.error("Add to cart error:", error.message);

//     // Handle duplicate key error
//     if (error.code === 11000) {
//       console.error("E11000 duplicate key - attempting recovery");

//       // Try to find and update as fallback
//       try {
//         const { productId, quantity } = req.body;
//         const existing = await Cart.findOne({
//           productId: productId,
//           user: req.user.id
//         });

//         if (existing) {
//           existing.quantity = (existing.quantity || 1) + (quantity || 1);
//           const updated = await existing.save();
//           return res.status(200).json({
//             message: "Cart updated (after recovery)",
//             cart: updated
//           });
//         }
//       } catch (recoveryError) {
//         console.error("Recovery failed:", recoveryError.message);
//       }

//       return res.status(400).json({ 
//         message: "Duplicate key error. Try clearing your browser cache and refresh the page." 
//       });
//     }

//     res.status(500).json({ message: error.message });
//   }
// };

// // UPDATE CART ITEM
// const updateCartItem = async (req, res) => {
//   try {
//     const { productId, quantity } = req.body;

//     const cartItem = await Cart.findOne({
//       productId,
//       user: req.user.id,
//     });

//     if (!cartItem) {
//       return res.status(404).json({
//         message: "Cart item not found",
//       });
//     }

//     if (quantity <= 0) {
//       await Cart.deleteOne({
//         _id: cartItem._id,
//       });

//       return res.status(200).json({
//         message: "Item removed from cart",
//       });
//     }

//     cartItem.quantity = quantity;

//     await cartItem.save();

//     res.status(200).json({
//       message: "Cart updated",
//       cart: cartItem,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// // REMOVE FROM CART
// const removeFromCart = async (req, res) => {
//   try {
//     const { productId } = req.params;

//     const cartItem = await Cart.findOneAndDelete({
//       productId,
//       user: req.user.id,
//     });

//     if (!cartItem) {
//       return res.status(404).json({
//         message: "Item not found",
//       });
//     }

//     res.status(200).json({
//       message: "Item removed from cart",
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// module.exports = {
//   getCart,
//   addToCart,
//   updateCartItem,
//   removeFromCart,
// };
const Cart = require("../model/cartModel");
const Product = require("../model/productModel");

// =======================
// GET CART
// =======================
// const getCart = async (req, res) => {
//   try {
//     const userId = req.user.id.toString();

//     const cartItems = await Cart.find({ user: userId })
//       .populate("productId");

//     const formattedCart = cartItems
//       .filter((item) => item.productId) // product deleted aanenkil skip cheyyum
//       .map((item) => ({
//         id: item.productId._id,
//         cartId: item._id,
//         title: item.productId.title,
//         price: item.productId.price,
//         offerPrice: item.productId.offerPrice,
//         image: item.productId.image,
//         quantity: item.quantity,
//       }));

//     res.status(200).json({
//       cart: formattedCart,
//     });
//   } catch (error) {
//     console.error("Get cart error:", error);

//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

const getCart = async (req, res) => {
  try {
    const userId = req.user.id.toString();

    const cartItems = await Cart.find({
      user: userId,
    }).populate("productId");

    const formattedCart = cartItems
      .filter((item) => item.productId)
      .map((item) => {
        const productImages = item.productId.image || [];

        const images = item.selectedImage
          ? [
            item.selectedImage,
            ...productImages.filter(
              (img) => img !== item.selectedImage
            ),
          ]
          : productImages;

        return {
          id: item.productId._id,
          cartId: item._id,
          title: item.productId.title,
          price: item.productId.price,
          offerPrice: item.productId.offerPrice,
          image: images,
          selectedImage: item.selectedImage || null,
          quantity: item.quantity,
        };
      });

    return res.status(200).json({
      cart: formattedCart,
    });
  } catch (error) {
    console.error("Get cart error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};


// =======================
// ADD TO CART
// =======================
// const addToCart = async (req, res) => {
//   try {
//     const { productId, quantity } = req.body;

//     // Check user
//     if (!req.user || !req.user.id) {
//       return res.status(401).json({
//         message: "User not found",
//       });
//     }

//     // Check productId
//     if (!productId) {
//       return res.status(400).json({
//         message: "ProductId missing",
//       });
//     }

//     const userId = req.user.id.toString();
//     const productIdString = productId.toString();

//     // Check product exists
//     const product = await Product.findById(productIdString);

//     if (!product) {
//       return res.status(404).json({
//         message: "Product not found",
//       });
//     }

//     // Check existing cart item
//     const existingItem = await Cart.findOne({
//       productId: productIdString,
//       user: userId,
//     });

//     if (existingItem) {
//       existingItem.quantity =
//         (existingItem.quantity || 1) + (quantity || 1);

//       const updatedItem = await existingItem.save();

//       return res.status(200).json({
//         message: "Cart updated",
//         cart: updatedItem,
//       });
//     }

//     // Create new cart item
//     const cartItem = await Cart.create({
//       productId: productIdString,
//       user: userId,
//       quantity: quantity || 1,
//     });

//     return res.status(201).json({
//       message: "Added to cart",
//       cart: cartItem,
//     });

//   } catch (error) {
//     console.error("Add to cart error:", error);

//     // Handle duplicate key
//     if (error.code === 11000) {
//       try {
//         const { productId, quantity } = req.body;

//         const existingItem = await Cart.findOne({
//           productId,
//           user: req.user.id,
//         });

//         if (existingItem) {
//           existingItem.quantity =
//             (existingItem.quantity || 1) + (quantity || 1);

//           const updatedItem = await existingItem.save();

//           return res.status(200).json({
//             message: "Cart updated",
//             cart: updatedItem,
//           });
//         }
//       } catch (recoveryError) {
//         console.error("Recovery failed:", recoveryError);
//       }

//       return res.status(400).json({
//         message: "Duplicate cart item",
//       });
//     }

//     return res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// const addToCart = async (req, res) => {
//   try {
//     const { productId, quantity, selectedImage } = req.body;

//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ message: "User not found" });
//     }

//     if (!productId) {
//       return res.status(400).json({ message: "ProductId missing" });
//     }

//     const userId = req.user.id.toString();
//     const productIdString = productId.toString();

//     const product = await Product.findById(productIdString);

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     const existingItem = await Cart.findOne({
//       productId: productIdString,
//       user: userId,
//     });

//     if (existingItem) {
//       existingItem.quantity =
//         (existingItem.quantity || 1) + (Number(quantity) || 1);

//       if (selectedImage) {
//         existingItem.selectedImage = selectedImage;
//       }

//       const updatedItem = await existingItem.save();

//       return res.status(200).json({
//         message: "Cart updated",
//         cart: updatedItem,
//       });
//     }

//     const cartItem = await Cart.create({
//       productId: productIdString,
//       user: userId,
//       quantity: Number(quantity) || 1,
//       selectedImage: selectedImage || null,
//     });

//     return res.status(201).json({
//       message: "Added to cart",
//       cart: cartItem,
//     });
//   } catch (error) {
//     console.error("Add to cart error:", error);

//     if (error.code === 11000) {
//       return res.status(409).json({
//         message: "Cart item already exists. Please try again.",
//       });
//     }

//     return res.status(500).json({
//       message: "Failed to add item to cart",
//     });
//   }
// };
const addToCart = async (req, res) => {
  try {
    const { productId, quantity, selectedImage } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!productId) {
      return res.status(400).json({ message: "ProductId missing" });
    }

    const userId = req.user.id.toString();

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Product-ഉം user-ഉം match ചെയ്യുന്ന cart item കണ്ടെത്തുന്നു
    const image = selectedImage || null;

    const existingItem = await Cart.findOne({
      productId,
      user: userId,
      selectedImage: image,
    });

    if (existingItem) {
      existingItem.quantity += Number(quantity) || 1;
      await existingItem.save();

      return res.status(200).json({
        message: "Cart updated",
        cart: existingItem,
      });
    }

    const cartItem = await Cart.create({
      productId,
      user: userId,
      quantity: Number(quantity) || 1,
      selectedImage: image,
    });

    return res.status(201).json({
      message: "Added to cart",
      cart: cartItem,
    });
  } catch (error) {
    console.error("Add to cart error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};



// =======================
// UPDATE CART ITEM
// =======================
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const userId = req.user.id.toString();
    const productIdString = productId.toString();

    const cartItem = await Cart.findOne({
      productId: productIdString,
      user: userId,
    });

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    // Remove if quantity becomes 0
    if (quantity <= 0) {
      await Cart.deleteOne({
        _id: cartItem._id,
      });

      return res.status(200).json({
        message: "Item removed from cart",
      });
    }

    cartItem.quantity = quantity;

    await cartItem.save();

    return res.status(200).json({
      message: "Cart updated",
      cart: cartItem,
    });

  } catch (error) {
    console.error("Update cart error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};


// =======================
// REMOVE FROM CART
// =======================
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id.toString();
    const productId = req.params.productId.toString();

    const cartItem = await Cart.findOneAndDelete({
      productId,
      user: userId,
    });

    if (!cartItem) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    return res.status(200).json({
      message: "Item removed from cart",
    });

  } catch (error) {
    console.error("Remove cart error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
};