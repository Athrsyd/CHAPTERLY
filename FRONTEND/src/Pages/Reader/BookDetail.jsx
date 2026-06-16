import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReaderSidebar from '../../Components/shared/ReaderSidebar'
import ReadBookModal from '../../Components/shared/ReadBookModal'
import { useCart } from '../../Context/CartContext'
import api from '../../services/api'

const Star = ({ filled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
        <path fill={filled ? '#D97706' : '#E5E7EB'} d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08z"/>
    </svg>
)

export default function BookDetail() {
    const { id }       = useParams()
    const navigate     = useNavigate()
    const { addToCart, removeFromCart, isInCart } = useCart()

    const [book, setBook]         = useState(null)
    const [related, setRelated]   = useState([])
    const [loading, setLoading]   = useState(true)
    const [isRented, setIsRented] = useState(false)
    const [cartMsg, setCartMsg]   = useState('')
    const [showRead, setShowRead] = useState(false)

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            try {
                const [bookRes, allRes, rentRes] = await Promise.all([
                    api.get(`/books/${id}`),
                    api.get('/books'),
                    api.get('/rent'),
                ])
                const b = bookRes.data.data
                setBook(b)
                setRelated(allRes.data.data?.filter(x => x.id !== b.id && x.genre === b.genre).slice(0, 7) || [])
                setIsRented(rentRes.data.data?.some(r => r.book_id === Number(id)))
            } catch { } finally { setLoading(false) }
        }
        load()
    }, [id])

    const handleToggleCart = () => {
        if (!book) return
        if (isInCart(book.id)) {
            removeFromCart(book.id)
            setCartMsg('')
        } else {
            addToCart(book)
            setCartMsg('Buku ditambahkan ke keranjang!')
            setTimeout(() => setCartMsg(''), 3000)
        }
    }

    if (loading) return (
        <div className="flex w-full min-h-screen bg-gray-50 font-jakarta">
            <ReaderSidebar />
            <main className="flex-1 ml-64 px-8 py-7 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </main>
        </div>
    )

    if (!book) return (
        <div className="flex w-full min-h-screen bg-gray-50 font-jakarta">
            <ReaderSidebar />
            <main className="flex-1 ml-64 px-8 py-7"><p>Buku tidak ditemukan</p></main>
        </div>
    )

    const inCart = isInCart(book.id)

    return (
        <div className="flex w-full min-h-screen bg-gray-50 font-jakarta">
            <ReaderSidebar />
            <main className="flex-1 ml-64 px-8 py-7">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                    <button onClick={() => navigate('/books')} className="hover:text-primary cursor-pointer">Daftar Buku</button>
                    <span>/</span>
                    <span className="text-neutral">{book.name}</span>
                </div>

                {/* Detail */}
                <div className="flex gap-10 bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-8">
                    {/* Cover */}
                    <div className="w-52 shrink-0">
                        <div className="w-full aspect-2/3 rounded-xl overflow-hidden bg-gray-100 shadow-md">
                            {book.cover
                                ? <img src={book.cover} alt={book.name} className="w-full h-full object-cover" />
                                : <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary/40 text-sm text-center p-4 font-ebgaramond">{book.name}</div>}
                        </div>

                        {/* Tombol Baca di bawah cover — hanya tampil jika sudah sewa */}
                        {isRented && (
                            <button
                                onClick={() => setShowRead(true)}
                                className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer"
                                style={{ backgroundColor: '#8B1E1E', color: 'white' }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 24 24"><path fill="currentColor" d="M21 5c-1.11-.35-2.33-.5-3.5-.5c-1.95 0-4.05.4-5.5 1.5c-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5c.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5c1.35-.85 3.8-1.5 5.5-1.5c1.65 0 3.35.3 4.75 1.05c.1.05.15.05.25.05c.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1m0 13.5c-1.1-.35-2.3-.5-3.5-.5c-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5c1.2 0 2.4.15 3.5.5z"/></svg>
                                Baca Sekarang
                            </button>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        {book.genre && <span className="inline-block bg-tertiary text-primary text-xs font-medium px-3 py-1 rounded-full mb-3">{book.genre}</span>}
                        <h1 className="text-3xl font-bold text-neutral font-ebgaramond mb-1">{book.name}</h1>
                        <p className="text-gray-500 mb-3">Oleh {book.users?.name || '-'}</p>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex">{[1,2,3,4,5].map(i => <Star key={i} filled={i <= book.rate} />)}</div>
                            <span className="font-bold text-neutral">{book.rate}</span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-6">{book.description || 'Tidak ada deskripsi.'}</p>

                        <div className="flex gap-4 mb-6">
                            <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100">
                                <p className="text-xs text-gray-400 mb-1">Harga Sewa</p>
                                <p className="text-primary font-bold text-xl">Rp {Number(book.price || 0).toLocaleString('id-ID')}<span className="text-sm font-normal text-gray-400"> / 7 Hari</span></p>
                            </div>
                            <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100">
                                <p className="text-xs text-gray-400 mb-1">Stok</p>
                                <p className="font-bold text-neutral text-xl">{book.stock ?? 'Tersedia'}</p>
                            </div>
                        </div>

                        {/* Notifikasi cart */}
                        {cartMsg && (
                            <div className="mb-3 px-4 py-2 rounded-lg text-sm bg-green-50 text-success border border-green-100 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8z"/></svg>
                                {cartMsg} <button onClick={() => navigate('/keranjang')} className="underline font-medium cursor-pointer">Lihat keranjang</button>
                            </div>
                        )}

                        {isRented && (
                            <div className="mb-3 px-4 py-2 rounded-lg text-sm bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-between">
                                <span>✅ Kamu sedang menyewa buku ini</span>
                                <button
                                    onClick={() => setShowRead(true)}
                                    className="text-xs font-semibold underline cursor-pointer"
                                >
                                    Baca Sekarang →
                                </button>
                            </div>
                        )}

                        <div className="flex gap-3">
                            {/* Tombol Sewa */}
                            <button
                                disabled={isRented}
                                onClick={() => !isRented && navigate('/keranjang')}
                                className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition disabled:opacity-50 cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="currentColor" d="M7 22q-.825 0-1.412-.587T5 20V10.975q-.875-.325-1.437-1.1T3 8V4h18v4q0 1-.563 1.775t-1.437 1.1V20q0 .825-.587 1.413T17 22zm5-7l3-3l-1.4-1.4l-1.6 1.575l-.6-.575L10 13z"/></svg>
                                {isRented ? 'Sudah Disewa' : 'Sewa Buku'}
                            </button>

                            {/* Tombol Keranjang */}
                            <button
                                onClick={handleToggleCart}
                                disabled={isRented}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition cursor-pointer disabled:opacity-50
                                    ${inCart ? 'bg-primary/10 text-primary border-2 border-primary' : 'border-2 border-primary text-primary hover:bg-primary/5'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M7 22q-.825 0-1.412-.587T5 20t.588-1.412T7 18t1.413.588T9 20t-.587 1.413T7 22m10 0q-.825 0-1.412-.587T15 20t.588-1.412T17 18t1.413.588T19 20t-.587 1.413T17 22M1 2h2.27l3.96 8.55L5.25 13q-.275.5-.262 1.05T5.3 15.1Q5.7 15.7 6.35 16H19v-2H6.9l1.05-2H16q.8 0 1.45-.437t.95-1.113l3.5-6.35A1 1 0 0 0 21 2.5a1 1 0 0 0-.87-.5H4.43L3.73.85A1 1 0 0 0 2.82 0H1z"/>
                                </svg>
                                {inCart ? 'Hapus dari Keranjang' : 'Tambah Keranjang'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related */}
                {related.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-neutral font-ebgaramond">Buku Serupa</h2>
                            <button onClick={() => navigate('/books')} className="text-primary text-sm hover:underline">Lihat Semua &rsaquo;</button>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {related.map(b => (
                                <div key={b.id} onClick={() => navigate(`/books/${b.id}`)}
                                    className="flex-shrink-0 w-32 cursor-pointer group">
                                    <div className="w-full aspect-2/3 rounded-lg bg-gray-100 overflow-hidden shadow-sm mb-2">
                                        {b.cover
                                            ? <img src={b.cover} alt={b.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                                            : <div className="w-full h-full bg-primary/8 flex items-center justify-center text-xs text-primary/40 text-center p-2">{b.name}</div>}
                                    </div>
                                    <p className="text-xs font-semibold text-neutral truncate">{b.name}</p>
                                    <p className="text-xs text-gray-400 truncate">{b.users?.name}</p>
                                    <div className="flex items-center gap-0.5 mt-0.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24"><path fill="#D97706" d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08z"/></svg>
                                        <span className="text-xs text-gray-500">{b.rate}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* ── Read Modal ── */}
            {showRead && (
                <ReadBookModal
                    book={book}
                    onClose={() => setShowRead(false)}
                />
            )}
        </div>
    )
}
