import React from 'react'
import tahukahKamuImg from '../../assets/tahukah_kamu.png'

const TahukahKamuSection = () => {
    return (
        <div className="w-full py-16 px-6">
            <div className="max-w-5xl mx-auto h-100 bg-pink rounded-3xl p-12 relative overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 h-100">
                    <img 
                        src={tahukahKamuImg} 
                        alt="Tahukah Kamu Decoration" 
                        className="w-full h-full object-cover "
                    />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center mt-14">
                    {/* Title */}
                    <h2 className="text-4xl font-bold text-neutral mb-8 font-ebgaramond text-center">
                        Tahukah Kamu?
                    </h2>

                    {/* Description */}
                    <p className="text-lg text-neutral text-center font-jakarta leading-relaxed max-w-2xl">
                        Saat kamu membaca cerita, otak tidak hanya memahami kata-kata, tetapi juga membayangkan suasana, suara, bahkan emosi dari cerita tersebut. Menaiknya, bagian otak yang aktif saat membaca hampir sama seperti ketika kamu benar-benar mengalami kejadian itu secara langsung.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default TahukahKamuSection
