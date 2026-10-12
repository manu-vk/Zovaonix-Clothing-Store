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
            <div className="flex h-[400px] md:h-[350px] transition-transform duration-1000 ease-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {banners.map((banner) => (
                    <div key={banner.id} className={`w-full flex-shrink-0 ${banner.bgClass}`}>
                        <div className="flex flex-col md:flex-row items-center justify-around h-full">
                            <div className="flex flex-col text-center md:text-left items-center md:items-start pt-14 md:p-10">
                                <h2 className="md:text-4xl text-2xl font-bold text-white">{banner.title}</h2>
                                <p className="text-white mt-2">{banner.subtitle}</p>
                                {/* <div className="mt-6"><Link to="/products"><button className="bg-white text-black hover:bg-white/70 px-7 py-2.5 rounded-md">Shop Now</button></Link></div> */}
                            </div>
                            <div className="relative flex justify-center items-center mt-6 md:mt-0">
                                {/* <img src={banner.image} alt="spray" className="w-[220px] md:w-[320px] -rotate-[12deg]" />
                                <img src={banner.image} alt="spray" className="absolute w-[180px] md:w-[250px] rotate-[18deg] z-10 top-14 left-4/5 -translate-x-1/2" /> */}
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