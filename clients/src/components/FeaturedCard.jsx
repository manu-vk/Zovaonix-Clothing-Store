import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const FeaturedCard = ({ product }) => {

    const { addToCart, navigate } = useContext(AppContext)
    console.log(product.image);

    return product && (
        <div className="w-full min-w-0 p-1.2 sm:p-3 relative text-black rounded-xl">
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
                    className="w-[160px] h-[160px] object-contain transition-transform duration-300 ease-linear group-hover:scale-110"
                />
            </div>


            <div className="mt-2">
                <p className="text-sm text-black font-medium">{product.title}</p>
            </div>

            <div className="flex items-center gap-3 mt-2">
                <p className="font-bold text-black">₹{product.offerPrice}</p>
                <del className="text-[12px] text-black">₹{product.price}</del>
            </div>

            <button
                onClick={() => addToCart(product._id)}
                className="w-full cursor-pointer mt-2 sm:mt-3 p-1 sm:p-2 text-xs sm:text-sm text-white bg-[#4A0015] rounded-md hover:bg-[#65001B] transition"
            >
                Add to Cart
            </button>
        </div>
    )
}

export default FeaturedCard
