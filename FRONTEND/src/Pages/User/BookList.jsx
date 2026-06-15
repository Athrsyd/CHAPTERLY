import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import UserLayout from '../../Components/User/UserLayout'
import api from '../../services/api'

function IconSearch() { return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"/></svg> }
function IconStar() { return <svg xmlns="http://www.w3.org/2000/svg" width="0.9em" height="0.9em" viewBox="0 0 24 24"><path fill="#d97706" d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08z"/></svg> }
function IconBell() { return <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24"><path fill="currentColor" d="M4 19v-2h2v-7q0-2.075 1.25-3.687T10.5 4.2v-.7q0-.625.438-1.062T12 2t1.063.438T13.5 3.5v.7q2 .5 3.25 2.113T18 10v7h2v2zm8 3q-.825 0-1.412-.587T10 20h4q0 .825-.587 1.413T12 22"/></svg> }

const GENRES = ['Semua', 'Romance', 'Fantasy', 'Mystery', 'Adventure', 'Thriller', 'Fiction', 'Horror', 'Historical', 'Humor', 'Poetry']

const genreColors = {
    Romance: 'bg-pink-100 text-pink-700',
    Fantasy: 'bg-purple-100 text-purple-700',
    Mystery: 'bg-blue-100 text-blue-700',
    Adventure: 'bg-green-100 text-green-700',
    Thriller: 'bg-red-100 text-red-700',
    Fiction: 'bg-indigo-100 text-indigo-700',
    Horror: 'bg-gray-200 text-gray-700',
    Historical: 'bg-yellow-100 text-yellow-700',
    Humor: 'bg-orange-100 text-orange-700',
    Poetry: 'bg-teal-100 text-teal-700',
}

function GenreBadge({ genre }) {
    const cls = genreColors[genre] || 'bg-gray-100 text-gray-600'
    return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cls}`}>{genre}</span>
}

function BookCard({ book, onClick }) {
    return (
        <div
            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
            onClick={() => onClick(book)}
        >
            <div className="w-full aspect-[3/4] overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
                {book.cover ? (
                    <img src={book.cover} alt={book.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center p-4">
                        <p className="text-primary/30 text-xs text-center font-ebgaramond font-semibold">{book.name}</p>
                    </div>
                )}
            </div>
            <div className="p-3">
                <h3 className="text-sm font-bold text-neutral truncate leading-tight mb-0.5">{book.name}</h3>
                <p className="text-xs text-gray-400 truncate mb-2">{book.users?.name || '—'}</p>
                <div className="flex items-center justify-between">
                    <GenreBadge genre={book.genre} />
                    {book.rate > 0 && (
                        <div className="flex items-center gap-0.5">
                            <IconStar />
                            <span className="text-xs text-gray-500">{book.rate}</span>
                        </div>
                    )}
                </div>
                <p className="text-primary font-bold text-sm mt-2">Rp {book.price?.toLocaleString('id-ID')} <span className="text-gray-400 font-normal text-xs">/ 7 Hari</span></p>
            </div>
        </div>
    )
}

const BookList = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const initialSearch = searchParams.get('search') || ''

    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState(initialSearch)
    const [selectedGenre, setSelectedGenre] = useState('Semua')

    useEffect(() => {
        fetchBooks()
    }, [selectedGenre])

    const fetchBooks = async () => {
        setLoading(true)
        try {
            const params = {}
            if (selectedGenre !== 'Semua') params.genre = selectedGenre
            const res = await api.get('/books', { params })
            setBooks(res.data.data || [])
        } catch {
            setBooks([])
        } finally {
            setLoading(false)
        }
    }

    const filtered = books.filter(b => {
        const q = search.toLowerCase()
        return !q || b.name?.toLowerCase().includes(q) || b.users?.name?.toLowerCase().includes(q) || b.genre?.toLowerCase().includes(q)
    })

    return (
        <UserLayout>
            {/* Header */}
            <header className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-neutral font-ebgaramond">Daftar Buku</h1>
                    <p className="text-gray-500 text-sm mt-0.5">Temukan buku favoritmu dan mulai menyewa sekarang.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 w-64 shadow-sm">
                        <span className="text-gray-400"><IconSearch /></span>
                        <input
                            type="text"
                            placeholder="Cari buku, penulis..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="bg-transparent outline-none text-sm text-gray-600 placeholder-gray-400 w-full"
                        />
                    </div>
                    <button className="text-gray-500 hover:text-primary transition-colors"><IconBell /></button>
                </div>
            </header>

            {/* Genre Filter */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {GENRES.map(g => (
                    <button
                        key={g}
                        onClick={() => setSelectedGenre(g)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            selectedGenre === g
                                ? 'bg-primary text-white'
                                : 'bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                        }`}
                    >
                        {g}
                    </button>
                ))}
            </div>

            {/* Books Grid */}
            {loading ? (
                <div className="grid grid-cols-5 gap-5">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                            <div className="w-full aspect-[3/4] bg-gray-100 animate-pulse" />
                            <div className="p-3 flex flex-col gap-2">
                                <div className="h-3 w-3/4 bg-gray-100 rounded animate-pulse" />
                                <div className="h-2.5 w-1/2 bg-gray-100 rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24"><path fill="currentColor" d="M6 22q-.825 0-1.412-.587T4 20V4q0-.825.588-1.412T6 2h12q.825 0 1.413.588T20 4v16q0 .825-.587 1.413T18 22zm0-2h12V4h-2v7l-2.5-1.5L11 11V4H6zm0 0V4zm5-9l2.5-1.5L16 11l-2.5-1.5z"/></svg>
                    <p className="mt-3 text-base font-medium">Buku tidak ditemukan</p>
                    <p className="text-sm mt-1">Coba kata kunci atau genre yang berbeda</p>
                </div>
            ) : (
                <>
                    <p className="text-sm text-gray-400 mb-4">Menampilkan {filtered.length} buku</p>
                    <div className="grid grid-cols-5 gap-5">
                        {filtered.map(book => (
                            <BookCard key={book.id} book={book} onClick={b => navigate(`/books/${b.id}`)} />
                        ))}
                    </div>
                </>
            )}
        </UserLayout>
    )
}

export default BookList