import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { FaHeart } from "react-icons/fa";

const ProductCard = ({ product }) => {

  const {
    addToCart,
    navigate,
    addToWish,
    wishItems
  } = useContext(AppContext)

  const isWishlisted = wishItems.some(
    item => item.id === product._id
  );

  return product && (

    <div className="w-full min-w-0 p-1.2 sm:p-3 relative sm:gap-x-8 sm:gap-y-5 text-black rounded-xl">

      {/* wishlist button */}

      <button
        onClick={() => addToWish(product._id)}
        className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 md:top-5 md:right-5 z-20 bg-white p-1 sm:p-2 rounded-full shadow cursor-pointer"
      >
        <FaHeart
          className={`text-xs sm:text-base md:text-lg transition ${isWishlisted ? "text-red-500" : "text-gray-300"
            }`}
        />
      </button>

      {/* image */}

      <div
        onClick={() => {
          navigate(`/products/${product._id}`);
          scrollTo(0, 0);
        }}
        className="group flex justify-center items-center w-full h-[120px] sm:h-[160px] md:h-[200px] shadow-[0_0_3px_1px_#24242453] rounded-[24px_0_24px_0] transition-all duration-300 ease-linear hover:rounded-[0_24px_0_24px] overflow-hidden bg-[#F8F3F4]"
      >
        <img
          src={product?.image?.[0]}
          alt={product.title}
          className="w-[160px] p-3 h-[160px] object-contain transition-transform duration-300 ease-linear group-hover:scale-110"
        />
      </div>

      {/* title */}

      <div className="mt-2">
        <p className="text-sm font-medium  text-black">
          {product.title}
        </p>
        <p className="text-gray-600 text-sm mt-3 leading-6">
          {product.description
            ? product.description.split(/\s+/).slice(0, 3).join(' ') +
            (product.description.trim().split(/\s+/).length > 3 ? '...' : '')
            : ''}
        </p>
      </div>

      {/* price */}

      <div className="flex items-center  text-black gap-3 mt-2">

        <p className="font-bold ">
          ₹{product.offerPrice}
        </p>

        <del className="text-[12px] text-black">
          ₹{product.price}
        </del>

      </div>

      {/* cart button */}

      <button
        onClick={() => addToCart(product._id)}
        className="w-full cursor-pointer mt-2 sm:mt-3 p-1 sm:p-2 text-xs sm:text-sm text-white bg-[#4A0015] rounded-md hover:bg-[#65001B] transition"
      >
        Add to Cart
      </button>

    </div>
  )
}

export default ProductCard