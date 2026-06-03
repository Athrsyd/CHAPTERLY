import React, { useState } from 'react'
import { MdAdd, MdRemove } from 'react-icons/md'

const FAQSection = () => {
    const [expandedId, setExpandedId] = useState(1) // Default expand item pertama

    // Data statis FAQ
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

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id)
    }

    return (
        <div className="w-full max-w-3xl mx-auto">
            {/* Title */}
            <h2 className="text-4xl font-bold text-center mb-12">Pertanyaan Yang Sering Diajukan</h2>

            {/* FAQ Items */}
            <div className="space-y-0">
                {faqData.map((item) => (
                    <div key={item.id}>
                        {/* FAQ Item */}
                        <button
                            onClick={() => toggleExpand(item.id)}
                            className="w-full py-6 flex items-center justify-between cursor-pointer transition text-left"
                        >
                            {/* Question */}
                            <h3 className="text-lg font-semibold text-gray-900">{item.question}</h3>

                            {/* Icon */}
                            <div className="shrink-0 ml-4">
                                {expandedId === item.id ? (
                                    <MdRemove size={24} className="text-primary" />
                                ) : (
                                    <MdAdd size={24} className="text-gray-400" />
                                )}
                            </div>
                        </button>

                        {/* Answer */}
                        <div className={`faq-answer ${expandedId === item.id ? 'expanded' : ''}`}>
                            <div className="pb-6 pr-8">
                                <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gray-200" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FAQSection
