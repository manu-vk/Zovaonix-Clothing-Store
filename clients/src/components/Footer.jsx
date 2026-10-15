import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import { useState } from "react";


const Footer = () => {
    const [showTerms, setShowTerms] = useState(false);
    return (
        <footer className="bg-[#E8D8C3]  w-full">

            <div className="px-6 py-10 grid grid-cols-1 lg:flex lg:justify-around gap-8">

                <div>
                    <h3 className="text- #c54968 font-rethink font-bold text-3xl">Zovaonyx</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <ul className="space-y-1">
                            <li className="font-bold text-#9e2543">Pages</li>
                            <li><Link to='/'>Home</Link></li>
                            <li><Link to='/products'>Products</Link></li>
                            <li><Link to='/gifting'>Gifting</Link></li>
                            <li><Link to='/about'>About</Link></li>
                            <li>Profile</li>
                        </ul>
                    </div>


                    <div>
                        <ul className="space-y-2">
                            <li className="font-bold ">
                                Quick Links
                            </li>

                            <li
                                onClick={() => setShowTerms(true)}
                                className="cursor-pointer hover:text-[#9e2543]"
                            >
                                Terms and Conditions
                            </li>

                            <li className="cursor-pointer hover:text-[#9e2543]">
                                Privacy Policy
                            </li>

                            <li className="cursor-pointer hover:text-[#9e2543]">
                                FAQs
                            </li>

                            <li className="cursor-pointer hover:text-[#9e2543]">
                                Customer Service
                            </li>
                        </ul>
                    </div>
                    {showTerms && (

                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 animate-fade-in"
                            onClick={() => setShowTerms(false)}
                        >
                            <div
                                className="relative flex w-full max-w-lg flex-col
                                        max-h-[80vh] overflow-hidden
                                        rounded-xl bg-white shadow-xl animate-popup-in"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Fixed heading */}
                                <div className="flex shrink-0 items-center justify-between border-b p-4">
                                    <h2 className="text-lg font-bold text-[#9e2543]">
                                        Terms and Conditions
                                    </h2>

                                    <button
                                        type="button"
                                        onClick={() => setShowTerms(false)}
                                        className="ml-2 shrink-0 cursor-pointer p-2 text-2xl text-gray-500 hover:text-black"
                                        aria-label="Close"
                                    >
                                        &times;
                                    </button>
                                </div>

                                {/* Scrollable content */}
                                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 text-sm leading-6 text-gray-700">
                                    <p className="mb-3">
                                        <strong>Return Policy:</strong> Products damaged due
                                        to customer use or improper handling after delivery
                                        are not eligible for return.
                                    </p>

                                    <p className="mb-3">
                                        <strong>Unboxing Video:</strong> If you notice any
                                        damage or defect while opening your package, please
                                        provide a clear, uninterrupted unboxing video as proof
                                        to help us verify the issue.
                                    </p>

                                    <p className="mb-3">
                                        <strong>Customer Cooperation:</strong> We kindly
                                        request your cooperation in following our return
                                        policy and providing the required proof when reporting
                                        damaged or defective products.
                                    </p>

                                    <p className="font-medium text-[#9e2543]">
                                        Thank you for your understanding and cooperation.
                                    </p>
                                </div>

                                {/* Fixed bottom button */}
                                <div className="shrink-0 border-t p-3">
                                    <div className="shrink-0 border-t p-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowTerms(false)}
                                            className="w-full rounded-lg bg-[#9e2543] px-4 py-2.5 font-semibold text-white hover:bg-[#7e1d35]"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}


                    <div>
                        <ul className="space-y-1">
                            <li>zovaonyx1@gmail.com</li>
                            <li>+91 9876543210</li>
                            <li className="font-bold text-#9e2543">Social Media</li>
                            <div className='flex justify-start gap-1'>
                                <img src={assets.instagramIcon} alt="" className='w-5 h-5' />
                                {/* <img src={assets.facebookIcon} alt="" className='w-5 h-5'  />
                                <img src={assets.twitterIcon} alt="" className='w-5 h-5'  />
                                <img src={assets.youtubeIcon} alt="" className='w-5 h-5'  />
                                <img src={assets.linkedinIcon} alt="" className='w-5 h-5'  /> */}
                            </div>
                        </ul>
                    </div>
                </div>

            </div>

            <div className="flex justify-around border-t border-black px-6 py-4 text-sm mb-8">
                <ul className="flex flex-wrap gap-2">
                    <li>Web Accessibility |</li>
                    <li>Terms of Use |</li>
                    <li>Privacy Statement |</li>
                    <li>Contact Us</li>
                </ul>

                <p className="mt-2">
                    © 2026 fragranzia Company. All rights reserved.
                </p>
            </div>

        </footer>
    )
}

export default Footer
