import React from 'react'
import { motion } from 'motion/react'
import tahukahKamuImg from '../../assets/tahukah_kamu.png'
import { useScrollAnimation } from '../../Hooks/useScrollAnimation'

const TahukahKamuSection = () => {
    const { ref, isInView } = useScrollAnimation()

    return (
        <div className="w-full py-16 px-6" ref={ref}>
            <motion.div
                className="max-w-5xl mx-auto h-100 bg-pink rounded-3xl p-12 relative overflow-hidden"
                initial={{ opacity: 0, scale: 0.93, y: 40 }}
                animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ boxShadow: '0 24px 60px rgba(127,29,29,0.15)' }}
            >
                {/* Background Image */}
                <div className="absolute inset-0 h-100">
                    <img
                        src={tahukahKamuImg}
                        alt="Tahukah Kamu Decoration"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center mt-14">
                    <motion.h2
                        className="text-4xl font-bold text-neutral mb-8 font-ebgaramond text-center"
                        initial={{ opacity: 0, y: 24 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Tahukah Kamu?
                    </motion.h2>

                    <motion.p
                        className="text-lg text-neutral text-center font-jakarta leading-relaxed max-w-2xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.38 }}
                    >
                        Saat kamu membaca cerita, otak tidak hanya memahami kata-kata, tetapi juga membayangkan suasana, suara, bahkan emosi dari cerita tersebut. Menariknya, bagian otak yang aktif saat membaca hampir sama seperti ketika kamu benar-benar mengalami kejadian itu secara langsung.
                    </motion.p>
                </div>
            </motion.div>
        </div>
    )
}

export default TahukahKamuSection
