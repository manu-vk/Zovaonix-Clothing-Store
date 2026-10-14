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


  const product = products.find(
    (item) => String(item._id) === String(id)
  )


  const handleBuyNow = async () => {
    await addToCart(product._id);
    navigate("/checkout");
  };



  const off = Math.round(
    ((product.price - product.offerPrice) / product.price) * 100
  )

  const handleWish = (productId) => {
    addToWish(productId)
  }

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
                  className="w-20 h-20 border cursor-pointer"
                />
              ))}
            </div>

            <div className="relative w-full sm:w-[400px]">
              <img
                src={thumbnail}
                className="w-full aspect-square object-cover border"
              />

              <div className="absolute top-2 right-2 flex flex-col gap-1.5 sm:gap-2">
                <img
                  onClick={() => handleWish(product._id)}
                  src={wishItems[product._id] ? assets.wishTrueIcon : assets.wishFalseIcon}
                  className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer"
                  alt="Wishlist"
                />

                <img
                  src={assets.shareIcon}
                  className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer"
                  alt="Share"
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
              onClick={() => addToCart(product._id)}
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
          <p className="text-gray-600 text-sm mt-3 leading-6 whitespace-pre-line">
            {product.description}
          </p>

          <div className="flex gap-2 items-center mt-2">
            <span>{product.rating}</span>
            <span>({product.ratingCount})</span>
          </div>

          <p className="text-red-500 mt-2">Hurry up! limited stock</p>

          <div className="mt-4 flex gap-3 items-center">
            <h2 className="text-2xl font-bold">₹{product.offerPrice}</h2>
            <del>₹{product.price}</del>
            <span className="text-green-600">{off}% OFF</span>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() =>
                updateCartItem(product._id, (cartItems[product._id] || 0) - 1)
              }
            >
              -
            </button>

            <span>{cartItems[product._id] || 0}</span>

            <button
              onClick={() =>
                updateCartItem(product._id, (cartItems[product._id] || 0) + 1)
              }
            >
              +
            </button>
          </div>

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