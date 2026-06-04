import React from 'react'
import { CiSearch } from 'react-icons/ci'
import { Link } from 'react-router-dom'

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
                        <a href='#home' className='nav-link text-black transition-all ease-in-out duration-300 hover:text-primary font-medium text-sm'>
                            Beranda
                        </a>
                        <a href='#category' className='nav-link text-black transition-all ease-in-out duration-300 hover:text-primary font-medium text-sm'>
                            Kategori
                        </a>
                        <a href='#bookPopular' className='nav-link text-black transition-all ease-in-out duration-300 hover:text-primary font-medium text-sm'>
                            Buku
                        </a>
                        <a href='#faq' className='nav-link text-black transition-all ease-in-out duration-300 hover:text-primary font-medium text-sm'>
                            Kata Mereka
                        </a>

                    </div>

                    {/* Right Section */}
                    <div className='flex items-center gap-6'>
                        {/* Search Icon */}
                        <button className='text-gray-600 cursor-pointer hover:text-gray-800 transition'>
                            <CiSearch size={24} />
                        </button>

                        {/* Login Button */}
                        <Link to='/login' className='px-4 py-2 border-2 cursor-pointer border-primary text-primary rounded hover:bg-primary/10 ease-in-out transition font-medium text-sm'>
                            Masuk
                        </Link>

                        {/* Register Button */}
                        <Link to ='/register' className='px-4 py-2 bg-primary cursor-pointer text-white rounded hover:opacity-90 transition font-medium text-sm'>
                            Daftar
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar