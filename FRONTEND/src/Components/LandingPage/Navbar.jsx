import React from 'react'
import { CiSearch } from 'react-icons/ci'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'

const Navbar = () => {
    const token = localStorage.getItem('access_token')

    const navLinks = [
        { href: '#home', label: 'Beranda' },
        { href: '#category', label: 'Kategori' },
        { href: '#bookPopular', label: 'Buku' },
        { href: '#faq', label: 'Kata Mereka' },
    ]

    return (
        <motion.nav
            className='w-full z-9999 fixed bg-white border-b rounded-b-4xl shadow-lg border-gray-200'
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
            <div className='max-w-7xl mx-auto px-16 py-4'>
                <div className='flex items-center justify-between'>
                    {/* Logo */}
                    <motion.a
                        href=""
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                        <div className='flex items-center gap-2'>
                            <img src="/LogoFix.svg" alt="" className='w-16 h-16' />
                            <span className='text-2xl font-bold font-ebgaramond tracking-jauh text-primary'>CHAPTERLY</span>
                        </div>
                    </motion.a>

                    {/* Navigation Menu */}
                    <div className='flex items-center gap-8 font-jakarta font-semibold'>
                        {navLinks.map((link, i) => (
                            <motion.a
                                key={link.href}
                                href={link.href}
                                className='nav-link text-black font-medium text-sm relative'
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                                whileHover={{ color: 'var(--color-primary)', y: -2 }}
                            >
                                {link.label}
                            </motion.a>
                        ))}
                    </div>

                    {/* Right Section */}
                    <motion.div
                        className='flex items-center gap-6'
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.45 }}
                    >
                        <motion.button
                            className='text-gray-600 cursor-pointer hover:text-gray-800 transition'
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <CiSearch size={24} />
                        </motion.button>

                        {token ? (
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                                <Link to='/dashboard' className='px-4 py-2 bg-primary cursor-pointer text-white rounded hover:opacity-90 transition font-medium text-sm'>
                                    Dashboard
                                </Link>
                            </motion.div>
                        ) : (
                            <>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                                    <Link to='/login' className='px-4 py-2 border-2 cursor-pointer border-primary text-primary rounded hover:bg-primary/10 ease-in-out transition font-medium text-sm'>
                                        Masuk
                                    </Link>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                                    <Link to='/register' className='px-4 py-2 bg-primary cursor-pointer text-white rounded hover:opacity-90 transition font-medium text-sm'>
                                        Daftar
                                    </Link>
                                </motion.div>
                            </>
                        )}
                    </motion.div>
                </div>
            </div>
        </motion.nav>
    )
}

export default Navbar
