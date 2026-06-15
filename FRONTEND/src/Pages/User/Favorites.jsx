import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UserLayout from '../../Components/User/UserLayout'

// Favorites uses local storage since the backend doesn't have a favorites endpoint
const Favorites = () => {
    const navigate = useNavigate()
    const [favorites] = useState([])

    return (
        <UserLayout>
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-neutral font-ebgaramond">Buku Favorit</h1>
                <p className="text-gray-500 text-sm mt-0.5">Koleksi buku yang kamu simpan sebagai favorit.</p>
            </header>

            {favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24"><path fill="currentColor" d="m12 21l-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812T2.388 10.4T2 8.15Q2 5.8 3.575 4.225T7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55t2.475-.55q2.35 0 3.925 1.575T22 8.15q0 1.15-.388 2.25t-1.362 2.412t-2.625 2.963T13.45 19.7zm0-2.7q2.4-2.15 3.95-3.688t2.45-2.674t1.25-2.076T19.85 8.2q0-1.5-.975-2.475T16.6 4.75q-1 0-1.875.45t-1.575 1.35l-1.15 1.6l-1.15-1.6q-.675-.9-1.575-1.35T7.4 4.75q-1.45 0-2.425.975T4 8.2q0 .875.3 1.762t1.25 2.076t2.45 2.662T12 18.3z"/></svg>
                    <p className="mt-3 text-base font-medium">Belum ada buku favorit</p>
                    <p className="text-sm mt-1">Tambahkan buku ke favorit dari halaman detail buku</p>
                    <button onClick={() => navigate('/books')} className="mt-4 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
                        Jelajahi Buku
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-5 gap-5">
                    {favorites.map(book => (
                        <div key={book.id} className="cursor-pointer group" onClick={() => navigate(`/books/${book.id}`)}>
                            <div className="w-full aspect-[2/3] rounded-xl overflow-hidden bg-gray-100 mb-2 group-hover:shadow-md transition-shadow">
                                {book.cover
                                    ? <img src={book.cover} alt={book.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    : <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10" />
                                }
                            </div>
                            <h3 className="text-sm font-bold text-neutral truncate">{book.name}</h3>
                            <p className="text-xs text-gray-400 truncate">{book.users?.name}</p>
                        </div>
                    ))}
                </div>
            )}
        </UserLayout>
    )
}

export default Favorites