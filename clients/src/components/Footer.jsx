
import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
    const [activeModal, setActiveModal] = useState(null)

    const modalContent = {
        terms: {
            title: 'Terms and Conditions',
            content: (
                <>
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
                        <strong>Customer Cooperation:</strong> Please follow
                        our return policy and provide the required proof when
                        reporting damaged or defective products.
                    </p>

                    <p className="font-medium text-[#9e2543]">
                        Thank you for your understanding and cooperation.
                    </p>
                </>
            ),
        },

        privacy: {
            title: 'Privacy Policy',
            content: (
                <>
                    <p className="mb-3">
                        Your privacy is important to Zovaonyx. We use your
                        information to process orders, arrange deliveries,
                        and provide customer support.
                    </p>

                    <h3 className="mb-2 font-semibold">Information We Collect</h3>
                    <ul className="mb-3 list-disc space-y-1 pl-5">
                        <li>Name and contact details</li>
                        <li>Delivery address</li>
                        <li>Order and purchase details</li>
                    </ul>

                    <h3 className="mb-2 font-semibold">How We Use Your Information</h3>
                    <p className="mb-3">
                        Your information may be used to manage orders,
                        coordinate delivery, and respond to your queries.
                        We aim to handle your information responsibly.
                    </p>

                    <h3 className="mb-2 font-semibold">Contact Us</h3>
                    <p>
                        For privacy-related questions, email us at
                        {' '}
                        <a
                            href="mailto:zovaonyx@gmail.com"
                            className="text-[#9e2543] underline"
                        >
                            zovaonyx@gmail.com
                        </a>.
                    </p>
                </>
            ),
        },

        faqs: {
            title: 'Frequently Asked Questions',
            content: (
                <>
                    <h3 className="mb-1 font-semibold">1. How can I place an order?</h3>
                    <p className="mb-4">
                        Browse our products, select your preferred item and
                        size, add it to your cart, and proceed to checkout.
                        You can also use the available WhatsApp ordering option.
                    </p>

                    <h3 className="mb-1 font-semibold">2. Can I pay by Cash on Delivery?</h3>
                    <p className="mb-4">
                        Cash on Delivery is available when offered as a payment
                        option at checkout.
                    </p>

                    <h3 className="mb-1 font-semibold">3. How can I get help with my order?</h3>
                    <p className="mb-4">
                        Contact our customer service team with your order
                        details so we can assist you.
                    </p>

                    <h3 className="mb-1 font-semibold">4. Can I return a damaged product?</h3>
                    <p className="mb-4">
                        Please refer to our Terms and Conditions and provide
                        a clear, uninterrupted unboxing video when reporting
                        damage or defects.
                    </p>

                    <h3 className="mb-1 font-semibold">5. How do I choose my size?</h3>
                    <p>
                        Check the size options available on the product page.
                        Contact customer service if you need further assistance.
                    </p>
                </>
            ),
        },

        service: {
            title: 'Customer Service',
            content: (
                <>
                    <p className="mb-4">
                        Need help with a product, order, or delivery?
                        Contact us using the details below.
                    </p>

                    <h3 className="mb-1 font-semibold">Email</h3>
                    <p className="mb-4">
                        <a
                            href="mailto:zovaonyx@gmail.com"
                            className="text-[#9e2543] underline"
                        >
                            zovaonyx@gmail.com
                        </a>
                    </p>

                    <h3 className="mb-1 font-semibold">Phone</h3>
                    <p className="mb-4">
                        <a
                            href="tel:+919037243300"
                            className="text-[#9e2543] underline"
                        >
                            +91 9037243300
                        </a>
                    </p>

                    <h3 className="mb-1 font-semibold">WhatsApp</h3>
                    <p>
                        <a
                            href="https://wa.me/919037243300"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#9e2543] underline"
                        >
                            Contact us on WhatsApp
                        </a>
                    </p>
                </>
            ),
        },
    }

    const closeModal = () => setActiveModal(null)

    return (
        <footer className="w-full bg-[#E8D8C3]">

            <div className="grid grid-cols-1 gap-8 px-6 py-10 lg:flex lg:justify-around">

                <div>
                    <h3 className="font-rethink text-3xl font-bold text-[#000000]">
                        Zovaonyx
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">

                    <div>
                        <ul className="space-y-1">
                            <li className="font-bold text-[#9e2543]">Pages</li>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/products">Products</Link></li>
                            <li><Link to="/gifting">Gifting</Link></li>
                            <li><Link to="/about">About</Link></li>
                            <li>
                                <Link to="/profile">Profile</Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <ul className="space-y-2">
                            <li className="font-bold text-[#9e2543]">
                                Quick Links
                            </li>

                            <li
                                onClick={() => setActiveModal('terms')}
                                className="cursor-pointer hover:text-[#9e2543]"
                            >
                                Terms and Conditions
                            </li>

                            <li
                                onClick={() => setActiveModal('privacy')}
                                className="cursor-pointer hover:text-[#9e2543]"
                            >
                                Privacy Policy
                            </li>

                            <li
                                onClick={() => setActiveModal('faqs')}
                                className="cursor-pointer hover:text-[#9e2543]"
                            >
                                FAQs
                            </li>

                            <li
                                onClick={() => setActiveModal('service')}
                                className="cursor-pointer hover:text-[#9e2543]"
                            >
                                Customer Service
                            </li>
                        </ul>
                    </div>

                    <div>
                        <ul className="space-y-1">
                            <li>
                                <a href="mailto:zovaonyx@gmail.com">
                                    Zovaonyx@gmail.com
                                </a>
                            </li>
                            <li>
                                <a href="tel:+919037243300">
                                    +91 9037243300
                                </a>
                            </li>
                            <li className="font-bold text-[#9e2543]">
                                Social Media
                            </li>

                            <li className="flex justify-start gap-2">
                                <a
                                    href="https://www.instagram.com/zovaonyx?xtok=dTVmdW10ajJwdWV3"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Visit Zovaonyx on Instagram"
                                >
                                    <img
                                        src={assets.instagramIcon}
                                        alt="Instagram"
                                        className="h-5 w-5"
                                    />
                                </a>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>

            <div className="flex flex-col justify-between gap-3 border-t border-black px-6 py-4 text-sm sm:flex-row sm:items-center">
                <ul className="flex flex-wrap gap-2">
                    <li>Web Accessibility |</li>
                    <li>Terms of Use |</li>
                    <li>Privacy Statement |</li>
                    <li>
                        <a href="mailto:zovaonyx@gmail.com">Contact Us</a>
                    </li>
                </ul>

                <p>
                    © 2026 Zovaonyx. All rights reserved.
                </p>
            </div>

            {/* Reusable Popup Modal */}
            {activeModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3"
                    onClick={closeModal}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="footer-modal-title"
                        className="flex max-h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Fixed Header */}
                        <div className="flex shrink-0 items-center justify-between border-b p-4">
                            <h2
                                id="footer-modal-title"
                                className="text-lg font-bold text-[#9e2543]"
                            >
                                {modalContent[activeModal].title}
                            </h2>

                            <button
                                type="button"
                                onClick={closeModal}
                                className="ml-2 shrink-0 cursor-pointer p-2 text-2xl text-gray-500 hover:text-black"
                                aria-label="Close popup"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 text-sm leading-6 text-gray-700">
                            {modalContent[activeModal].content}
                        </div>

                        {/* Fixed Footer */}
                        <div className="shrink-0 border-t p-3">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="w-full rounded-lg bg-[#9e2543] px-4 py-2.5 font-semibold text-white transition hover:bg-[#7e1d35]"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </footer>
    )
}

export default Footer
