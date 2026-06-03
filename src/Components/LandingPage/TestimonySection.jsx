import React, { useState, useRef, useEffect } from 'react'
import pic1 from '../.././assets/apaKataPembaca/1.png'
import pic2 from '../.././assets/apaKataPembaca/2.png'
import { AiFillStar } from 'react-icons/ai'

const TestimonySection = () => {
    const [activePage, setActivePage] = useState(0)
    const scrollContainerRef = useRef(null)

    // Data statis testimony
    const testimonials = [
        {
            id: 1,
            name: 'Sarah A.',
            text: 'Chapterly membuat saya lebih mudah menemukan buku favorit. Koleksinya lengkap dan harga sewanya cukup terjangkau.',
            rating: 5
        },
        {
            id: 2,
            name: 'Kael N.',
            text: 'Tampilan website sangat nyaman digunakan. Navigasinya jelas dan proses penyewaan buku sangat mudah.',
            rating: 5
        },
        {
            id: 3,
            name: 'Nadia K.',
            text: 'Banyak pilihan genre yang menarik. Fitur pencarian juga membantu menemukan buku yang sesuai minat saya.',
            rating: 5
        },
        {
            id: 4,
            name: 'Raka B.',
            text: 'Pelayanan customer service sangat responsif. Proses pengembalian buku juga sangat mudah dan cepat.',
            rating: 5
        },
        {
            id: 5,
            name: 'Sarah A.',
            text: 'Chapterly membuat saya lebih mudah menemukan buku favorit. Koleksinya lengkap dan harga sewanya cukup terjangkau.',
            rating: 5
        },
        {
            id: 6,
            name: 'Kael N.',
            text: 'Tampilan website sangat nyaman digunakan. Navigasinya jelas dan proses penyewaan buku sangat mudah.',
            rating: 5
        },
        {
            id: 7,
            name: 'Nadia K.',
            text: 'Banyak pilihan genre yang menarik. Fitur pencarian juga membantu menemukan buku yang sesuai minat saya.',
            rating: 5
        },
        {
            id: 8,
            name: 'Raka B.',
            text: 'Pelayanan customer service sangat responsif. Proses pengembalian buku juga sangat mudah dan cepat.',
            rating: 5
        },
        {
            id: 9,
            name: 'Mira S.',
            text: 'Kualitas buku yang disediakan sangat bagus. Saya sangat puas dengan layanan Chapterly.',
            rating: 5
        }
    ]

    const itemsPerView = 3
    const totalPages = Math.ceil(testimonials.length / itemsPerView)

    // useEffect untuk track scroll dan update active page
    useEffect(() => {
        const handleScroll = () => {
            if (scrollContainerRef.current) {
                const scrollLeft = scrollContainerRef.current.scrollLeft
                const cardWidth = scrollContainerRef.current.offsetWidth / itemsPerView
                const currentPage = Math.round(scrollLeft / (cardWidth * itemsPerView))
                setActivePage(Math.min(currentPage, totalPages - 1))
            }
        }

        const container = scrollContainerRef.current
        if (container) {
            container.addEventListener('scroll', handleScroll)
            return () => container.removeEventListener('scroll', handleScroll)
        }
    }, [itemsPerView, totalPages])

    const handleDotClick = (index) => {
        if (scrollContainerRef.current) {
            const cardWidth = scrollContainerRef.current.offsetWidth / itemsPerView
            scrollContainerRef.current.scrollLeft = index * cardWidth * itemsPerView
        }
    }

    return (
        <div className="w-full">
            {/* Title */}

            {/* Testimonials Container */}
            <div className="flex justify-center items-center gap-6 relative">
                {/* Left Decoration */}
                <div className="absolute -left-10 top-1/2   -translate-y-1/2 opacity-40 pointer-events-none">
                    <img src={pic1} alt="" className="w-64 h-auto" />
                </div>

                {/* Testimonials Scroll Container */}
                <div 
                    ref={scrollContainerRef}
                    className="flex gap-6 overflow-x-auto ml-15 scroll-smooth max-w-4xl flex-1"
                    style={{
                        scrollBehavior: 'smooth',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                    }}
                >
                    {testimonials.map((testimony) => (
                        <div
                            key={testimony.id}
                            className="bg-gray-100 rounded-3xl p-6 flex flex-col justify-between min-h-64 shrink-0"
                            style={{ width: 'calc(100% / 3 - 1rem)' }}
                        >
                            {/* Quote Icon */}
                            <div className="text-4xl text-primary font-bold mb-3">"</div>

                            {/* Testimony Text */}
                            <p className="text-sm text-gray-700 mb-4 flex-1">{testimony.text}</p>

                            {/* Name and Rating */}
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-gray-900">— {testimony.name}</p>
                                <div className="flex gap-1">
                                    {Array.from({ length: testimony.rating }).map((_, i) => (
                                        <AiFillStar key={i} size={14} className="text-primary" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Decoration */}
                <div className="absolute -right-35 rotate-12 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none">
                    <img src={pic2} alt="" className="w-64 h-auto" />
                </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-3 mt-10">
                {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`h-3 rounded-full transition-all ${
                            activePage === index
                                ? 'bg-red-900 w-8'
                                : 'bg-gray-300 w-3'
                        }`}
                    />
                ))}
            </div>
        </div>
    )
}

export default TestimonySection
