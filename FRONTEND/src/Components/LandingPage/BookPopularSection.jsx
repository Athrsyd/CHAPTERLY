import React, { useState } from 'react'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'
import { AiFillStar } from 'react-icons/ai'
import book1 from '../../assets/Buku populer/cantik_itu_luka.jpg'
import book2 from '../../assets/Buku populer/dunia_sophie.jpg'
import book3 from '../../assets/Buku populer/laut_bercerita.jpg'
import book4 from '../../assets/Buku populer/laskar_pelangi.jpg'
import book5 from '../../assets/Buku populer/gadis_kretek.jpg'
import book6 from '../../assets/Buku populer/bumi_manusia.jpg'
import book7 from '../../assets/Buku populer/perahu_kertas.jpg'
import book8 from '../../assets/Buku populer/pulang.jpg'
import book9 from '../../assets/Buku populer/namaku_alam.jpg'
import book10 from '../../assets/Buku populer/tanah_para_bandit.jpg'
import book11 from '../../assets/Buku populer/aku_tak_membenci_hujan.jpg'
import book12 from '../../assets/Buku populer/hujan.jpg'

const BookPopularSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0)

    // Data statis buku populer
    const books = [
        {
            id: 1,
            title: 'Cantik Itu Luka',
            author: 'Eka Kurniawan',
            image: book1,
            backgroundColor: '#E8D5C4',
            rating: 4.8,
            price: 'Rp25.000'
        },
        {
            id: 2,
            title: 'Dunia Sophie',
            author: 'Jostein Gaarder',
            image: book2,
            backgroundColor: '#1A1A1A',
            rating: 4.8,
            price: 'Rp25.000'
        },
        {
            id: 3,
            title: 'Laut Bercerita',
            author: 'Leila S. Chudori',
            image: book3,
            backgroundColor: '#B3E5FC',
            rating: 4.8,
            price: 'Rp25.000'
        },
        {
            id: 4,
            title: 'Laskar Pelangi',
            author: 'Andrea Hirata',
            image: book4,
            backgroundColor: '#FF1493',
            rating: 4.8,
            price: 'Rp25.000'
        },
        {
            id: 5,
            title: 'Gadis Kretek',
            author: 'Ratih Kumala',
            image: book5,
            backgroundColor: '#E8D5C4',
            rating: 4.8,
            price: 'Rp25.000'
        },
        {
            id: 6,
            title: 'Bumi Manusia',
            author: 'Pramoedya Ananta Toer',
            image: book6,
            backgroundColor: '#1A1A1A',
            rating: 4.8,
            price: 'Rp25.000'
        },
        {
            id: 7,
            title: 'Perahu Kertas',
            author: 'Dee Lestari',
            image: book7,
            backgroundColor: '#B3E5FC',
            rating: 4.8,
            price: 'Rp25.000'
        },
        {
            id: 8,
            title: 'Pulang',
            author: 'Tere Liye',
            image: book8,
            backgroundColor: '#FF1493',
            rating: 4.8,
            price: 'Rp25.000'
        },
        {
            id: 9,
            title: 'Namaku Alam',
            author: 'Leila S. Chudori',
            image: book9,
            backgroundColor: '#E8D5C4',
            rating: 4.8,
            price: 'Rp25.000'
        },
        {
            id: 10,
            title: 'Tanah Para Bandit',
            author: 'Tere Liye',
            image: book10,
            backgroundColor: '#1A1A1A',
            rating: 4.8,
            price: 'Rp25.000'
        },
        {
            id: 11,
            title: 'Aku Tak Membenci Hujan',
            author: 'Sri Puji Hartini',
            image: book11,
            backgroundColor: '#B3E5FC',
            rating: 4.8,
            price: 'Rp25.000'
        },
        {
            id: 12,
            title: 'Hujan',
            author: 'Tere Liye',
            image: book12,
            backgroundColor: '#FF1493',
            rating: 4.8,
            price: 'Rp25.000'
        },
    ]

    const itemsPerView = 5
    const visibleBooks = books.slice(currentIndex, currentIndex + itemsPerView)

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? books.length - itemsPerView : prev - 1))
    }

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1 > books.length - itemsPerView ? 0 : prev + 1))
    }

    return (
        <div className="flex justify-center items-center gap-4 w-full ml-8">
            {/* Left Arrow */}
            <button
                onClick={handlePrev}
                className="shrink-0 w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center bg-white hover:bg-gray-100 transition"
            >
                <MdChevronLeft size={20} className="text-gray-600" />
            </button>

            {/* Books Grid */}
            <div className="grid grid-cols-5 gap-8">
                {visibleBooks.map((book) => (
                    <div
                        key={book.id}
                        className="cursor-pointer transition group min-w-42"
                    >
                        {/* Book Cover */}
                        <div
                            className="w-full h-72 rounded-2xl overflow-hidden mb-3 flex items-center justify-center transition-transform duration-300 ease-out transform group-hover:-translate-y-2"
                            style={{
                                backgroundColor: book.backgroundColor
                            }}
                        >
                            {book.image && (
                                <img
                                    src={book.image}
                                    alt={book.title}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>

                        {/* Book Info */}
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">{book.title}</h3>
                        <p className="text-xs text-gray-600 mb-2">{book.author}</p>

                        {/* Rating and Price */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                                <AiFillStar size={16} className="text-red-900" />
                                <span className="text-xs font-semibold text-gray-900">{book.rating}</span>
                            </div>
                            <button className="bg-primary text-white px-3 py-1 rounded text-xs font-semibold hover:opacity-90 transition">
                                {book.price}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Right Arrow */}
            <button
                onClick={handleNext}
                className="mr-4 shrink-0 w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center bg-white hover:bg-gray-100 transition"
            >
                <MdChevronRight size={20} className="text-gray-600" />
            </button>
        </div>
    )
}

export default BookPopularSection
