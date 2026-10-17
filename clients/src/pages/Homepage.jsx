import React, { useContext, useEffect, useState, useRef } from 'react'
import MainBanner from '../components/MainBanner.jsx'
import { assets } from '../assets/assets.js'
import FeaturedCard from '../components/FeaturedCard.jsx'
import { AppContext } from '../context/AppContext.jsx'
import { AuthContext } from "../context/Authcontext.jsx";
import { useNavigate } from 'react-router-dom'
import { Link } from "react-router-dom";



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





  const offersScrollRef = useRef(null);

  const scrollOffers = (direction) => {
    if (offersScrollRef.current) {
      offersScrollRef.current.scrollBy({
        left: direction * 300,
        behavior: "smooth",
      });
    }
  };

  const offerProducts = featured.filter(
    (product) =>
      product.price > 0 &&
      ((product.price - product.offerPrice) / product.price) * 100 >= 20
  );
  const shopLookScrollRef = useRef(null);

  const scrollShopLook = (direction) => {
    if (shopLookScrollRef.current) {
      shopLookScrollRef.current.scrollBy({
        left: direction * shopLookScrollRef.current.clientWidth * 0.8,
        behavior: "smooth",
      });
    }
  };


  return (
    <>
      <title>Zovaonix Home</title>
      <div className="w-full py-0">

        {/* <MainBanner /> */}
      <section className="relative left-1/2 -translate-x-1/2 w-screen h-[390px] sm:h-[400px] md:h-[500px] overflow-hidden">

  <img
  src={assets.titleimage}
  alt="Zovaonyx Fashion"
  className="home-title-image absolute inset-0 block"
/>

  <Link
    to="/products"
    className="absolute bottom-5 left-5 sm:bottom-8 sm:left-8 md:bottom-10 md:left-10 bg-black text-white px-6 py-3 text-sm tracking-wide hover:bg-neutral-800 transition"
  >
    SHOP NOW
  </Link>

</section>



        <div className="mt-10 flex items-center justify-between">
          <h1 className="text-[20px] font-semibold text-[#000000] md:text-[25px] lg:text-[35px]">
            Shop the <span>Look</span>
          </h1>

          {/* Hide arrows on mobile */}
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollShopLook(-1)}
              aria-label="Scroll Shop the Look left"
              className="flex h-[30px] w-[30px] items-center justify-center rounded-full shadow-[0_0_3px_#24242453] hover:bg-gray-100"
            >
              <img src={assets.leftArrowIcon} alt="" className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => scrollShopLook(1)}
              aria-label="Scroll Shop the Look right"
              className="flex h-[30px] w-[30px] items-center justify-center rounded-full shadow-[0_0_3px_#24242453] hover:bg-gray-100"
            >
              <img src={assets.rightArrowIcon} alt="" className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <div
            ref={shopLookScrollRef}
            className="w-full overflow-x-hidden sm:overflow-x-auto sm:scroll-smooth"
          >
            <div className="grid grid-cols-2 gap-3 p-2 sm:flex sm:w-max sm:flex-nowrap sm:gap-7 sm:p-3 md:gap-7 md:p-5 lg:gap-10 lg:p-6">
              {featured.slice(0, 10).map((product) => (
                <div
                  key={product._id}
                  className="min-w-0 sm:w-[200px] sm:shrink-0"
                >
                  <FeaturedCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>


        <div className='flex justify-center items-center mt-4 text-center lg:text-2xl md:text-[20px] sm:text-sm text-black'>
          <div className='max-w-md px-4'>
            <p>Discover your style with Zovaonix — trendy fashion, timeless looks, and everyday essentials designed to make you stand out. </p>
          </div>
        </div>

        {/* 3 cards */}

        <div className="mainthreecard md:text-2xl md:font-medium lg:text-3xl lg:font-bold mt-22">

          <div
            className="mainthreecard-box bg-one active cursor-pointer"
            onClick={() => navigate('/products?filter=new-arrivals')}
          >
            <p className="pl-15">New Arrivals</p>
          </div>

          <div
            className="mainthreecard-box bg-two flex cursor-pointer"
            onClick={() => navigate('/products?filter=limited-edition')}
          >
            <p className="pl-15">Limited Edition</p>
          </div>

          <div
            className="mainthreecard-box bg-three cursor-pointer"
            onClick={() => navigate('/products?filter=best-sellers')}
          >
            <p className="pl-15">Best Sellers</p>
          </div>

        </div>




        <div className="mt-23 flex justify-between items-center">
          <h1 className="sm:text-[20px] md:text-[25px] lg:text-[35px] font-semibold text-[#000000]">
            Offers<span> Zone</span>
          </h1>

          {/* Mobile-ൽ arrows hide ചെയ്യും */}
          <div className="hidden sm:flex gap-2">
            <button
              type="button"
              onClick={() => scrollOffers(-1)}
              aria-label="Scroll offers left"
              className="flex justify-center items-center rounded-full shadow-[0_0_3px_#24242453] w-[30px] h-[30px] hover:bg-gray-100"
            >
              <img src={assets.leftArrowIcon} alt="" className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => scrollOffers(1)}
              aria-label="Scroll offers right"
              className="flex justify-center items-center rounded-full shadow-[0_0_3px_#24242453] w-[30px] h-[30px] hover:bg-gray-100"
            >
              <img src={assets.rightArrowIcon} alt="" className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex justify-center">
          <div
            ref={offersScrollRef}
            className="w-full overflow-x-hidden sm:overflow-x-auto scroll-smooth"
          >
            <div className="
      grid
      grid-cols-2
      gap-3 p-2
      sm:flex sm:w-max sm:flex-nowrap sm:gap-7 sm:p-3
      md:gap-7 md:p-5
      lg:gap-10 lg:p-6
    ">
              {offerProducts.map(product => (
                <div
                  key={product._id}
                  className="min-w-0 sm:w-[200px] sm:shrink-0"
                >
                  <FeaturedCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>




        <div className="homeBottomBanner mt-23 flex items-center justify-between w-full lg:h-[264px] rounded-2xl overflow-hidden p-2 sm:p-3 bg-[#F7EDEF] text-[#5B1830]">

          <div className="flex flex-col p-2 sm:p-5">
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-[#9E2543] font-medium">
              Discover Your Style
            </p>

            <h2 className="text-xl sm:text-2xl md:text-4xl font-bold mt-2">
              Style That Speaks
            </h2>

            <p className="text-xs sm:text-sm md:text-base mt-2 text-[#704653]">
              Refresh your wardrobe with timeless fashion and everyday essentials.
            </p>

            <button
              onClick={() => navigate('/products')}
              className="w-fit cursor-pointer mt-4 px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm md:text-base text-white bg-[#8B1E3F] rounded-md hover:bg-[#6F1732] transition"
            >
              Shop Collection
            </button>
          </div>

        </div>

      </div>
    </>
  )
}

export default Homepage
