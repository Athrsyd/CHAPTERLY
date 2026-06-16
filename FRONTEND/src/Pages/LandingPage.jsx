import React, { useState, useEffect, useRef } from 'react'
import Navbar from '../Components/LandingPage/Navbar'
import HeroSection from '../Components/LandingPage/HeroSection'
import CategorySection from '../Components/LandingPage/CategorySection'
import BookPopularSection from '../Components/LandingPage/BookPopularSection'
import TestimonySection from '../Components/LandingPage/TestimonySection'
import TahukahKamuSection from '../Components/LandingPage/TahukahKamuSection'
import FAQSection from '../Components/LandingPage/FAQSection'
import FooterSection from '../Components/LandingPage/FooterSection'
import logo from '../assets/logomerah.png'

// ── Huruf-huruf judul dengan animasi staggered ───────────────
const TITLE = 'Chapterly'

const Preloader = ({ onDone }) => {
    const [phase, setPhase] = useState('enter')  // enter → idle → exit → curtain
    const [progress, setProgress] = useState(0)
    const [lettersDone, setLettersDone] = useState(false)
    const timerRef = useRef()

    // Hitung progress palsu yang smooth
    useEffect(() => {
        let p = 0
        const tick = () => {
            const step = p < 60 ? 1.8 : p < 85 ? 0.9 : p < 95 ? 0.3 : 0.1
            p = Math.min(100, p + step)
            setProgress(Math.round(p))
            if (p < 100) timerRef.current = requestAnimationFrame(tick)
        }
        timerRef.current = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(timerRef.current)
    }, [])

    // Letters selesai muncul
    useEffect(() => {
        const t = setTimeout(() => setLettersDone(true), 300 + TITLE.length * 80 + 400)
        return () => clearTimeout(t)
    }, [])

    // Keluar setelah 2.8 detik
    useEffect(() => {
        const t1 = setTimeout(() => setPhase('exit'), 2800)
        const t2 = setTimeout(() => setPhase('curtain'), 3200)
        const t3 = setTimeout(() => onDone(), 3850)
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
    }, [])

    return (
        <div className="fixed inset-0 z-99999 overflow-hidden">

            {/* Layer utama — konten preloader */}
            <div
                className={`absolute inset-0 flex flex-col items-center justify-center gap-0 bg-red-100/50 backdrop-blur-xl
                    ${phase === 'exit' || phase === 'curtain' ? 'preloader-exit' : ''}`}
                
            >
                {/* Partikel dekorasi latar */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                        <div key={i}
                            className="absolute rounded-full opacity-10"
                            style={{
                                width:  [180, 120, 80, 200, 60, 140][i],
                                height: [180, 120, 80, 200, 60, 140][i],
                                backgroundColor: ['#D97706','#8B1E1E','#F3E8E8','#D97706','#F3E8E8','#8B1E1E'][i],
                                top:  ['10%','70%','20%','80%','50%','5%'][i],
                                left: ['5%','10%','80%','75%','45%','60%'][i],
                                filter: 'blur(40px)',
                            }}
                        />
                    ))}
                </div>

                {/* Ring dekorasi di belakang logo */}
                <div className="relative mb-6">
                    {/* Ring luar muter */}
                    <div className="absolute inset-0 -m-6 rounded-full border border-white/10"
                        style={{
                            width: 'calc(100% + 48px)', height: 'calc(100% + 48px)',
                            top: '-24px', left: '-24px',
                            borderTopColor: 'rgba(217,119,6,0.5)',
                            animation: 'preloader-ring-spin 3s linear infinite',
                        }}
                    />
                    {/* Ring tengah counter-rotate */}
                    <div className="absolute inset-0 -m-3 rounded-full border border-white/5"
                        style={{
                            width: 'calc(100% + 24px)', height: 'calc(100% + 24px)',
                            top: '-12px', left: '-12px',
                            borderBottomColor: 'rgba(139,30,30,0.8)',
                            animation: 'preloader-ring-spin 2s linear infinite reverse',
                        }}
                    />

                    {/* Logo */}
                    <div className="preloader-logo relative z-10">
                        <div className="w-36 h-36 rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden"
                            style={{
                                background: 'linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
                                border: '1px solid rgba(255,255,255,0.15)',
                                backdropFilter: 'blur(12px)',
                            }}>
                            <img src={logo} alt="Chapterly" className="w-24 h-24 object-contain drop-shadow-lg" />

                            {/* Shimmer overlay */}
                            <div className="absolute inset-0 preloader-shimmer rounded-2xl" />
                        </div>
                    </div>
                </div>

                {/* Judul dengan huruf staggered */}
                <div className="flex items-end gap-0 mb-2" aria-label="Chapterly">
                    {TITLE.split('').map((char, i) => (
                        <span
                            key={i}
                            className="inline-block font-ebgaramond italic"
                            style={{
                                fontSize: 52,
                                fontWeight: 700,
                                color: 'white',
                                textShadow: '0 2px 20px rgba(139,30,30,0.5)',
                                opacity: 0,
                                transform: 'translateY(24px)',
                                animation: `preloader-letter 0.5s cubic-bezier(.34,1.56,.64,1) ${300 + i * 80}ms forwards`,
                                lineHeight: 1.1,
                            }}
                        >
                            {char}
                        </span>
                    ))}
                </div>

                {/* Tagline */}
                <p className="preloader-tagline text-primary text-md font-medium font-jakarta uppercase"
                    style={{ letterSpacing: '0.25em' }}>
                    Perpustakaan Digital Masa Kini
                </p>

                {/* Progress bar */}
                <div className="mt-10 flex flex-col items-center gap-2 w-52">
                    <div className="w-full h-0.5 rounded-full overflow-hidden"
                        style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                        <div
                            className="preloader-bar h-full rounded-full"
                            style={{
                                background: 'linear-gradient(90deg, #D97706, #F59E0B)',
                                boxShadow: '0 0 8px rgba(217,119,6,0.6)',
                            }}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-white/30 text-[10px] font-jakarta tabular-nums">{progress}%</span>
                        {/* Loading dots */}
                        <div className="flex items-center gap-1">
                            {[1,2,3].map(n => (
                                <div key={n}
                                    className={`w-1 h-1 rounded-full bg-white/40 preloader-dot-${n}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Curtain — tirai menutup ke atas saat exit */}
            {phase === 'curtain' && (
                <div
                    className="absolute inset-0 preloader-curtain bg-red-100/50 backdrop-blur-xl"
                />
            )}
        </div>
    )
}

// ── CSS untuk @keyframes yang belum ada di Tailwind ──────────
const preloaderStyles = `
@keyframes preloader-ring-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@keyframes preloader-letter {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
`

const LandingPage = () => {
    const [loading, setLoading] = useState(true)

    return (
        <>
            <style>{preloaderStyles}</style>

            {loading && <Preloader onDone={() => setLoading(false)} />}

            <div className='w-full'>
                <Navbar />
                <section className='pt-8 w-screen' id='home'>
                    <HeroSection />
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                        <path fill="#EFEBE9" fillOpacity="1" d="M0,128L40,112C80,96,160,64,240,48C320,32,400,32,480,48C560,64,640,96,720,90.7C800,85,880,43,960,58.7C1040,75,1120,149,1200,154.7C1280,160,1360,96,1400,64L1440,32L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z" />
                    </svg>
                </section>

                <section className="w-full flex flex-col -mt-25" id='category'>
                    <div className="text-4xl font-bold mb-6 font-ebgaramond ml-24">Jelajahi Kategori</div>
                    <div className="flex w-full justify-center">
                        <CategorySection />
                    </div>
                </section>

                <section className="w-full flex flex-col my-8" id='bookPopular'>
                    <div className="text-4xl font-bold mb-6 font-ebgaramond ml-24">Buku Populer</div>
                    <div className="flex w-full justify-center">
                        <BookPopularSection />
                    </div>
                </section>

                <section className="w-full flex flex-col">
                    <TahukahKamuSection />
                </section>

                <section id='testimony' className="w-full flex flex-col px-6 pl-10 py-12">
                    <h2 className="text-4xl font-bold mb-6 font-ebgaramond text-center">Apa Kata Pembaca?</h2>
                    <TestimonySection />
                </section>

                <section id='faq' className="w-full flex flex-col px-6 py-12">
                    <FAQSection />
                </section>

                <section className="">
                    <FooterSection />
                </section>
            </div>
        </>
    )
}

export default LandingPage
