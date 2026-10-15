import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { Link, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import ProductCard from '../components/ProductCard'

const ProductView = () => {

  const { products, navigate, addToCart, updateCartItem, cartItems, addToWish, wishItems } =
    useContext(AppContext)

  const { id } = useParams()

  const [relatedProducts, setRelatedProducts] = useState([])
  const [thumbnail, setThumbnail] = useState(null)
  const [selectedSize, setSelectedSize] = useState('')

  const product = products.find(
    (item) => String(item._id) === String(id)
  )


  const handleBuyNow = async () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    await addToCart(product._id, thumbnail, selectedSize);
    navigate("/checkout");
  };



  const off = Math.round(
    ((product.price - product.offerPrice) / product.price) * 100
  )

  const handleWish = (productId) => {
    addToWish(productId)
  }
  console.log("PRODUCT ID:", product._id);
  console.log("WISHLIST ITEMS:", wishItems);
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

  useEffect(() => {
    if (products.length > 0 && product) {
      const related = products
        .filter((item) => item.category === product.category)
        .slice(0, 5)

      setRelatedProducts(related)
    }
  }, [products, product])

  useEffect(() => {
    if (product) {
      setThumbnail(product.image?.[0] || null)
    }
  }, [product])

  return (
    <div className='mx-3 py-4 sm:m-5 sm:py-5'>

      {/* BREADCRUMB */}
      <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500">
        <Link to="/">Home</Link>
        <span>&gt;</span>
        <Link to="/products">Products</Link>
        <span>&gt;</span>
        <span>{product.title}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:gap-16 mt-6">

        {/* LEFT SIDE */}
        <div className="flex flex-col w-full md:w-auto min-w-0">

          <div className="flex gap-3">

            <div className="flex flex-col gap-3">
              {product.image?.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  onClick={() => setThumbnail(img)}
                  className="w-20 p-2 h-20 border cursor-pointer"
                />
              ))}
            </div>

            <div className="relative w-full sm:w-[400px]">
              <img
                src={thumbnail}
                className="w-full p-3 aspect-square object-fill border"
              />

              <div className="absolute top-2 right-2 flex flex-col gap-1.5 sm:gap-2">
                {/* <img
                  onClick={() => handleWish(product._id)}
                  src={wishItems[product._id] ? assets.wishTrueIcon : assets.wishFalseIcon}
                  className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer"
                  alt="Wishlist"
                /> */}


                <svg
                  onClick={() => handleWish(product._id)}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className={`w-5 h-5 sm:w-6 sm:h-6 cursor-pointer ${wishItems?.some(
                    (item) => String(item.id) === String(product._id)
                  )
                    ? "text-red-500"
                    : "text-gray-500"
                    }`}
                  fill={
                    wishItems?.some(
                      (item) => String(item.id) === String(product._id)
                    )
                      ? "currentColor"
                      : "none"
                  }
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"
                  />
                </svg>




                <img
                  src={assets.shareIcon}
                  className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer"
                  alt="Share"
                  onClick={handleShare}
                />

              </div>
            </div>

          </div>

          {/* BUTTONS */}
          <div className="mt-4 flex flex-col gap-3">
            <button
              onClick={handleBuyNow}
              className="bg-primary text-white py-2"
            >
              Buy Now
            </button>

            <button
              type="button"
              onClick={() => {
                if (!selectedSize) {
                  alert("Please select a size");
                  return;
                }

                addToCart(product._id, thumbnail,selectedSize);
              }}
              className="border border-primary py-2"
            >
              Add to Cart
            </button>
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2">

          <h1 className="text-2xl font-bold">{product.title}</h1>
          <p>{product.brand}</p>
          {/* AVAILABLE SIZES */}
          <div className="mt-5">
            <p className="font-medium mb-3">Select Size</p>

            <div className="flex flex-wrap gap-2">
              {(product.sizes || ['S', 'M', 'L', 'XL', 'XXL']).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-10 h-10 px-3 border rounded ${selectedSize === size
                    ? 'bg-primary text-white border-primary'
                    : 'border-gray-300 hover:border-primary'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {!selectedSize && (
              <p className="text-sm text-gray-500 mt-2">
                Please select a size before continuing.
              </p>
            )}
          </div>
          <p className="text-gray-600 text-sm mt-3 leading-6 whitespace-pre-line">
            {product.description}
          </p>

          <div className="flex gap-2 items-center mt-2">
            <span>Rating*{product.rating}</span>
            <span>(Available{product.ratingCount})</span>
          </div>

          <p className="text-red-500 mt-2">Hurry up! limited stock</p>

          <div className="mt-4 flex gap-3 items-center">
            <h2 className="text-2xl font-bold">₹{product.offerPrice}</h2>
            <del>₹{product.price}</del>
            <span className="text-green-600">{off}% OFF</span>
          </div>

          {/* <div className="flex items-center gap-3 mt-4">


            <button
              onClick={() =>
                updateCartItem(
                  product._id,
                  Math.max(0, (cartItems[product._id] || 0) - 1)
                )
              }
            >
              -
            </button>

            <span>{cartItems[product._id] || 0}</span>

            <button
              onClick={() =>
                updateCartItem(
                  product._id,
                  (cartItems[product._id] || 0) + 1
                )
              }
            >
              +
            </button>
          </div> */}

        </div>

      </div>

      {/* RELATED PRODUCTS */}
      <div className="mt-10 grid grid-cols-2 md:grid-cols-5 gap-5">
        {relatedProducts.map((item) => (
          <ProductCard key={item._id} product={item} />
        ))}
      </div>

    </div>
  )
}

export default ProductView