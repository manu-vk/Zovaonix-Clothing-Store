import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import toast from 'react-hot-toast'
import { FaHeart, FaBars, FaTimes } from 'react-icons/fa'
import ProfileSideBar from '../../components/profileComponents/ProfileSideBar'
const WishlistPage = () => {


    const {
        addToCart,
        addToWish,
        wishItems,
        fetchWishlist
    } = useContext(AppContext)

    // Fetch wishlist when component loads
    useEffect(() => {
        fetchWishlist()
    }, [])

    const handleRemoveFromWishlist = async (productId) => {
        await addToWish(productId)
        toast.success('Removed from wishlist')
    }

    const handleAddToCart = async (productId) => {
        await addToCart(productId)
    }

    const wishArray = wishItems && Array.isArray(wishItems) ? wishItems : [];
    const [menuOpen, setMenuOpen] = useState(false)

    return (


        <div className="p-3 sm:p-4 md:p-6">
            {/* Mobile account menu */}
            <div className="mb-4 md:hidden">
                <button
                    onClick={() => setMenuOpen(true)}
                    className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm"
                >
                    <FaBars />
                    My Account
                </button>
            </div>

            {/* Mobile side drawer */}
            {menuOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    {/* Background overlay */}
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setMenuOpen(false)}
                    />

                    {/* Drawer */}
                    <div className="absolute left-0 top-0 h-full w-72 max-w-[85%] overflow-y-auto bg-white p-4 shadow-xl">
                        <div className="mb-4 flex justify-end">
                            <button
                                onClick={() => setMenuOpen(false)}
                                className="rounded-lg p-2 text-gray-700"
                                aria-label="Close menu"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>

                        <ProfileSideBar className="w-full" />
                    </div>
                </div>
            )}



            <h1 className="text-primary text-2xl font-bold mb-6">
                My Wishlist ({wishArray.length})
            </h1>

            {wishArray.length === 0 ? (

                <div className="text-center py-12">

                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">

                        <FaHeart className="w-12 h-12 text-gray-300" />

                    </div>

                    <h3 className="text-primary text-lg font-medium mb-2">
                        Your wishlist is empty
                    </h3>

                    <p className="text-gray-500">
                        Add items you love to your wishlist
                    </p>

                </div>

            ) : (

                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                    {wishArray.map(item => (
                        <div
                            key={item.id}
                            className="border rounded-xl p-4 hover:shadow-md transition-shadow bg-white"
                        >
                            <div className="relative mb-4">
                                <img
                                    src={
                                        item?.image?.[0]
                                            ? item.image[0].startsWith("http")
                                                ? item.image[0]
                                                : `http://localhost:5000/uploads/${item.image[0]}`
                                            : assets.placeholderImage
                                    }
                                    alt={item.title}
                                    className="w-full aspect-[3/4] object-cover rounded-lg sm:aspect-auto sm:h-40 xl:object-contain xl:p-4"
                                />

                                <button
                                    onClick={() => handleRemoveFromWishlist(item.id)}
                                    className="absolute top-1 right-0 min-[320px]:top-1 min-[350px]:right-2 bg-white p-1 min-[350px]:p-1.5 rounded-full shadow hover:bg-red-50 z-10"
                                >
                                    <FaHeart className="text-red-500 text-xs min-[350px]:text-sm" />
                                </button>
                            </div>

                            <div>
                                <h3 className="font-medium text-sm line-clamp-2 mb-2">
                                    {item.title}
                                </h3>

                                <div className="flex items-center gap-2 mb-4">
                                    <span className="font-semibold">
                                        ₹{item.offerPrice}
                                    </span>

                                    <span className="text-[10px] sm:text-[10px] md:text-[14px] text-gray-500 line-through">
                                        ₹{item.price}
                                    </span>
                                </div>

                                <button
                                    onClick={() => handleAddToCart(item.id)}
                                    className="w-full bg-primary text-white py-2 rounded text-sm font-medium hover:bg-opacity-90 transition"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}

                </div>

            )}

        </div>

    )
}

export default WishlistPage