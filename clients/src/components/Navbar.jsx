import React, { useContext, useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import toast from 'react-hot-toast';

import { ShoppingBag } from "lucide-react";
const Navbar = () => {

    const { navigate, user, setUser, admin, setAdmin, setShowUserLogin, searchQuery, setSearchQuery, getCartCount, getWishlistCount } = useContext(AppContext);
    const [open, setOpen] = useState(false)
    const [profile, setProfile] = useState(false)
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        setAdmin(null);
        navigate('/');
    }

    return (
        <nav className="z-50 flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">

            {/* Brand: centered on mobile, normal position on desktop */}
           <NavLink
    to="/"
    className="absolute left-1/2 -translate-x-1/2 sm:static sm:translate-x-0"
>
    <div className="flex flex-col items-center justify-center leading-none">
        <h3
            className="text-black font-normal text-2xl sm:text-3xl whitespace-nowrap"
            style={{ fontFamily: '"Didot", "Bodoni MT", "Times New Roman", serif' }}
        >
            ZOVAONYX
        </h3>

        <span className="mt-1 text-[8px] sm:text-[9px] font-medium tracking-[0.35em] text-black"
        style={{ fontFamily: '"Didot", "Bodoni MT", "Times New Roman", serif' }}>
            FASHION
        </span>
    </div>
</NavLink>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">
                <Link to='/'>Home</Link>
                <Link to='/products'>Products</Link>
                {/* <Link to='/gifting'>Gifting</Link> */}
                <Link to='/about'>About</Link>

                <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full shadow-[0_0_0_1px_#2424243c]">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.836 10.615 15 14.695" stroke="#7A7B7D" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                        <path clip-rule="evenodd" d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783" stroke="#7A7B7D" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <input onChange={(e) => setSearchQuery(e.target.value)} className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" type="text" placeholder="Search Here" />

                </div>

                <div className='flex gap-2'>
                    <div className="relative cursor-pointer">
                        <div className='flex rounded-full shadow-[0_0_3px_#24242453] w-[30px] h-[30px] justify-center items-center'>
                            <Link
                                to={user ? '/cart' : '#'}
                                onClick={(e) => {
                                    if (!user) {
                                        e.preventDefault();
                                        toast.error('Please login to continue');
                                        setTimeout(() => navigate('/login'), 1000);
                                    }
                                }}
                            >
                                <img src={assets.cartIcon} alt="" className='w-4.5 h-4.5' />
                            </Link>
                        </div>
                        {getCartCount() > 0 && (
                            <span className="absolute -top-2 -right-1 text-[10px] text-white bg-[#00354B] w-[16px] h-[16px] flex items-center justify-center rounded-full">
                                {getCartCount()}
                            </span>
                        )}
                    </div>
                    {/* <div className='flex rounded-full shadow-[0_0_3px_#24242453] w-[30px] h-[30px] justify-center items-center cursor-pointer'>
                        <Link to='/wishlist'>
                            <img src={assets.wishFalseIcon} alt="" className='w-5 h-5' />
                        </Link>
                    </div> */}
                    <div className="relative cursor-pointer">

                        <div className='flex rounded-full shadow-[0_0_3px_#24242453] w-[30px] h-[30px] justify-center items-center'>

                            <Link
                                to={user ? '/wishlist' : '#'}
                                onClick={(e) => {
                                    if (!user) {
                                        e.preventDefault();
                                        toast.error('Please login to continue');
                                        setTimeout(() => navigate('/login'), 1000);
                                    }
                                }}
                            >
                                <img
                                    src={assets.wishFalseIcon}
                                    alt=""
                                    className='w-5 h-5'
                                />
                            </Link>

                        </div>

                        {getWishlistCount() > 0 && (

                            <span className="absolute -top-2 -right-1 text-[10px] text-white bg-[#00354B] w-[16px] h-[16px] flex items-center justify-center rounded-full">

                                {getWishlistCount()}

                            </span>

                        )}

                    </div>

                    <div className="relative">

                        <Link
                            to={user ? '/profile' : '#'}
                            onClick={(e) => {
                                if (!user) {
                                    e.preventDefault();
                                    toast.error('Please login to continue');
                                    setTimeout(() => navigate('/login'), 1000);
                                }
                            }}
                            className="flex w-[30px] h-[30px] items-center justify-center rounded-full shadow-[0_0_3px_#24242453] cursor-pointer"
                        >
                            <img src={assets.profileIcon} className="w-5 h-5" />
                        </Link>
                        {profile && (
                            <div onClick={() => setProfile(!profile)} className="flex w-[30px] h-[30px] items-center justify-center rounded-full shadow-[0_0_3px_#24242453] cursor-pointer">
                                <img src={assets.profileIcon} className="w-5 h-5" />
                            </div>
                        )}

                    </div>


                    {user?.isAdmin && (

                        <div className='flex rounded-full shadow-[0_0_3px_#24242453] w-[30px] h-[30px] justify-center items-center cursor-pointer'>

                            <Link to='/admin-dashboard'>

                                <img
                                    src={assets.adminIcon}
                                    alt=""
                                    className='w-5 h-5'
                                />

                            </Link>

                        </div>


                    )}
                </div>
                {!user && (
                    <button
                        onClick={() => navigate("/login")}
                        className="px-5 py-2 bg-[#00354B] text-white rounded-full hover:opacity-90 rounded-full"
                    >
                        Login
                    </button>
                )}
            </div>

            {/* <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className="sm:hidden">

                <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="21" height="1.5" rx=".75" fill="#426287" />
                    <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
                    <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#426287" />
                </svg>
            </button> */}

            {/* Mobile Search + Menu Toggle */}
            {/* Mobile Menu Toggle + Search */}
            <div className="flex w-full items-center justify-between sm:hidden">
                {/* Menu: left */}
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    aria-label="Toggle menu"
                    className="flex items-center justify-center"
                >
                    <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="black"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                    >
                        <path d="M4 6h16" />
                        <path d="M4 12h16" />
                        <path d="M4 18h16" />
                    </svg>
                </button>

                {/* Search: right */}
                <button
                    type="button"
                    onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                    aria-label="Toggle search"
                    className="flex items-center justify-center"
                >
                    <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="black"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="11" cy="11" r="7" />
                        <path d="m20 20-4-4" />
                    </svg>
                </button>
            </div>


            {/* Mobile Menu */}
            {open && (
                <div className={`${open ? 'flex' : 'hidden'} absolute top-[57px] left-0 w-full bg-white shadow-md py-5 flex-col items-start gap-2 px-5 text-sm md:hidden`}>
                    <Link to='/' className='block'>Home</Link>
                    <Link to='/products' className='block'>Products</Link>
                    {/* {user &&
                        <Link to='/cart' className='block'>Cart</Link>
                    } */}
                    {/* <Link to='/gifting' className='block'>Gifting</Link> */}
                    <Link to='/about' className='block'>About</Link>
                    {/* <Link to='/profile'>Profile</Link> */}

                    {!user ? (
                        <button onClick={() => { setOpen(false); setShowUserLogin(true); }} className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm">
                            Login
                        </button>
                    ) : (


                        <button
                            onClick={() => {
                                logout();
                                setOpen(false);
                            }}
                            className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
                        >
                            Logout
                        </button>
                    )}


                </div>
            )}
            {/* --------------------------------------------------- */}
            {/* Mobile Bottom Navigation */}
            <div className="sm:hidden fixed bottom-0 left-0 w-full z-[100] bg-[#000000]  border-t border-[#800020]/20 shadow-[0_-3px_12px_rgba(0,0,0,0.08)]  rounded-t-xl">
                <div className="flex items-center justify-around py-3">

                    <Link to="/" className="flex items-center justify-center">
                        <img src={assets.homeIcon} alt="Home" className="w-5 h-5 brightness-0 invert" />
                    </Link>

                    <Link
                        to="/products"
                        className="flex items-center justify-center"
                    >
                        <ShoppingBag
                            className="w-5 h-5 text-white"
                            strokeWidth={2}
                        />
                    </Link>



                    <Link
                        to={user ? "/cart" : "#"}
                        onClick={(e) => {
                            if (!user) {
                                e.preventDefault()
                                toast.error("Please login to continue")
                                setTimeout(() => navigate("/login"), 1000)
                            }
                        }}
                        className="relative flex items-center justify-center"
                    >
                        <img src={assets.cartIcon} alt="Cart" className="w-5 h-5 brightness-0 invert" />
                        {getCartCount() > 0 && (
                            <span className="absolute -top-2 -right-2 bg-[#800020] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                                {getCartCount()}
                            </span>
                        )}
                    </Link>

                    <Link
                        to={user ? "/wishlist" : "#"}
                        onClick={(e) => {
                            if (!user) {
                                e.preventDefault()
                                toast.error("Please login to continue")
                                setTimeout(() => navigate("/login"), 1000)
                            }
                        }}
                        className="relative flex items-center justify-center"
                    >
                        <img src={assets.wishFalseIcon} alt="Wishlist" className="w-5 h-5 brightness-0 invert" />
                        {getWishlistCount() > 0 && (
                            <span className="absolute -top-2 -right-2 bg-[#800020] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                                {getWishlistCount()}
                            </span>
                        )}
                    </Link>

                    <Link
                        to={user ? "/profile" : "#"}
                        onClick={(e) => {
                            if (!user) {
                                e.preventDefault()
                                toast.error("Please login to continue")
                                setTimeout(() => navigate("/login"), 1000)
                            }
                        }}
                        className="flex items-center justify-center"
                    >
                        <img src={assets.profileIcon} alt="Profile" className="w-5 h-5 brightness-0 invert" />
                    </Link>

                </div>
            </div>

            {/* Mobile Search Input */}
            {mobileSearchOpen && (
                <div className="absolute left-0 top-full z-50 w-full border-b border-gray-200 bg-white px-4 py-3 shadow-md sm:hidden">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            setMobileSearchOpen(false);
                            navigate("/products");
                        }}
                        className="flex items-center gap-2 rounded-full border border-gray-300 px-3"
                    >
                        <input
                            type="text"
                            value={typeof searchQuery === "string" ? searchQuery : ""}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search products..."
                            autoFocus
                            className="w-full bg-transparent py-2 text-sm outline-none"
                        />

                        <button
                            type="submit"
                            aria-label="Search products"
                            className="text-sm font-medium text-[#800020]"
                        >
                            Search
                        </button>
                    </form>
                </div>
            )}


        </nav>
    )
}

export default Navbar
