import React from 'react'
import { FaXTwitter, FaInstagram, FaFacebook } from 'react-icons/fa6'
import logoPutih from '../../assets/logoputih.png'
import { motion } from 'motion/react'
import { useScrollAnimation } from '../../Hooks/useScrollAnimation'

const FooterSection = () => {
    const { ref, isInView } = useScrollAnimation({ margin: '-40px' })

    const socialLinks = [
        { icon: <FaXTwitter size={20} />, href: '#' },
        { icon: <FaInstagram size={20} />, href: '#' },
        { icon: <FaFacebook size={20} />, href: '#' },
    ]

    const menuLinks = ['Beranda', 'Buku', 'Kategori', 'Kata Mereka', 'Tentang Kami']
    const helpLinks = ['FAQ', 'Panduan', 'Syarat & Ketentuan', 'Kebijakan Privasi', 'Hubungi Kami']

    return (
        <footer ref={ref}>
            {/* Wave Decoration */}
            <motion.div
                className="relative h-24 w-full bg-linear-to-br from-pink to-pink bg-opacity-50"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6 }}
            >
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
            </motion.div>

            {/* Footer Content */}
            <div className="bg-primary text-white px-6 -mt-1 py-16">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-4 gap-12 mb-12">
                        {/* Column 1: Logo & Description */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <motion.div
                                className="flex items-center gap-2 mb-4"
                                whileHover={{ scale: 1.04 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                                    <img src={logoPutih} alt="" />
                                </div>
                                <span className="text-xl font-bold font-ebgaramond tracking-jauh">CHAPTERLY</span>
                            </motion.div>
                            <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                                Platform penyewaan buku digital yang memungkinkan pengalaman membaca yang terbaik.
                            </p>
                            <div className="flex gap-4">
                                {socialLinks.map((s, i) => (
                                    <motion.a
                                        key={i}
                                        href={s.href}
                                        className="text-white transition"
                                        whileHover={{ scale: 1.25, color: '#d1d5db', y: -3 }}
                                        whileTap={{ scale: 0.9 }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                                    >
                                        {s.icon}
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>

                        {/* Column 2: Menu */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h4 className="font-semibold mb-6 text-base">Menu</h4>
                            <ul className="space-y-3">
                                {menuLinks.map((link, i) => (
                                    <motion.li
                                        key={link}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                                        transition={{ duration: 0.4, delay: 0.25 + i * 0.07 }}
                                    >
                                        <motion.a
                                            href="#"
                                            className="text-gray-300 text-sm transition"
                                            whileHover={{ color: '#ffffff', x: 4 }}
                                        >
                                            {link}
                                        </motion.a>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Column 3: Bantuan */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <h4 className="font-semibold mb-6 text-base">Bantuan</h4>
                            <ul className="space-y-3">
                                {helpLinks.map((link, i) => (
                                    <motion.li
                                        key={link}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                                        transition={{ duration: 0.4, delay: 0.35 + i * 0.07 }}
                                    >
                                        <motion.a
                                            href="#"
                                            className="text-gray-300 text-sm transition"
                                            whileHover={{ color: '#ffffff', x: 4 }}
                                        >
                                            {link}
                                        </motion.a>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Column 4: Kontak */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <h4 className="font-semibold mb-6 text-base">Kontak</h4>
                            <div className="space-y-4 text-sm">
                                <motion.div whileHover={{ x: 3 }}>
                                    <p className="text-gray-400 mb-1">Email</p>
                                    <p className="font-semibold">hello@chapterly.id</p>
                                </motion.div>
                                <motion.div whileHover={{ x: 3 }}>
                                    <p className="text-gray-400 mb-1">Telepon</p>
                                    <p className="font-semibold">+62 869 998 101</p>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Divider */}
                    <motion.div
                        className="border-t border-opacity-20 border-white pt-8 text-center"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.6, delay: 0.55 }}
                    >
                        <p className="text-xs text-gray-300">
                            © 2026 Chapterly. All rights reserved.
                        </p>
                    </motion.div>
                </div>
            </div>
        </footer>
    )
}

export default FooterSection
