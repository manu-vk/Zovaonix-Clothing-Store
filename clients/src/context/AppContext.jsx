import { createContext, useEffect, useState } from "react";
import { customerFakeData, ourProducts } from "../assets/assets";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const AppContext = createContext();

const API_REGISTER = 'https://zovaonix-backend.onrender.com/api/user/register';
const API_USER = 'https://zovaonix-backend.onrender.com/api/user';
const API_CATEGORY = 'https://zovaonix-backend.onrender.com/api/category';
const API_PRODUCT = 'https://zovaonix-backend.onrender.com/api/product';
const API_ORDER = 'https://zovaonix-backend.onrender.com/api/order';

export const AppContextProvider = ({ children }) => {


  const navigate = useNavigate();
  const [user, setUser] = useState(null)
  const [admin, setAdmin] = useState(true)
  const [showUserLogin, setShowUserLogin] = useState(false)
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [wishItems, setWishItems] = useState([]);
  const [allUsers, setAllUsers] = useState([])
  const [categories, setCategories] = useState([])
  const [testuser, setTestUser] = useState([])
  const [orders, setOrders] = useState([])
  const [userOrders, setUserOrders] = useState([])

const filteredProducts = products.filter((product) => {
  const query = (
    typeof searchQuery === "string" ? searchQuery : ""
  ).trim().toLowerCase();
  if (!query) return true;

  return (
    String(product.title || "").toLowerCase().includes(query) ||
    String(product.brand || "").toLowerCase().includes(query) ||
    String(product.description || "").toLowerCase().includes(query)
  );
});

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("https://zovaonix-backend.onrender.com/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUser(res.data);
    } catch (error) {
      console.log("PROFILE ERROR:", error.response?.data || error.message);
    }
  };
  const fetchuser = async () => {
    try {
      const res = await axios.get(API_USER);
      setTestUser(res.data);
    } catch (error) {
      console.log("FETCH USER ERROR:", error.response?.data || error.message);
    }
  };

  const fetchProduct = async () => {
    const res = await axios.get(API_PRODUCT);
    setProducts(res.data)
    setSearchQuery(res.data)
  }

  const fetchcategory = async () => {
    const res = await axios.get(API_CATEGORY);
    setCategories(res.data);
  };

  useEffect(() => {

    setAllUsers(customerFakeData)
  }, []);

  // ==================================================================
  // const addToCart = async (productId) => {
  //   try {
  //     const token = localStorage.getItem("token");

  //     if (!token) {
  //       toast.error("Please login to add items to cart");
  //       navigate("/login");
  //       return;
  //     }

  //     if (!productId) {
  //       toast.error("Invalid product");
  //       return;
  //     }

  //     const res = await axios.post(
  //       "https://zovaonix-backend.onrender.com/api/cart",
  //       { productId, quantity: 1 },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       }
  //     );

  //     toast.success("Added to cart!");
  //     await fetchCart();

  //   } catch (err) {
  //     const errorMessage = err.response?.data?.message || "Failed to add to cart";
  //     toast.error(errorMessage);
  //     console.log(err.response?.data || err.message);
  //   }
  // };
  
const addToCart = async (productId, selectedImage = null, selectedSize = null) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    if (!productId) {
      toast.error("Invalid product");
      return;
    }

    const res = await axios.post(
      "https://zovaonix-backend.onrender.com/api/cart",
      {
        productId,
        quantity: 1,
        selectedImage,
        selectedSize,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Added to cart!");
    await fetchCart();
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || "Failed to add to cart";

    toast.error(errorMessage);
    console.log(err.response?.data || err.message);
  }
};

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token in fetchCart");
        setCartItems([]);
        return;
      }

      const res = await axios.get("https://zovaonix-backend.onrender.com/api/cart", {
        headers: { Authorization: `Bearer ${token}` }
      });

      // console.log("Cart fetched:", res.data);
      console.log("Cart fetched:", JSON.stringify(res.data.cart, null, 2));

      if (res.data && res.data.cart) {
        setCartItems(res.data.cart);
      } else {
        console.warn("No cart data in response");
        setCartItems([]);
      }
    } catch (err) {
      console.error("Error fetching cart:", err.response?.data || err.message);
      setCartItems([]);
    }
  };


  // const updateCartItem = async (productId, quantity) => {
    
  //   try {
  //     const token = localStorage.getItem("token");

  //     if (!token) {
  //       toast.error("Please login first");
  //       return;
  //     }

  //     if (quantity < 0) {
  //       toast.error("Quantity cannot be negative");
  //       return;
  //     }

  //     if (quantity === 0) {
  //       await removeCartItem(productId);
  //       return;
  //     }

  //     const res = await axios.put("https://zovaonix-backend.onrender.com/api/cart", {
  //       productId,
  //       quantity
  //     }, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });

  //     console.log("Cart updated:", res.data);
  //     await fetchCart();
  //     toast.success("Quantity updated");
  //   } catch (err) {
  //     const errorMessage = err.response?.data?.message || "Failed to update cart";
  //     toast.error(errorMessage);
  //     console.error("Update error:", err.response?.data || err.message);
  //   }
  // };
  
const updateCartItem = async (cartId, quantity) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      return;
    }

    if (quantity < 1) return;

    await axios.put(
      "https://zovaonix-backend.onrender.com/api/cart",
      { cartId, quantity },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    await fetchCart();
    toast.success("Quantity updated");
  } catch (err) {
    toast.error(
      err.response?.data?.message || "Failed to update cart"
    );
    console.error("Update error:", err.response?.data || err.message);
  }
};


  // const removeCartItem = async (productId) => {

  //   try {
  //     const token = localStorage.getItem("token");

  //     if (!token) {
  //       toast.error("Please login first");
  //       return;
  //     }

  //     const res = await axios.delete(`https://zovaonix-backend.onrender.com/api/cart/${productId}`, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });

  //     console.log("Item removed:", res.data);
  //     await fetchCart();
  //     toast.success("Item removed from cart");
  //   } catch (err) {
  //     const errorMessage = err.response?.data?.message || "Failed to remove item";
  //     toast.error(errorMessage);
  //     console.error("Delete error:", err.response?.data || err.message);
  //   }
  // };
 
const removeCartItem = async (cartId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      return;
    }

    await axios.delete(
      `https://zovaonix-backend.onrender.com/api/cart/${cartId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    await fetchCart();
    toast.success("Item removed from cart");
  } catch (err) {
    toast.error(
      err.response?.data?.message || "Failed to remove item"
    );
    console.log("Delete URL ID:", cartId);
    console.error("Delete error:", err.response?.data || err.message);
  }
};

  const getCartCount = () => {
    if (!cartItems || !Array.isArray(cartItems)) {
      return 0;
    }
    return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  };
  const getWishlistCount = () => {
    return wishItems.length;
  };

  const getCartAmount = () => {
    const total = cartItems.reduce((total, item) => {
      const price = item.product.salePrice || item.product.price;
      return total + price * item.quantity;
    }, 0);

    return Math.floor(total * 100) / 100;
  };

  // ============================================================================
  const fetchWishlist = async () => {

    try {

      const token = localStorage.getItem("token");

      if (!token) return;

      const res = await axios.get(
        "https://zovaonix-backend.onrender.com/api/wishlist",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
        console.log("WISHLIST RESPONSE:", res.data);
      setWishItems(res.data.wishlist);

    } catch (error) {

      console.log(error.response?.data);
      console.log("WISHLIST ERROR:", error.response?.data);

    }
  };
  const addToWish = async (productId) => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.post(
        "https://zovaonix-backend.onrender.com/api/wishlist",
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success(res.data.message);

       await  fetchWishlist();

    } catch (error) {

      console.log(error.response?.data);
        console.log("WISHLIST ERROR:", error.response?.data);

    }
  };


  const notificationsAll = () => {

  }
  // ==================================================================================

  const addProduct = async (productData) => {
    try {
      const res = await axios.post(API_PRODUCT, productData);
      await fetchProduct();
      toast.success("Product Added Successfully");
    } catch (error) {
      toast.error("Failed to add product");
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      await axios.put(`${API_PRODUCT}/${id}`, productData);
      await fetchProduct();
      toast.success("Product Updated");
    } catch (error) {
      toast.error("Update Failed");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API_PRODUCT}/${id}`);
      fetchProduct();
      toast.success("Product deleted Successfully")
    } catch (error) {
      console.log(error);
    }
  }
  // =================================================================================
  const addCategory = async (categoryData) => {
    console.log(categoryData);

    try {
      const res = await axios.post(API_CATEGORY, categoryData);
      fetchcategory();
      toast.success("Category Added");
    } catch (error) {
      toast.error("Failed to add category");
    }
  };
  const deleteCategory = async (id) => {
    try {
      await axios.delete(`${API_CATEGORY}/${id}`);
      fetchcategory();
      toast.success("Category deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const adduser = async (userData) => {
    try {
      const res = await axios.post(API_REGISTER, userData);
      await fetchuser();
      toast.success("registration completed");
      navigate("/login");
    } catch (error) {
      console.log(error.response?.data || error.message);
      toast.error("registration not completed");
    }
  }
  const forgotPass = () => {
    toast.error("Working on progress!");
  };
  // =========================================================================
  // Order functions
 
const createOrder = async (orderData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to place an order");
      navigate("/login");
      return null;
    }

    const res = await axios.post(API_ORDER, orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Order API response:", res.data);

    await fetchUserOrders();
    await fetchAllOrders();

    return res.data;
  
} catch (error) {
  console.error("Create order failed:", error);
  console.error("Backend response:", error.response?.data);
  console.error("HTTP status:", error.response?.status);

  toast.error(
    error.response?.data?.message ||
    "Failed to place order"
  );

  return null;
}

};

  // const createOrder = async (orderData) => {
  //   try {
  //     const token = localStorage.getItem("token");

  //     if (!token) {
  //       toast.error("Please login to place an order");
  //       navigate("/login");
  //       return;
  //     }

  //     const res = await axios.post(API_ORDER, orderData, {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     });
      

      // if (response?.paymentMethod == "UPI") {
      //     console.log("Razorpay Order =========  ", response?.razorpayOrder);

      //     handlePayment(response?.razorpayOrder);
      //   }
    
        

  //     toast.success("Order placed successfully");

  //     await fetchUserOrders();
  //     await fetchAllOrders();

  //     return res.data;

  //   } catch (error) {
  //     toast.error(error.response?.data?.message || "Failed to place order");
  //   }
  // };

  // const fetchAllOrders = async () => {
  //   try {
  //     const token = localStorage.getItem("token");

  //     const res = await axios.get(API_ORDER, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     console.log("All orders:", res.data);
  //     setOrders(res.data);
  //   } catch (error) {
  //     console.log("Error fetching orders:", error.response?.data || error.message);
  //   }
  // };
  const fetchAllOrders = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      setOrders([]);
      return;
    }

    const res = await axios.get(API_ORDER, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setOrders(res.data);
  } catch (error) {
    console.log(
      "Error fetching orders:",
      error.response?.data || error.message
    );
  }
};

  const fetchUserOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${API_ORDER}/user/orders`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUserOrders(res.data);
    } catch (error) {
      console.log("Error fetching user orders:", error.response?.data || error.message);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${API_ORDER}/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.success("Order status updated");
      await fetchAllOrders();
      return res.data;
    } catch (error) {
      toast.error("Failed to update order status");
      console.log(error.response?.data || error.message);
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${API_ORDER}/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.success("Order deleted");
      await fetchAllOrders();
    } catch (error) {
      toast.error("Failed to delete order");
      console.log(error.response?.data || error.message);
    }
  };

  const cancelOrder = async (orderId) => {
  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `${API_ORDER}/${orderId}/cancel`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    toast.success("Order cancelled");
    await fetchUserOrders();
    await fetchAllOrders();

  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to cancel order"
    );
  }
};

const returnOrder = async (orderId) => {
  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `${API_ORDER}/${orderId}/return`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    toast.success("Return request submitted");
    await fetchUserOrders();
    await fetchAllOrders();

  } catch (error) {
    console.log(error.response?.data || error.message);

    toast.error(
      error.response?.data?.message ||
      "Failed to submit return request"
    );
  }
};
  

  useEffect(() => {
    fetchProduct();
    fetchcategory();
    fetchuser();
    fetchCart();
    fetchProfile();
    fetchAllOrders();
    fetchUserOrders();
    fetchWishlist();
  }, [])

  return (
    <AppContext.Provider
      value={{
        products, navigate, user, setUser, fetchProfile, admin, setAdmin, showUserLogin, setShowUserLogin, searchQuery, setSearchQuery,
        cartItems, addToCart, updateCartItem, removeCartItem, getCartCount, getWishlistCount, getCartAmount, forgotPass, addToWish, wishItems, setWishItems, fetchWishlist,
        allUsers, addProduct, updateProduct, deleteProduct, addCategory, deleteCategory, categories, API_PRODUCT, adduser, testuser,
        orders, userOrders, createOrder, updateOrderStatus, deleteOrder, fetchAllOrders, fetchUserOrders, cancelOrder, returnOrder
      }}>
      {children}
    </AppContext.Provider>
  );
};
