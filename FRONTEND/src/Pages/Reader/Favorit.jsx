import React from 'react'
import ReaderSidebar from '../../Components/shared/ReaderSidebar'

export default function ReaderFavorit() {
    return (
        <div className="flex w-full min-h-screen bg-gray-50 font-jakarta">
            <ReaderSidebar />
            <main className="flex-1 ml-64 px-8 py-7">
                <h1 className="text-2xl font-bold text-neutral font-ebgaramond mb-2">Buku Favorit</h1>
                <p className="text-gray-500 text-sm mb-8">Koleksi buku favoritmu</p>
                <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                    <p className="text-5xl mb-4">❤️</p>
                    <p className="text-neutral font-semibold">Belum ada buku favorit</p>
                    <p className="text-gray-400 text-sm mt-1">Tekan tombol "Tambah Favorit" di halaman detail buku</p>
                </div>
            </main>
        </div>
    )
}
