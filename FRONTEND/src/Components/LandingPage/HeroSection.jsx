import React from 'react'
import { MdMenuBook, MdGroup, MdLibraryBooks } from 'react-icons/md'
import hero from '../../assets/bukuhero.png'


const HeroSection = () => {
    const transition = {
        duration: 0.8,
        delay: 0.5,
        ease: [0, 0.71, 0.2, 1.01],
    }
    return (
        <section className="w-full bg-[#EFEBE9] overflow-hidden z-10 relative">
            <div className="container mx-auto px-6 py-20">
                <div className="grid grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="flex flex-col justify-center ml-16">
                        {/* Heading */}
                        <h1 className="text-4xl font-bold mb-4 leading-tight font-ebgaramond">
                            Every <br />
                            <span className="text-red-900">Chapter</span>
                            <br />
                            Has a Story.
                        </h1>

                        {/* Subtitle */}
                        <p className="text-gray-600 text-lg  mb-8 leading-relaxed font-jakarta">
                            Perpustakaan digital untuk penulis dan pembaca. Temukan, baca, dan bagikan cerita favoritmu di Chapterly.
                        </p>

                        {/* Buttons */}
                        <div className="flex gap-4 mb-12">
                            <a href='#bookPopular' className="bg-red-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-800 transition">
                                Jelajahi Buku
                            </a>
                            <a href='#category' className="border-2 border-red-900 text-red-900 px-8 py-3 rounded-lg font-semibold hover:bg-red-50 transition">
                                Lihat kategori
                            </a>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-8">
                            {/* Stat 1 */}
                            <div className="flex items-center gap-3">
                                <div className=" bg-opacity-10 p-3 rounded-lg">
                                    <MdMenuBook size={38} className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">10K+</p>
                                    <p className="text-sm text-gray-600">Buku tersedia</p>
                                </div>
                            </div>

                            <div className="w-px h-12 bg-gray-300"></div>

                            {/* Stat 2 */}
                            <div className="flex items-center gap-3">
                                <div className=" bg-opacity-10 p-3 rounded-lg">
                                    <MdGroup size={38} className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">5K+</p>
                                    <p className="text-sm text-gray-600">Pengguna aktif</p>
                                </div>
                            </div>

                            <div className="w-px h-12 bg-gray-300"></div>

                            {/* Stat 3 */}
                            <div className="flex items-center gap-3">
                                <div className=" bg-opacity-10 p-3 rounded-lg">
                                    <MdLibraryBooks size={38} className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">1K+</p>
                                    <p className="text-sm text-gray-600">Koleksi</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div
                        className="flex naik-turun justify-center items-center absolute right-20">
                        <img
                            src={hero}
                            alt="Hero Books"
                            className="w-115 drop-shadow-lg"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection
