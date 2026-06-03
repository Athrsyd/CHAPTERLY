import React from 'react'
import { CiSearch } from 'react-icons/ci'

const Navbar = () => {
    return (
        <nav className='w-full  z-9999 fixed bg-white border-b rounded-b-4xl shadow-lg border-gray-200'>
            <div className='max-w-7xl mx-auto px-5 py-4'>
                <div className='flex items-center justify-between'>
                    {/* Logo */}
                    <div className='flex items-center gap-2'>
                        {/* <div className='w-8 h-8 bg-primary rounded-full flex items-center justify-center'> */}
                            <img src="/LogoFix.svg" alt="" srcset="" className='w-16 h-16'/>
                        {/* </div> */}
                        <span className='text-2xl font-bold font-ebgaramond tracking-jauh text-primary'>CHAPTERLY</span>
                    </div>

                    {/* Navigation Menu */}
                    <div className='flex items-center gap-8 font-jakarta font-semibold'>
                        <a href='#' className='nav-link text-black transition-all ease-in-out duration-300 hover:text-primary font-medium text-sm'>
                            Beranda
                        </a>
                        <a href='#' className='nav-link text-black transition-all ease-in-out duration-300 hover:text-primary font-medium text-sm'>
                            Buku
                        </a>
                        <a href='#' className='nav-link text-black transition-all ease-in-out duration-300 hover:text-primary font-medium text-sm'>
                            Kategori
                        </a>
                        <a href='#' className='nav-link text-black transition-all ease-in-out duration-300 hover:text-primary font-medium text-sm'>
                            Kata Mereka
                        </a>
                        <a href='#' className='nav-link text-black transition-all ease-in-out duration-300 hover:text-primary font-medium text-sm'>
                            Tentang Kami
                        </a>
                    </div>

                    {/* Right Section */}
                    <div className='flex items-center gap-6'>
                        {/* Search Icon */}
                        <button className='text-gray-600 cursor-pointer hover:text-gray-800 transition'>
                            <CiSearch size={24} />
                        </button>

                        {/* Login Button */}
                        <button className='px-4 py-2 border-2 cursor-pointer border-primary text-primary rounded hover:bg-opacity-10 hover:bg-primary transition font-medium text-sm'>
                            Masuk
                        </button>

                        {/* Register Button */}
                        <button className='px-4 py-2 bg-primary cursor-pointer text-white rounded hover:opacity-90 transition font-medium text-sm'>
                            Daftar
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar