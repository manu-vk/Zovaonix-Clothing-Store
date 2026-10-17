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
    const query =
      (typeof searchQuery === "string" ? searchQuery : "")
        .trim()
        .toLowerCase();

    if (!query) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter((product) => {
      return (
        String(product.title || "").toLowerCase().includes(query) ||
        String(product.brand || "").toLowerCase().includes(query) ||
        String(product.description || "").toLowerCase().includes(query)
      );
    });

    setFilteredProducts(filtered);
  }, [products, searchQuery]);


  const sortLowToHigh = () => {
    setFilteredProducts((prev) =>
      [...prev].sort(
        (a, b) => Number(a.offerPrice) - Number(b.offerPrice)
      )
    );
  };

  const sortHighToLow = () => {
    setFilteredProducts((prev) =>
      [...prev].sort(
        (a, b) => Number(b.offerPrice) - Number(a.offerPrice)
      )
    );
  };



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


            <div className="relative flex flex-wrap items-center gap-3 text-sm">
              {/* Desktop: show sort options directly */}
              <div className="hidden items-center gap-3 md:flex">
                <p>Sort By:</p>

                <button
                  type="button"
                  onClick={sortLowToHigh}
                  className="cursor-pointer hover:text-[#800020]"
                >
                  Price - Low to High
                </button>

                <button
                  type="button"
                  onClick={sortHighToLow}
                  className="cursor-pointer hover:text-[#800020]"
                >
                  Price - High to Low
                </button>
              </div>

            
              
{/* Mobile & tablet: Filter button on the right */}
<div className="relative ml-auto -translate-y-8 md:hidden">
  <button
    type="button"
    onClick={() => setShowFilter(!showFilter)}
    aria-expanded={showFilter}
    className="flex items-center gap-1.5 rounded-full border border-[#000000] bg-[#000000] px-3 py-1.5 text-xs text-white sm:px-3.5 sm:py-2 sm:text-sm"
  >
    Filter
    <img
      src={assets.filterIcon}
      alt=""
      className="h-3.5 w-3.5 brightness-0 invert sm:h-4 sm:w-4"
    />
  </button>

  {showFilter && (
    <div className="absolute right-0 bottom-full z-20 mt-2 flex min-w-[170px] flex-col gap-3 rounded-lg border bg-white p-3 text-sm shadow-lg">
      <button
        type="button"
        onClick={() => {
          sortLowToHigh();
          setShowFilter(false);
        }}
        className="text-left hover:text-[#800020]"
      >
        Price - Low to High
      </button>

      <button
        type="button"
        onClick={() => {
          sortHighToLow();
          setShowFilter(false);
        }}
        className="text-left hover:text-[#800020]"
      >
        Price - High to Low
      </button>
    </div>
  )}
</div>

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
          <button className='w-[160px] cursor-pointer p-1 border-1 border-[#00354B] rounded-sm hover:bg-primary hover:text-white transition duration-300 ease-linear'>Load More</button>
        </div>

      </div>
    </>
  )
}

export default ProductPage
