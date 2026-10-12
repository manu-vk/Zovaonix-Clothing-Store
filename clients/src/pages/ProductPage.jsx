import React, { useContext, useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { AppContext } from '../context/AppContext'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const ProductPage = () => {

  const { products, searchQuery } = useContext(AppContext)
  const [filteredProducts, setFilteredProducts] = useState([])
  const [showFilter, setShowFilter] = useState(false);


  useEffect(() => {
    if (typeof searchQuery === 'string' && searchQuery.trim().length > 0) {
      setFilteredProducts(
        products.filter(product =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    } else {
      setFilteredProducts(products)
    }
  }, [products, searchQuery])

  const sortHighToLow = () => {
    const sorted = [...filteredProducts].sort(
      (a, b) => b.offerPrice - a.offerPrice
    )
    setFilteredProducts(sorted)
  }
  const sortLowToHigh = () => {
    const sorted = [...filteredProducts].sort(
      (a, b) => a.offerPrice - b.offerPrice
    )
    setFilteredProducts(sorted)
  }

  return (
    <>
      <title>Fragranzia Products</title>
      <div className='m-5 py-5'>

        <div className="ml-4 sm:ml-6 md:ml-9">
          <h1 className="text-2xl sm:text-3xl md:text-[35px] font-rethink font-bold text-[#800020]">
            Sales
          </h1>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-3">

            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium">
              <Link to="/">Home</Link>
              <span>{'>'}</span>
              <Link to="/products">Sales</Link>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <p className="hidden sm:block">Sort By:</p>

              <ul
                className={`${showFilter ? "flex" : "hidden"
                  } md:flex flex-col md:flex-row gap-3 cursor-pointer absolute md:static top-12 right-0 bg-white md:bg-transparent border md:border-0 p-3 md:p-0 rounded-lg shadow md:shadow-none z-10`}
              >
                <li>Relevance</li>
                <li>Newest</li>
                <li>Popularity</li>
                <li onClick={sortLowToHigh}>Price - Low to High</li>
                <li onClick={sortHighToLow}>Price - High to Low</li>
              </ul>

              <button
                onClick={() => setShowFilter(!showFilter)}
                className="flex items-center gap-2 border rounded-full px-3 py-1 text-white"
              >
                Filter
                <img src={assets.filterIcon} alt="" className="w-4 h-4 brightness-0 invert" />
              </button>
            </div>

          </div>
        </div>


        <div className='flex justify-center'>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 p-2 sm:gap-5 sm:p-3 md:gap-7 md:p-5 lg:gap-10 lg:p-6">
            {filteredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>

        <div className='flex justify-center mt-3'>
          <button className='w-[196px] cursor-pointer p-2 border-2 border-[#00354B] rounded-sm hover:bg-primary hover:text-white transition duration-300 ease-linear'>Load More</button>
        </div>

      </div>
    </>
  )
}

export default ProductPage
