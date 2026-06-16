import React, { useState } from 'react'
import { MdAdd, MdRemove } from 'react-icons/md'
import { motion, AnimatePresence } from 'motion/react'
import { useScrollAnimation } from '../../Hooks/useScrollAnimation'

const faqData = [
    {
        id: 1,
        question: 'Apa itu Chapterly?',
        answer: 'Chapterly adalah platform penyewaan buku digital yang memungkinkan pengguna menemukan, menyewa, dan menikmati berbagai koleksi buku secara online. Dengan beragam kategori yang tersedia, Chapterly hadir untuk memberikan pengalaman membaca yang praktis, nyaman, dan mudah diakses kapan saja.'
    },
    {
        id: 2,
        question: 'Bagaimana cara menyewa buku di Chapterly?',
        answer: 'Untuk menyewa buku di Chapterly, pertama-tama Anda perlu membuat akun dan login. Kemudian, cari buku yang ingin Anda sewa melalui fitur pencarian atau kategori. Pilih durasi sewa, selesaikan pembayaran, dan buku akan langsung dapat diakses di perpustakaan digital Anda.'
    },
    {
        id: 3,
        question: 'Apakah saya harus membuat akun?',
        answer: 'Ya, Anda perlu membuat akun untuk menggunakan layanan Chapterly. Pembuatan akun sangat mudah dan gratis. Anda hanya perlu menyediakan email dan membuat password. Dengan akun, Anda dapat menyimpan koleksi buku favorit dan melacak riwayat penyewaan.'
    },
    {
        id: 4,
        question: 'Kategori buku apa saja yang tersedia?',
        answer: 'Chapterly menyediakan berbagai kategori buku termasuk Romance, Fanfiction, Fantasy, Horror, Short Story, dan Chapterly Original. Setiap kategori memiliki koleksi buku yang terus diperbarui untuk memastikan Anda selalu memiliki pilihan baru yang menarik.'
    },
    {
        id: 5,
        question: 'Apakah buku dapat dibaca kapan saja?',
        answer: 'Ya, setelah Anda menyewa buku, Anda dapat membacanya kapan saja selama masa sewa berlaku. Anda dapat membaca melalui aplikasi atau website Chapterly. Tidak ada batasan jumlah kali membaca selama periode sewa Anda.'
    }
]

const FAQSection = () => {
    const [expandedId, setExpandedId] = useState(1)
    const { ref, isInView } = useScrollAnimation()

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id)
    }

    return (
        <div className="w-full max-w-3xl mx-auto" ref={ref}>
            {/* Title */}
            <motion.h2
                className="text-4xl font-bold text-center mb-12"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
            >
                Pertanyaan Yang Sering Diajukan
            </motion.h2>

            {/* FAQ Items */}
            <div className="space-y-0">
                {faqData.map((item, i) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                    >
                        {/* FAQ Button */}
                        <motion.button
                            onClick={() => toggleExpand(item.id)}
                            className="w-full py-6 flex items-center justify-between cursor-pointer transition text-left"
                            whileHover={{ x: 4 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                            <h3 className={`text-lg font-semibold transition-colors duration-200 ${expandedId === item.id ? 'text-red-900' : 'text-gray-900'}`}>
                                {item.question}
                            </h3>
                            <motion.div
                                className="shrink-0 ml-4"
                                animate={{ rotate: expandedId === item.id ? 45 : 0 }}
                                transition={{ duration: 0.25, type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                {expandedId === item.id
                                    ? <MdRemove size={24} className="text-primary" />
                                    : <MdAdd size={24} className="text-gray-400" />
                                }
                            </motion.div>
                        </motion.button>

                        {/* Answer with AnimatePresence */}
                        <AnimatePresence initial={false}>
                            {expandedId === item.id && (
                                <motion.div
                                    key="answer"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                                    style={{ overflow: 'hidden' }}
                                >
                                    <motion.div
                                        className="pb-6 pr-8"
                                        initial={{ y: -10 }}
                                        animate={{ y: 0 }}
                                        exit={{ y: -10 }}
                                        transition={{ duration: 0.25 }}
                                    >
                                        <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Divider */}
                        <div className="h-px bg-gray-200" />
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default FAQSection
