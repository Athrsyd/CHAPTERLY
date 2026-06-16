import React, { useState } from 'react'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'
import { motion, AnimatePresence } from 'motion/react'
import cate1 from '../../assets/JelajahiKategori/romance.jpg'
import cate2 from '../../assets/JelajahiKategori/fanfiction.jpg'
import cate3 from '../../assets/JelajahiKategori/fantasy.jpg'
import cate4 from '../../assets/JelajahiKategori/chapterly_original.jpg'
import cate5 from '../../assets/JelajahiKategori/short_story.jpg'
import cate6 from '../../assets/JelajahiKategori/horror.jpg'
import cate7 from '../../assets/JelajahiKategori/humor.jpg'
import cate8 from '../../assets/JelajahiKategori/historical.jpg'
import cate9 from '../../assets/JelajahiKategori/mystery.jpg'
import cate10 from '../../assets/JelajahiKategori/adventure.jpg'
import cate11 from '../../assets/JelajahiKategori/thriller.jpg'
import cate12 from '../../assets/JelajahiKategori/poetry.jpg'
import { useScrollAnimation } from '../../Hooks/useScrollAnimation'

const categories = [
    { id: 1, name: 'Romance', image: cate1, backgroundColor: '#C84C45' },
    { id: 2, name: 'Fanfiction', image: cate2, backgroundColor: '#5B7C99' },
    { id: 3, name: 'Fantasy', image: cate3, backgroundColor: '#8B6B9E' },
    { id: 4, name: 'Chapterly Original', image: cate4, backgroundColor: '#D4956B' },
    { id: 5, name: 'Short Story', image: cate5, backgroundColor: '#8B7D6B' },
    { id: 6, name: 'Horror', image: cate6, backgroundColor: '#4A7C59' },
    { id: 7, name: 'Humor', image: cate7, backgroundColor: '#C84C45' },
    { id: 8, name: 'Historical', image: cate8, backgroundColor: '#5B7C99' },
    { id: 9, name: 'Mystery', image: cate9, backgroundColor: '#8B6B9E' },
    { id: 10, name: 'Adventure', image: cate10, backgroundColor: '#D4956B' },
    { id: 11, name: 'Thriller', image: cate11, backgroundColor: '#8B7D6B' },
    { id: 12, name: 'Poetry', image: cate12, backgroundColor: '#4A7C59' },
]

const CategorySection = () => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [direction, setDirection] = useState(1)
    const { ref, isInView } = useScrollAnimation()

    const itemsPerView = 6
    const visibleCategories = categories.slice(currentIndex, currentIndex + itemsPerView)

    const handlePrev = () => {
        setDirection(-1)
        setCurrentIndex((prev) => (prev === 0 ? Math.max(0, categories.length - itemsPerView) : prev - itemsPerView))
    }

    const handleNext = () => {
        setDirection(1)
        setCurrentIndex((prev) => (prev + itemsPerView >= categories.length ? 0 : prev + itemsPerView))
    }

    const containerVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.07 } },
    }

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
        exit: (dir) => ({ opacity: 0, x: dir * -40, transition: { duration: 0.25 } }),
    }

    return (
        <div ref={ref} className="flex justify-center items-center gap-4 w-full ml-20">
            {/* Left Arrow */}
            <motion.button
                onClick={handlePrev}
                className="shrink-0 w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center bg-white transition"
                whileHover={{ scale: 1.15, borderColor: '#7f1d1d', color: '#7f1d1d' }}
                whileTap={{ scale: 0.9 }}
            >
                <MdChevronLeft size={20} className="text-gray-600" />
            </motion.button>

            {/* Categories Grid */}
            <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                    key={currentIndex}
                    className="grid grid-cols-3 gap-4"
                    custom={direction}
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                >
                    {visibleCategories.map((category, i) => (
                        <motion.div
                            key={category.id}
                            variants={cardVariants}
                            whileHover={{
                                scale: 1.04,
                                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                                y: -4,
                            }}
                            whileTap={{ scale: 0.97 }}
                            className="bg-gray-100 rounded-2xl p-4 flex items-center gap-3 cursor-pointer min-h-24 w-75 transition-shadow"
                        >
                            {/* Image Container */}
                            <motion.div
                                className="w-16 h-16 rounded-full shrink-0 overflow-hidden"
                                style={{ backgroundColor: category.backgroundColor }}
                                whileHover={{ scale: 1.1, rotate: 3 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                {category.image && (
                                    <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                                )}
                            </motion.div>
                            <h3 className="text-base font-semibold text-gray-900">{category.name}</h3>
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>

            {/* Right Arrow */}
            <motion.button
                onClick={handleNext}
                className="shrink-0 w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center bg-white transition"
                whileHover={{ scale: 1.15, borderColor: '#7f1d1d', color: '#7f1d1d' }}
                whileTap={{ scale: 0.9 }}
            >
                <MdChevronRight size={20} className="text-gray-600" />
            </motion.button>
        </div>
    )
}

export default CategorySection
