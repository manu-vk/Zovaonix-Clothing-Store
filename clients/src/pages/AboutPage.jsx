
import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const AboutPage = () => {
    return (
        <>
            <title>About Us | Zovaonyx</title>

            <main className="px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 lg:px-12 xl:px-20">
                <div className="mx-auto max-w-7xl">

                    {/* Page Heading */}
                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-2xl font-semibold text-[#800020] sm:text-3xl md:text-4xl lg:text-5xl">
                            About Zovaonyx
                        </h1>

                        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-medium text-gray-500 sm:text-sm">
                            <Link to="/" className="transition hover:text-[#800020]">
                                Home
                            </Link>
                            <span>{'>'}</span>
                            <span className="text-[#800020]">About Us</span>
                        </div>
                    </div>

                    {/* About Section */}
                    <section className="grid grid-cols-1 items-center gap-8 sm:gap-10 md:gap-12 lg:grid-cols-2 lg:gap-14">

                        {/* About Content */}
                        <div className="order-2 space-y-4 text-sm leading-7 text-gray-600 sm:space-y-5 sm:text-base sm:leading-8 lg:order-1">

                            <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl md:text-3xl">
                                Fashion That Reflects You
                            </h2>

                            <p>
                                Welcome to Zovaonyx, your destination for modern
                                fashion and timeless style. We believe clothing is
                                more than just what you wear — it is a way to express
                                your personality, confidence, and individuality.
                            </p>

                            <p>
                                Our collection brings together trendy designs,
                                versatile everyday essentials, and stylish pieces
                                for every occasion. Whether you are dressing up for
                                a special event or keeping it casual, Zovaonyx helps
                                you find styles that feel uniquely yours.
                            </p>

                            <p>
                                We value style, comfort, and quality. Our goal is
                                to make discovering your next favourite outfit an
                                enjoyable experience, with fashion choices that fit
                                your lifestyle and help you feel confident every day.
                            </p>

                            <p>
                                At Zovaonyx, we believe great style should feel
                                effortless. Explore our collection, discover new
                                favourites, and make every outfit a reflection of you.
                            </p>

                            {/* Shop Button */}
                            <div className="pt-2">
                                <Link
                                    to="/products"
                                    className="inline-flex items-center justify-center rounded-md bg-[#800020] px-6 py-3 text-sm font-medium text-white transition duration-300 hover:bg-[#600018] sm:px-8 sm:text-base"
                                >
                                    Explore Our Collection
                                    <span className="ml-2" aria-hidden="true">
                                        →
                                    </span>
                                </Link>
                            </div>
                        </div>

                        {/* Responsive Images */}
                        <div className="order-1 grid grid-cols-2 gap-3 sm:gap-5 lg:order-2 lg:gap-6">

                            <div className="overflow-hidden rounded-tl-[40px] rounded-br-[40px] sm:rounded-tl-[60px] sm:rounded-br-[60px]">
                                <img
                                    src={assets.titleimage}
                                    alt="Discover stylish clothing at Zovaonyx"
                                    className="h-44 w-full object-cover transition duration-500 hover:scale-105 sm:h-64 md:h-72 lg:h-80 xl:h-96"
                                />
                            </div>

                            <div className="mt-6 overflow-hidden rounded-tr-[40px] rounded-bl-[40px] sm:mt-10 sm:rounded-tr-[60px] sm:rounded-bl-[60px]">
                                <img
                                    src={assets.clothingBanner1}
                                    alt="Explore the Zovaonyx fashion collection"
                                    className="h-44 w-full object-cover transition duration-500 hover:scale-105 sm:h-64 md:h-72 lg:h-80 xl:h-96"
                                />
                            </div>

                        </div>
                    </section>

                    {/* Brand Values */}
                    <section className="mt-12 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5 lg:mt-20 lg:grid-cols-3">

                        <div className="rounded-xl bg-gray-50 p-5 sm:p-6 md:p-8">
                            <h3 className="mb-2 text-lg font-semibold text-[#800020] sm:text-xl">
                                Timeless Style
                            </h3>
                            <p className="text-sm leading-7 text-gray-600 sm:text-base">
                                Discover fashionable pieces that complement your
                                personality and keep your wardrobe fresh.
                            </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-5 sm:p-6 md:p-8">
                            <h3 className="mb-2 text-lg font-semibold text-[#800020] sm:text-xl">
                                Comfort & Quality
                            </h3>
                            <p className="text-sm leading-7 text-gray-600 sm:text-base">
                                Find styles designed to bring together everyday
                                comfort and a great look.
                            </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-5 sm:p-6 md:p-8 sm:col-span-2 lg:col-span-1">
                            <h3 className="mb-2 text-lg font-semibold text-[#800020] sm:text-xl">
                                Your Unique Style
                            </h3>
                            <p className="text-sm leading-7 text-gray-600 sm:text-base">
                                Express yourself with clothing that helps you feel
                                confident, comfortable, and authentically you.
                            </p>
                        </div>

                    </section>

                </div>
            </main>
        </>
    )
}

export default AboutPage
