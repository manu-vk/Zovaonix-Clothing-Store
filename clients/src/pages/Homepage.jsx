import React, { useContext, useEffect, useState } from 'react'
import MainBanner from '../components/MainBanner.jsx'
import { assets } from '../assets/assets.js'
import FeaturedCard from '../components/FeaturedCard.jsx'
import { AppContext } from '../context/AppContext.jsx'
import { AuthContext } from "../context/Authcontext.jsx";
import { useNavigate } from 'react-router-dom'


const Homepage = () => {

  const { token } = useContext(AuthContext)
  const { products } = useContext(AppContext)
  const [featured, setFeatured] = useState([])
  const [offerZone, setOfferZone] = useState([])
  const navigate = useNavigate();
  useEffect(() => {
    setFeatured(products)

    const offerbase = [...products].sort(
      (a, b) => a.offerPrice - b.offerPrice
    )
    setOfferZone(offerbase)

  }, [products])

  // useEffect(() => {
  //   if (!token) {
  //     navigate("/login");
  //   }
  // }, [token]);


  return (
    <>
      <title>Zovaonix Home</title>
      <div className='m-5 py-5'>

        <MainBanner />
        
        

        <div className='mt-23 flex justify-between items-center'>
          <h1 className='sm:text-[20px] md:text-[25px] lg:text-[35px] font-semibold text-[#800020]'>Featured<span> Collections</span></h1>

          {/* <div className='flex gap-2'>
            <button className='flex justify-center items-center rounded-full shadow-[0_0_3px_#24242453] w-[30px] h-[30px] hover:bg-gray-100'>
              <img src={assets.leftArrowIcon} alt="" className='w-5 h-5 brightness-0 invert' />
            </button>
            <button className='flex justify-center items-center rounded-full shadow-[0_0_3px_#24242453] w-[30px] h-[30px] hover:bg-gray-100'>
              <img src={assets.rightArrowIcon} alt="" className='w-5 h-5 brightness-0 invert' />
            </button>
          </div> */}
        </div>

        <div className='flex justify-center '>
           <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 p-2 sm:gap-7 sm:p-3 md:gap-7 md:p-5 lg:gap-10 lg:p-6">
            {featured.slice(0, 5).map(product => (
              <FeaturedCard key={product._id} product={product} />
            ))}
          </div>
        </div>

        <div className='flex justify-center items-center mt-4 text-center lg:text-2xl md:text-[20px] sm:text-sm text-black'>
          <div className='max-w-md px-4'>
            <p>Discover your style with Zovaonix — trendy fashion, timeless looks, and everyday essentials designed to make you stand out. </p>
          </div>
        </div>

        {/* 3 cards */}
        <div className="mainthreecard md:text-2xl md:font-medium lg:text-3xl lg:font-bold mt-22">
          <div className="mainthreecard-box bg-one active">
            <p className='pl-15'>New Arrivals</p>
          </div>
          <div className="mainthreecard-box bg-two flex">
            <p className='pl-15'>Limited Edition</p>
          </div>
          <div className="mainthreecard-box bg-three">
            <p className='pl-15'>Best Sellers</p>
          </div>
        </div>

        {/* <div className='mt-23 flex justify-between items-center'>
          <h1 className='sm:text-[20px] md:text-[25px] lg:text-[35px] font-semibold'>Explore<span> Categories</span></h1>

          <div className='flex gap-2'>
            <p className='text-decoration-line: underline'>See All</p>
          </div>
        </div> */}

        {/* Categories section */}
        {/* <div className='flex justify-center'>
          <div className='mt-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4'>
            <div className='flex justify-center items-center w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full shadow-[0_0_3px_#24242453]'>
              <img src={assets.productTwo} alt="" className='w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-30 lg:h-30' />
            </div>
            <div className='flex justify-center items-center w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full shadow-[0_0_3px_#24242453]'>
              <img src={assets.productThree} alt="" className='w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-30 lg:h-30' />
            </div>
            <div className='flex justify-center items-center w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full shadow-[0_0_3px_#24242453]'>
              <img src={assets.productFour} alt="" className='w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-30 lg:h-30' />
            </div>
            <div className='flex justify-center items-center w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full shadow-[0_0_3px_#24242453]'>
              <img src={assets.productFive} alt="" className='w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-30 lg:h-30' />
            </div>
            <div className='flex justify-center items-center w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full shadow-[0_0_3px_#24242453]'>
              <img src={assets.productSix} alt="" className='w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-30 lg:h-30' />
            </div>
            <div className='flex justify-center items-center w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full shadow-[0_0_3px_#24242453]'>
              <img src={assets.productSixteen} alt="" className='w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-30 lg:h-30' />
            </div>
          </div>
        </div> */}

        <div className='mt-23 flex justify-between items-center'>
          <h1 className='sm:text-[20px] md:text-[25px] lg:text-[35px] font-semibold text-[#800020]'>Offers<span> Zone</span></h1>

          <div className='flex gap-2'>
            <button className='flex justify-center items-center rounded-full shadow-[0_0_3px_#24242453] w-[30px] h-[30px] hover:bg-gray-100'>
              <img src={assets.leftArrowIcon} alt="" className='w-5 h-5' />
            </button>
            <button className='flex justify-center items-center rounded-full shadow-[0_0_3px_#24242453] w-[30px] h-[30px] hover:bg-gray-100'>
              <img src={assets.rightArrowIcon} alt="" className='w-5 h-5' />
            </button>
          </div>
        </div>

        <div className='flex justify-center '>
         <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 p-2 sm:gap-7 sm:p-3 md:gap-7 md:p-5 lg:gap-10 lg:p-6">
            {featured.slice(0, 5).map(product => (
              <FeaturedCard key={product._id} product={product} />
            ))}
          </div>
        </div>

       <div className="homeBottomBanner mt-23 flex items-center justify-between w-full lg:h-[264px] rounded-2xl overflow-hidden p-2 sm:p-3">

  <div className="flex flex-col p-2 sm:p-5">
    <h2 className="text-xl sm:text-2xl md:text-4xl font-bold">
      Elegance in Every Bottle
    </h2>

    <p className="text-xs sm:text-sm md:text-base mt-1">
      Discover timeless fragrances crafted for every moment
    </p>

    <button className="w-fit cursor-pointer mt-3 px-3 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm md:text-base text-white bg-primary rounded-sm hover:bg-primary-dull transition">
      Shop Now
    </button>
  </div>

</div>
      </div>
    </>
  )
}

export default Homepage
