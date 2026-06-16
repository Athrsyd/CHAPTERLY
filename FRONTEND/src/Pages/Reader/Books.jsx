import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReaderSidebar from '../../Components/shared/ReaderSidebar'
import api from '../../services/api'

const StarRating = ({ rate }) => (
    <div className="flex items-center gap-0.5">
        {[1,2,3,4,5].map(i => (
            <svg key={i} xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24">
                <path fill={i <= rate ? '#D97706' : '#E5E7EB'} d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08z"/>
            </svg>
        ))}
    </div>
)

const genres = ['Semua', 'Romance', 'Fantasy', 'Mystery', 'Adventure', 'Thriller', 'Fiction', 'Horror', 'Historical']

export default function ReaderBooks() {
    const navigate = useNavigate()
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [genre, setGenre] = useState('Semua')

    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            try {
                const params = genre !== 'Semua' ? `?genre=${genre}` : ''
                const res = await api.get(`/books${params}`)
                setBooks(res.data.data || [])
            } catch { } finally { setLoading(false) }
        }
        fetch()
    }, [genre])

    const filtered = books.filter(b =>
        b.name?.toLowerCase().includes(search.toLowerCase()) ||
        b.users?.name?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="flex w-full min-h-screen bg-gray-50 font-jakarta">
            <ReaderSidebar />
            <main className="flex-1 ml-64 px-8 py-7">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral font-ebgaramond">Daftar Buku</h1>
                        <p className="text-gray-500 text-sm mt-1">Temukan buku favoritmu dan mulai membaca</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 w-72 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" className="text-gray-400"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"/></svg>
                        <input value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Cari buku, penulis..."
                            className="bg-transparent outline-none text-sm text-gray-600 placeholder-gray-400 w-full" />
                    </div>
                </div>

                {/* Genre Chips */}
                <div className="flex gap-2 mb-6 flex-wrap">
                    {genres.map(g => (
                        <button key={g} onClick={() => setGenre(g)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition cursor-pointer ${genre === g ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'}`}>
                            {g}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="grid grid-cols-5 gap-5">
                        {[...Array(10)].map((_, i) => <div key={i} className="bg-white rounded-xl aspect-3/4 animate-pulse" />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-4xl mb-3">📚</p>
                        <p>Tidak ada buku ditemukan</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-5 gap-5">
                        {filtered.map(book => (
                            <div key={book.id} onClick={() => navigate(`/books/${book.id}`)}
                                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer group hover:shadow-lg transition-all hover:-translate-y-2">
                                <div className="w-full aspect-3/4 bg-gray-100 overflow-hidden">
                                    {book.cover
                                        ? <img src={book.cover} alt={book.name} className="w-full h-full object-cover transition " />
                                        : <div className="w-full h-full bg-primary/8 flex items-center justify-center text-primary/40 text-xs text-center p-3 font-ebgaramond">{book.name}</div>}
                                </div>
                                <div className="p-3">
                                    <span className="text-xs bg-tertiary text-primary px-2 py-0.5 rounded-full">{book.genre || 'Umum'}</span>
                                    <p className="font-semibold text-neutral text-sm mt-1.5 line-clamp-2">{book.name}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{book.users?.name || '-'}</p>
                                    <StarRating rate={book.rate} />
                                    <p className="text-primary font-bold text-sm mt-1.5">Rp {Number(book.price || 0).toLocaleString('id-ID')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
