import React, { useState } from 'react'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'
import cate1 from '../../assets/Jelajahikategori/romance.jpg'
import cate2 from '../../assets/Jelajahikategori/fanfiction.jpg'
import cate3 from '../../assets/Jelajahikategori/fantasy.jpg'
import cate4 from '../../assets/Jelajahikategori/chapterly_original.jpg'
import cate5 from '../../assets/Jelajahikategori/short_story.jpg'
import cate6 from '../../assets/Jelajahikategori/horror.jpg'
import cate7 from '../../assets/Jelajahikategori/humor.jpg'
import cate8 from '../../assets/Jelajahikategori/historical.jpg'
import cate9 from '../../assets/Jelajahikategori/mystery.jpg'
import cate10 from '../../assets/Jelajahikategori/adventure.jpg'
import cate11 from '../../assets/Jelajahikategori/thriller.jpg'
import cate12 from '../../assets/Jelajahikategori/poetry.jpg'

const CategorySection = () => {
    const [currentIndex, setCurrentIndex] = useState(0)

    // Data statis kategori
    const categories = [
        {
            id: 1,
            name: 'Romance',
            image: cate1,
            backgroundColor: '#C84C45'
        },
        {
            id: 2,
            name: 'Fanfiction',
            image: cate2,
            backgroundColor: '#5B7C99'
        },
        {
            id: 3,
            name: 'Fantasy',
            image: cate3,
            backgroundColor: '#8B6B9E'
        },
        {
            id: 4,
            name: 'Chapterly Original',
            image: cate4,
            backgroundColor: '#D4956B'
        },
        {
            id: 5,
            name: 'Short Story',
            image: cate5,
            backgroundColor: '#8B7D6B'
        },
        {
            id: 6,
            name: 'Horror',
            image: cate6,
            backgroundColor: '#4A7C59'
        },
        {
            id: 7,
            name: 'Humor',
            image: cate7,
            backgroundColor: '#C84C45'
        },
        {
            id: 8,
            name: 'Historical',
            image: cate8,
            backgroundColor: '#5B7C99'
        },
        {
            id: 9,
            name: 'Mystery',
            image: cate9,
            backgroundColor: '#8B6B9E'
        },
        {
            id: 10,
            name: 'Adventure',
            image: cate10,
            backgroundColor: '#D4956B'
        },
        {
            id: 11,
            name: 'Thriller',
            image: cate11,
            backgroundColor: '#8B7D6B'
        },
        {
            id: 12,
            name: 'Poetry',
            image: cate12,
            backgroundColor: '#4A7C59'
        }
    ]

    const itemsPerView = 6 // 2 baris x 3 kolom
    const visibleCategories = categories.slice(currentIndex, currentIndex + itemsPerView)

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? Math.max(0, categories.length - itemsPerView) : prev - itemsPerView))
    }

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + itemsPerView >= categories.length ? 0 : prev + itemsPerView))
    }

    return (
        <div className="flex justify-center items-center gap-4 w-full ml-20">
            {/* Left Arrow */}
            <button
                onClick={handlePrev}
                className="shrink-0 w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center bg-white hover:bg-gray-100 transition"
            >
                <MdChevronLeft size={20} className="text-gray-600" />
            </button>

            {/* Categories Grid - 2 Baris */}
            <div className="grid grid-cols-3 gap-4">
                {visibleCategories.map((category) => (
                    <div
                        key={category.id}
                        className="bg-gray-100 rounded-2xl p-4 flex items-center gap-3 hover:shadow-md transition cursor-pointer min-h-24 w-75"
                    >
                        {/* Image/Icon Container */}
                        <div
                            className="w-16 h-16 rounded-full shrink-0 overflow-hidden"
                            style={{
                                backgroundColor: category.backgroundColor
                            }}
                        >
                            {category.image && (
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>

                        {/* Text */}
                        <h3 className="text-base font-semibold text-gray-900">{category.name}</h3>
                    </div>
                ))}
            </div>

            {/* Right Arrow */}
            <button
                onClick={handleNext}
                className="shrink-0 w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center bg-white hover:bg-gray-100 transition"
            >
                <MdChevronRight size={20} className="text-gray-600" />
            </button>
        </div>
    )
}

export default CategorySection
