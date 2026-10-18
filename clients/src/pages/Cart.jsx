import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import toast from 'react-hot-toast'

const Cart = () => {
  const { products, cartItems, updateCartItem, removeCartItem, getCartCount, navigate } = useContext(AppContext)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    console.log("Cart items updated:", cartItems);
  }, [cartItems])

  const cartArray = cartItems && cartItems.length > 0 ? cartItems : []

  const totalPrice = cartArray.reduce((a, i) => a + ((i.product?.price || i.price || 0) * i.quantity), 0)
  const totalOffer = cartArray.reduce((a, i) => a + ((i.product?.offerPrice || i.product?.salePrice || i.offerPrice || 0) * i.quantity), 0)
  const discount = totalPrice - totalOffer

  const handleRemove = async (itemId) => {
    try {
      setLoading(true)
      await removeCartItem(itemId)
    } catch (error) {
      console.error('Error removing item:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    try {
      if (newQuantity < 1) return
      setLoading(true)
      await updateCartItem(itemId, newQuantity)
    } catch (error) {
      console.error('Error updating quantity:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProceedToBuy = () => {
    if (cartArray.length === 0) {
      toast.error('Your cart is empty')
      return
    }
    navigate('/checkout')
  }

  const handleShare = async () => {
    const shareData = {
      title: product.title,
      text: `Check out ${product.title} at Zovaonyx!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert("Product link copied!");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Share failed:", error);
      }
    }
  };


  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-semibold">Cart</h1>
      <div className="flex gap-2 text-xs md:text-sm text-gray-500 mt-1">
        <Link to="/">Home</Link>
        <span>{'>'}</span>
        <span>Cart</span>
      </div>

      {cartArray.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-center">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-4">Add some items to get started!</p>
            <Link to="/products" className="inline-block bg-[#000000] text-white px-6 py-2 rounded hover:bg-opacity-90 transition">
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-4">
            {cartArray.map(item => {
              // Backend returns flattened structure with 'id' field
              const itemId = item.cartId || item._id;
              const productId = item.id || item.product?._id || item.productId;
              const title = item.title || item.product?.title
              const price = item.price || item.product?.price || 0
              const offerPrice = item.offerPrice || item.product?.offerPrice || item.product?.salePrice || 0
              const image = item.image || item.product?.image || []
              const off = price > 0 ? Math.round(((price - offerPrice) / price) * 100) : 0

              return (
                <div key={itemId} className="flex flex-col sm:flex-row gap-4 shadow-[0_0_3px_#24242453] rounded-lg p-4">
                  <Link to={`/products/${productId}`}>
                    <img
                      src={
                        image?.[0]
                          ? image[0].startsWith('http')
                            ? image[0]
                            : `http://localhost:5000/uploads/${image[0]}`
                          : assets.placeholderImage
                      }
                      alt={title}
                      className="w-24 h-24 sm:w-28 sm:h-28 object-contain mx-auto sm:mx-0"
                    />
                  </Link>

                  <div className="flex-1">
                    <h3 className="font-medium text-sm md:text-base">{title}</h3>
                    {item.selectedSize && (
                      <p className="text-sm text-gray-600 mt-1">
                        Size: <span className="font-medium">{item.selectedSize}</span>
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        disabled={loading}
                        onClick={() => handleUpdateQuantity(itemId, item.quantity - 1)}
                        className="cursor-pointer border px-3 disabled:opacity-50"
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        disabled={loading}
                        onClick={() => handleUpdateQuantity(itemId, item.quantity + 1)}
                        className="cursor-pointer border px-3 disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-sm">
                      <p className="font-bold">₹{offerPrice}</p>
                      <del className="text-gray-400">₹{price}</del>
                      {price !== offerPrice && <span className="text-green-600">{off}% off</span>}
                    </div>
                    <div className="flex flex-wrap gap-3 mt-3">
                      <button
                        disabled={loading}
                        onClick={() => handleRemove(itemId)}
                        className="cursor-pointer border border-red-500 text-red-500 px-4 py-1 rounded text-sm disabled:opacity-50"
                      >
                        Delete
                      </button>

                      <button
                        type="button"
                        onClick={async () => {
                          const shareData = {
                            title: item.title,
                            text: `Check out ${item.title} at Zovaonyx!`,
                            url: `${window.location.origin}/product/${item.id}`,
                          };

                          try {
                            if (navigator.share) {
                              await navigator.share(shareData);
                            } else {
                              await navigator.clipboard.writeText(shareData.url);
                              alert("Product link copied!");
                            }
                          } catch (error) {
                            if (error.name !== "AbortError") {
                              console.error("Share failed:", error);
                            }
                          }
                        }}
                        className="cursor-pointer border px-4 py-1 rounded text-sm hover:bg-gray-50"
                      >
                        Share
                      </button>



                      <button
                        onClick={() => navigate(`/products/${productId}`)}
                        className="cursor-pointer bg-[#000000] text-white px-6 py-1 rounded text-sm hover:bg-opacity-90"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="shadow-[0_0_3px_#24242453] rounded-lg p-5 h-fit sticky top-4">
            <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Price ({getCartCount()} items)</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span className="text-green-600">− ₹{discount}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="text-green-600">Free</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold text-base">
                <span>Total Amount</span>
                <span>₹{totalOffer}</span>
              </div>
            </div>
            <button
              onClick={handleProceedToBuy}
              disabled={loading}
              className="cursor-pointer w-full bg-[#000000] text-white py-2 rounded mt-4 hover:bg-opacity-90 disabled:opacity-50 transition"
            >
              {loading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
            <p className="text-xs text-gray-500 mt-3 text-center">
              Safe and Secure Payments. Easy returns. 100% Authentic products.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
