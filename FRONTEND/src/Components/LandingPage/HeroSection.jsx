import React from 'react'
import { MdMenuBook, MdGroup, MdLibraryBooks } from 'react-icons/md'
import hero from '../../assets/bukuhero.png'
import { motion } from 'motion/react'

const HeroSection = () => {
    return (
        <section className="w-full bg-[#EFEBE9] overflow-hidden z-10 relative">
            <div className="container mx-auto px-6 py-20">
                <div className="grid grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="flex flex-col justify-center ml-16">
                        {/* Heading */}
                        <motion.h1
                            className="text-4xl font-bold mb-4 leading-tight font-ebgaramond"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                            Every <br />
                            <motion.span
                                className="text-red-900"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                            >
                                Chapter
                            </motion.span>
                            <br />
                            Has a Story.
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            className="text-gray-600 text-lg mb-8 leading-relaxed font-jakarta"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.35, ease: 'easeOut' }}
                        >
                            Perpustakaan digital untuk penulis dan pembaca. Temukan, baca, dan bagikan cerita favoritmu di Chapterly.
                        </motion.p>

                        {/* Buttons */}
                        <motion.div
                            className="flex gap-4 mb-12"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                        >
                            <motion.a
                                href='#bookPopular'
                                className="bg-red-900 text-white px-8 py-3 rounded-lg font-semibold transition"
                                whileHover={{ scale: 1.05, backgroundColor: '#7f1d1d' }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                Jelajahi Buku
                            </motion.a>
                            <motion.a
                                href='#category'
                                className="border-2 border-red-900 text-red-900 px-8 py-3 rounded-lg font-semibold transition"
                                whileHover={{ scale: 1.05, backgroundColor: '#fef2f2' }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                Lihat kategori
                            </motion.a>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            className="flex items-center gap-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.65 }}
                        >
                            {[
                                { icon: <MdMenuBook size={38} className="text-primary" />, value: '10K+', label: 'Buku tersedia' },
                                { icon: <MdGroup size={38} className="text-primary" />, value: '5K+', label: 'Pengguna aktif' },
                                { icon: <MdLibraryBooks size={38} className="text-primary" />, value: '1K+', label: 'Koleksi' },
                            ].map((stat, i) => (
                                <React.Fragment key={i}>
                                    <motion.div
                                        className="flex items-center gap-3"
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.7 + i * 0.12 }}
                                        whileHover={{ scale: 1.07 }}
                                    >
                                        <div className="bg-opacity-10 p-3 rounded-lg">{stat.icon}</div>
                                        <div>
                                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                            <p className="text-sm text-gray-600">{stat.label}</p>
                                        </div>
                                    </motion.div>
                                    {i < 2 && <div className="w-px h-12 bg-gray-300" />}
                                </React.Fragment>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right Image */}
                    <motion.div
                        className="flex naik-turun justify-center items-center absolute right-20"
                        initial={{ opacity: 0, x: 80, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                        <motion.img
                            src={hero}
                            alt="Hero Books"
                            className="w-115 drop-shadow-lg"
                            whileHover={{ scale: 1.04, rotate: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection
