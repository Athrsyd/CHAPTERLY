import React from 'react'
import Navbar from '../Components/LandingPage/Navbar'
import HeroSection from '../Components/LandingPage/HeroSection'
import CategorySection from '../Components/LandingPage/CategorySection'
import BookPopularSection from '../Components/LandingPage/BookPopularSection'
import TestimonySection from '../Components/LandingPage/TestimonySection'
import TahukahKamuSection from '../Components/LandingPage/TahukahKamuSection'
import FAQSection from '../Components/LandingPage/FAQSection'
import FooterSection from '../Components/LandingPage/FooterSection'

const LandingPage = () => {
    return (
        <div classname='w-full px-6'>
            <Navbar />
            <section className='pt-8'>
                <HeroSection />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#EFEBE9" fill-opacity="1" d="M0,128L40,112C80,96,160,64,240,48C320,32,400,32,480,48C560,64,640,96,720,90.7C800,85,880,43,960,58.7C1040,75,1120,149,1200,154.7C1280,160,1360,96,1400,64L1440,32L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"></path></svg>
            </section>

            <section className="w-full flex flex-col -mt-25">
                <div className="text-4xl font-bold mb-6 font-ebgaramond ml-24">Jelajahi Kategori</div>
                <div className="flex w-full justify-center">
                    <CategorySection />
                </div>
            </section>

            <section className="w-full flex flex-col my-8 ">
                <div className="text-4xl font-bold mb-6 font-ebgaramond ml-24">Buku Populer</div>
                <div className="flex w-full justify-center">
                    <BookPopularSection />
                </div>


            </section>


            <section className="w-full flex flex-col">
                <TahukahKamuSection />
            </section>

            <section className="w-full  flex flex-col px-6 pl-10 py-12 ">
                <h2 className="text-4xl font-bold mb-6 font-ebgaramond text-center">Apa Kata Pembaca?</h2>

                <TestimonySection />
            </section>


            <section className="w-full flex flex-col px-6 py-12">
                <FAQSection />
            </section>

            <section className=''>

                <FooterSection />
            </section>
        </div>
    )
}

export default LandingPage