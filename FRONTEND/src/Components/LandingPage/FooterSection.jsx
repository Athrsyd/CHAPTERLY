import React from 'react'
import { FaXTwitter, FaInstagram, FaFacebook } from 'react-icons/fa6'
import logoPutih from '../../assets/logoputih.png'

const FooterSection = () => {
    return (
        <footer>
            
            {/* Wave Decoration */}
            <div className="relative h-24 bg-linear-to-br from-pink to-pink bg-opacity-50">
                <svg
                    className="absolute bottom-0 left-0 w-full h-full"
                    viewBox="0 0 1440 120"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M0,60 Q360,0 720,60 T1440,60 L1440,120 L0,120 Z"
                        fill="rgb(var(--color-primary))"
                        style={{ fill: 'var(--color-primary)' }}
                    />
                </svg>
            </div>

            {/* Footer Content */}
            <div className="bg-primary text-white px-6 -mt-1 py-16">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-4 gap-12 mb-12">
                        {/* Column 1: Logo & Description */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8  rounded-full flex items-center justify-center">
                                    <img src={logoPutih} alt="" srcset="" />
                                </div>
                                <span className="text-xl font-bold font-ebgaramond tracking-jauh">CHAPTERLY</span>
                            </div>
                            <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                                Platform penyewaan buku digital yang memungkinkan pengalaman membaca yang terbaik.
                            </p>

                            {/* Social Icons */}
                            <div className="flex gap-4">
                                <a href="#" className="text-white hover:text-gray-300 transition">
                                    <FaXTwitter size={20} />
                                </a>
                                <a href="#" className="text-white hover:text-gray-300 transition">
                                    <FaInstagram size={20} />
                                </a>
                                <a href="#" className="text-white hover:text-gray-300 transition">
                                    <FaFacebook size={20} />
                                </a>
                            </div>
                        </div>

                        {/* Column 2: Menu */}
                        <div>
                            <h4 className="font-semibold mb-6 text-base">Menu</h4>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-300 hover:text-white transition text-sm">Beranda</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition text-sm">Buku</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition text-sm">Kategori</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition text-sm">Kata Mereka</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition text-sm">Tentang Kami</a></li>
                            </ul>
                        </div>

                        {/* Column 3: Bantuan */}
                        <div>
                            <h4 className="font-semibold mb-6 text-base">Bantuan</h4>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-300 hover:text-white transition text-sm">FAQ</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition text-sm">Panduan</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition text-sm">Syarat & Ketentuan</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition text-sm">Kebijakan Privasi</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition text-sm">Hubungi Kami</a></li>
                            </ul>
                        </div>

                        {/* Column 4: Kontak */}
                        <div>
                            <h4 className="font-semibold mb-6 text-base">Kontak</h4>
                            <div className="space-y-4 text-sm">
                                <div>
                                    <p className="text-gray-400 mb-1">Email</p>
                                    <p className="font-semibold">hello@chapterly.id</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 mb-1">Telepon</p>
                                    <p className="font-semibold">+62 869 998 101</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-opacity-20 border-white pt-8 text-center">
                        <p className="text-xs text-gray-300">
                            © 2026 Chapterly. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default FooterSection
