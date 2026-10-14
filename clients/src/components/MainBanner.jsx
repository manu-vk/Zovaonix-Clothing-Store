import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'


const MainBanner = () => {
    const banners = [
        {
            id: 1,
            bgClass: "mainSecbannerImg"
        },
        {
            id: 2,
            bgClass: "mainbannerImg"
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [banners.length]);

    return (
        <div className="relative overflow-hidden rounded-2xl">
            <div
                className="flex h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] transition-transform duration-1000 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {banners.map((banner) => (
                    <div
                        key={banner.id}
                        className={`w-full flex-shrink-0 ${banner.bgClass}`}
                    >
                        <div className="flex flex-col md:flex-row items-center justify-start md:justify-between h-full px-4 sm:px-8 md:px-12">
                            <div className="flex flex-col text-center md:text-left items-center md:items-start pt-8 sm:pt-10 md:pt-0 max-w-full md:max-w-[48%]">
                                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                                    {banner.title}
                                </h2>

                                <p className="text-sm sm:text-base text-white mt-2">
                                    {banner.subtitle}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {banners.map((_, index) => (
                    <button key={index} onClick={() => setCurrentIndex(index)} className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-white w-6' : 'bg-white/50'}`} />
                ))}
            </div>
        </div>
    )
}

export default MainBanner