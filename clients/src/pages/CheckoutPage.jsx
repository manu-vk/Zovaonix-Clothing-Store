import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios';
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import toast from 'react-hot-toast'

const CheckoutPage = () => {
  const { cartItems, getCartCount, navigate, user, createOrder } = useContext(AppContext)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'cod'
  })


  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }))
    }
  }, [user])

  useEffect(() => {
    const fetchDefaultAddress = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        const res = await axios.get(
          "https://zovaonix-backend.onrender.com/api/address",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const addresses = Array.isArray(res.data) ? res.data : [];
        const defaultAddress = addresses.find((addr) => addr.isDefault);

        if (defaultAddress) {
          setFormData((prev) => ({
            ...prev,
            fullName: defaultAddress.fullName || prev.fullName,
            phone: defaultAddress.phoneNumber || prev.phone,
            address: defaultAddress.streetAddress || "",
            city: defaultAddress.city || "",
            state: defaultAddress.state || "",
            zipCode: defaultAddress.pincode || "",
          }));
        }
      } catch (error) {
        console.error(
          "Failed to fetch default address:",
          error.response?.data || error.message
        );
      }
    };

    fetchDefaultAddress();
  }, []);


  const cartArray = cartItems && cartItems.length > 0 ? cartItems : []
  const totalPrice = cartArray.reduce((a, i) => a + ((i.price || 0) * (i.quantity || 0)), 0)
  const totalOffer = cartArray.reduce((a, i) => a + (((i.offerPrice && i.offerPrice > 0) ? i.offerPrice : i.price || 0) * (i.quantity || 0)), 0)
  const discount = totalPrice - totalOffer

  if (cartArray.length === 0) {
    return (
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-4">Add items to proceed with checkout</p>
          <Link to="/products" className="inline-block bg-[#00354B] text-white px-6 py-2 rounded">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    const { fullName, email, phone, address, city, state, zipCode } = formData
    if (!fullName || !email || !phone || !address || !city || !state || !zipCode) {
      toast.error('Please fill all fields')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Invalid email format')
      return false
    }
    if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
      toast.error('Phone number must be 10 digits')
      return false
    }
    return true
  }

  const mapPaymentMethod = (method) => {
    const methodMap = {
      'card': 'Credit/Debit Card',
      'upi': 'UPI',
      'cod': 'Cash on Delivery',
      'netbanking': 'Net Banking',
      'googlepay': 'Google Pay'
    }
    return methodMap[method] || method
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };


  const handlePayment = async (razorpayOrder, mongoOrderId) => {
    try {
      const isScriptLoaded = await loadRazorpayScript();

      if (!isScriptLoaded) {
        alert("Failed to load Razorpay SDK. Please check your internet connection.");
        return;
      }

      const options = {
        key: "rzp_test_Tndz3GpN0eA0vG",
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || "INR",
        name: "Cart7",
        description: "Purchase Description",
        order_id: razorpayOrder.id,

        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              "https://zovaonix-backend.onrender.com/api/order/payment/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: mongoOrderId,
              }
            );

            if (verifyRes.data.success) {
              toast.success("Payment successful!");
              navigate("/order-success");
            } else {
              toast.error("Payment verification failed!");
            }
          } catch (error) {
            console.error(
              "Payment verification error:",
              error.response?.data || error.message
            );
            toast.error("Could not verify payment. Please contact support before retrying.");
          }
        },

        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new window.Razorpay(options);

      rzp1.on("payment.failed", function (response) {
        console.error("Razorpay payment failed:", response.error);
        toast.error("Payment failed. Please try again.");
      });

      rzp1.open();
    } catch (error) {
      console.error("Payment Error:", error);
      toast.error("Unable to open payment checkout.");
    }
  };

  // --------------------------------------------------------


  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!validateForm()) return;

  //   try {
  //     setLoading(true);

  //     const orderItems = cartArray.map((item) => ({
  //       productId:
  //         item.product?._id ||
  //         item.productId ||
  //         item._id ||
  //         item.id,

  //       name:
  //         item.product?.title ||
  //         item.title ||
  //         "Product",

  //       price:
  //         item.product?.offerPrice ||
  //         item.product?.price ||
  //         item.offerPrice ||
  //         item.price ||
  //         0,

  //       image:
  //         item.product?.image?.[0] ||
  //         item.image?.[0] ||
  //         item.image ||
  //         "",

  //       quantity: item.quantity || 1,
  //       size: item.selectedSize || null,
  //     }));

  //     const orderData = {
  //       items: orderItems,
  //       totalAmount: totalOffer,
  //       paymentMethod: mapPaymentMethod(formData.paymentMethod),
  //       phone: formData.phone,
  //       address: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.zipCode}`,
  //       orderId: `ORD-${Date.now()}`,
  //     };

  //     console.log("ORDER DATA:", orderData);

  //     const result = await createOrder(orderData);

  //     if (!result) {
  //       return;
  //     }

  //     console.log("Order created:", result);

  //     const paymentMethod = result.paymentMethod;

  //     if (paymentMethod === "UPI") {
  //       if (result.razorpayOrder) {
  //         handlePayment(result.razorpayOrder, result.order._id);
  //       } else {
  //         toast.error("Payment order details are missing");
  //       }
  //     } else if (
  //       paymentMethod === "COD" ||
  //       paymentMethod === "Cash on Delivery"
  //     ) {
  //       toast.success("Order placed successfully!");

  //       setTimeout(() => {
  //         navigate("/order-success");
  //       }, 1500);
  //     } else {
  //       toast.error(`Unsupported payment method: ${paymentMethod}`);
  //     }
  //   } catch (error) {
  //     console.error("Failed to place order:", error);
  //     toast.error("Failed to place order");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const ADMIN_WHATSAPP_NUMBER = "919037243300";

  const handleWhatsAppOrder = async (e) => {
    e?.preventDefault();

    if (!validateForm()) return;

    if (!cartArray || cartArray.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      setLoading(true);

      const orderItems = cartArray.map((item) => ({
        productId:
          item.product?._id ||
          item.productId ||
          item._id ||
          item.id,

        name:
          item.product?.title ||
          item.title ||
          "Product",

        price:
          item.product?.offerPrice ||
          item.product?.price ||
          item.offerPrice ||
          item.price ||
          0,

        image:
          item.product?.image?.[0] ||
          item.image?.[0] ||
          item.image ||
          "",

        quantity: item.quantity || 1,
        size: item.selectedSize || null,
      }));

      const orderData = {
        items: orderItems,
        totalAmount: totalOffer,
        paymentMethod: "COD",
        phone: formData.phone,
        address: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.zipCode}`,
        orderId: `ORD-${Date.now()}`,
      };

      // Save the order using the existing backend API
      const result = await createOrder(orderData);

      if (!result) {
        toast.error("Order could not be saved. Please try again.");
        return;
      }


      const itemsText = cartArray
        .map((item) => {
          const price =
            item.offerPrice && item.offerPrice > 0
              ? item.offerPrice
              : item.price || 0;

          const image =
            item.product?.image?.[0] ||
            item.image?.[0] ||
            "";

          return `${item.title || item.product?.title || "Product"}
Size: ${item.selectedSize || "N/A"}
Quantity: ${item.quantity || 1}
Price: ₹${price * (item.quantity || 1)}
Image: ${image}`;
        })
        .join("\n\n");


      const message = `
Hello Zovaonyx! I would like to confirm my order.

Order ID: ${result.order?.orderId || orderData.orderId}
Name: ${formData.fullName}
Phone: ${formData.phone}
Email: ${formData.email}

Address:
${orderData.address}

Items:
${itemsText}

Total: ₹${totalOffer}
Payment: Cash on Delivery

Please confirm my order.
    `.trim();

      const whatsappUrl =
        `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=` +
        encodeURIComponent(message);

      toast.success("Order saved successfully!");

      // Open WhatsApp after the order has been saved
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");

      // Go to the existing order success page
      navigate("/order-success");
    } catch (error) {
      console.error("Failed to place WhatsApp order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-semibold mb-2">Checkout</h1>
      <div className="flex gap-2 text-xs md:text-sm text-gray-500 mb-6">
        <Link to="/">Home</Link>
        <span>{'>'}</span>
        <Link to="/cart">Cart</Link>
        <span>{'>'}</span>
        <span>Checkout</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleWhatsAppOrder} className="space-y-6">
            {/* Shipping Details */}
            <div className="shadow-[0_0_3px_#24242453] rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Shipping Details</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:border-[#00354B]"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:border-[#00354B]"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:border-[#00354B]"
                  required
                />
                <textarea
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:border-[#00354B] h-20"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:border-[#00354B]"
                    required
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:border-[#00354B]"
                    required
                  />
                </div>
                <input
                  type="text"
                  name="zipCode"
                  placeholder="Zip Code"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:border-[#00354B]"
                  required
                />
              </div>
            </div>

            {/* Payment Method */}
            {/* <div className="shadow-[0_0_3px_#24242453] rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3"> */}
            {/* <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span className="ml-3">Credit/Debit Card</span>
                </label> */}
            {/* <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={formData.paymentMethod === 'upi'}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span className="ml-3">UPI</span>
                </label> */}
            {/* <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span className="ml-3">Cash on Delivery</span>
                </label> */}
            {/* </div>
            </div> */}
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="shadow-[0_0_3px_#24242453] rounded-lg p-6 h-fit sticky top-4">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            {/* Items */}
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {cartArray.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.title}
                    {item.selectedSize && ` (Size: ${item.selectedSize})`}
                    {" x "}{item.quantity}
                  </span>
                  <span className="font-semibold">₹{item.offerPrice * item.quantity}</span>
                </div>
              ))}
            </div>

            <hr className="my-4" />

            {/* Totals */}
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({getCartCount()} items)</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount</span>
                <span className="text-green-600">− ₹{discount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>₹0</span>
              </div>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between font-semibold text-base mb-4">
              <span>Total</span>
              <span>₹{totalOffer}</span>
            </div>



            <button
              type="button"
              onClick={handleWhatsAppOrder}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Placing Order..." : "Order via WhatsApp"}
            </button>



            <p className="text-xs text-gray-500 mt-4 text-center">
              100% Safe & Secure. Money back guarantee.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
