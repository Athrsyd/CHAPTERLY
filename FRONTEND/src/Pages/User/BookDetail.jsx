import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import UserLayout from '../../Components/User/UserLayout'
import api from '../../services/api'

function IconStar({ filled = true }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill={filled ? "#d97706" : "#d1d5db"} d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08z"/></svg>
}
function IconHeart({ active }) {
    return active
        ? <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="currentColor" d="m12 21l-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812T2.388 10.4T2 8.15Q2 5.8 3.575 4.225T7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55t2.475-.55q2.35 0 3.925 1.575T22 8.15q0 1.15-.388 2.25t-1.362 2.412t-2.625 2.963T13.45 19.7z"/></svg>
        : <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="currentColor" d="m12 21l-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812T2.388 10.4T2 8.15Q2 5.8 3.575 4.225T7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55t2.475-.55q2.35 0 3.925 1.575T22 8.15q0 1.15-.388 2.25t-1.362 2.412t-2.625 2.963T13.45 19.7zm0-2.7q2.4-2.15 3.95-3.688t2.45-2.674t1.25-2.076T19.85 8.2q0-1.5-.975-2.475T16.6 4.75q-1 0-1.875.45t-1.575 1.35l-1.15 1.6l-1.15-1.6q-.675-.9-1.575-1.35T7.4 4.75q-1.45 0-2.425.975T4 8.2q0 .875.3 1.762t1.25 2.076t2.45 2.662T12 18.3z"/></svg>
}
function IconCart() { return <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="currentColor" d="M6 22q-.825 0-1.412-.587T4 20q0-.825.588-1.412T6 18q.825 0 1.413.588T8 20q0 .825-.587 1.413T6 22m12 0q-.825 0-1.412-.587T16 20q0-.825.588-1.412T18 18q.825 0 1.413.588T20 20q0 .825-.587 1.413T18 22M5.2 6l2.75 5.7H17l2.25-4.7H5.2zM4 4h17.95l-3.2 6.7L15.95 15H7.25L6 17H20v2H6q-1.125 0-1.637-.9t.012-1.85L5.9 14.05L2 6z"/></svg> }
function IconArrowLeft() { return <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="currentColor" d="m7.825 13l4.9 4.9q.3.3.288.7t-.313.7q-.3.275-.7.288t-.7-.288l-6.6-6.6q-.15-.15-.213-.325T4.425 12t.062-.375T4.7 11.3l6.6-6.6q.275-.275.688-.275t.712.275q.3.3.3.713t-.3.712z"/></svg> }

const genreColors = {
    Romance: 'bg-pink-100 text-pink-700', Fantasy: 'bg-purple-100 text-purple-700',
    Mystery: 'bg-blue-100 text-blue-700', Adventure: 'bg-green-100 text-green-700',
    Thriller: 'bg-red-100 text-red-700', Fiction: 'bg-indigo-100 text-indigo-700',
}

const BookDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [book, setBook] = useState(null)
    const [similar, setSimilar] = useState([])
    const [loading, setLoading] = useState(true)
    const [renting, setRenting] = useState(false)
    const [alreadyRented, setAlreadyRented] = useState(false)
    const [favorited, setFavorited] = useState(false)
    const [toast, setToast] = useState(null)

    useEffect(() => {
        fetchBook()
    }, [id])

    const fetchBook = async () => {
        setLoading(true)
        try {
            const [bookRes, rentRes] = await Promise.all([
                api.get(`/books/${id}`),
                api.get('/rent').catch(() => ({ data: { data: [] } }))
            ])
            const b = bookRes.data.data
            setBook(b)
            const rents = rentRes.data.data || []
            setAlreadyRented(rents.some(r => r.book_id === b.id))
            // Get similar books
            if (b.genre) {
                const simRes = await api.get('/books', { params: { genre: b.genre } })
                setSimilar((simRes.data.data || []).filter(s => s.id !== b.id).slice(0, 6))
            }
        } catch {
            setBook(null)
        } finally {
            setLoading(false)
        }
    }

    const handleRent = async () => {
        setRenting(true)
        try {
            await api.post('/rent', { book_id: book.id })
            setAlreadyRented(true)
            showToast('Buku berhasil disewa! 🎉', 'success')
        } catch (err) {
            showToast(err.response?.data?.message || 'Gagal menyewa buku', 'error')
        } finally {
            setRenting(false)
        }
    }

    const showToast = (msg, type) => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3000)
    }

    if (loading) return (
        <UserLayout>
            <div className="flex items-center gap-4 animate-pulse">
                <div className="w-56 h-80 rounded-xl bg-gray-100" />
                <div className="flex-1 flex flex-col gap-4">
                    <div className="h-8 w-1/2 bg-gray-100 rounded" />
                    <div className="h-4 w-1/3 bg-gray-100 rounded" />
                    <div className="h-4 w-full bg-gray-100 rounded" />
                    <div className="h-4 w-full bg-gray-100 rounded" />
                </div>
            </div>
        </UserLayout>
    )

    if (!book) return (
        <UserLayout>
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <p>Buku tidak ditemukan</p>
                <button onClick={() => navigate('/books')} className="mt-3 text-primary text-sm font-semibold hover:underline">← Kembali ke Daftar Buku</button>
            </div>
        </UserLayout>
    )

    const genreCls = genreColors[book.genre] || 'bg-gray-100 text-gray-600'

    return (
        <UserLayout>
            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all ${toast.type === 'success' ? 'bg-success' : 'bg-red-600'}`}>
                    {toast.msg}
                </div>
            )}

            {/* Back */}
            <button onClick={() => navigate('/books')} className="flex items-center gap-1.5 text-gray-500 hover:text-primary text-sm mb-6 transition-colors">
                <IconArrowLeft /> Kembali ke Daftar Buku
            </button>

            {/* Book Detail */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-8">
                <div className="flex gap-10">
                    {/* Cover */}
                    <div className="w-52 shrink-0">
                        <div className="w-full aspect-[2/3] rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-primary/20 to-secondary/20">
                            {book.cover ? (
                                <img src={book.cover} alt={book.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center p-4">
                                    <p className="text-primary/40 text-sm text-center font-ebgaramond font-semibold">{book.name}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${genreCls}`}>{book.genre}</span>
                        <h1 className="text-3xl font-bold text-neutral font-ebgaramond mt-3 mb-1">{book.name}</h1>
                        <p className="text-gray-500 text-sm mb-3">Oleh {book.users?.name || '—'}</p>
                        
                        {book.rate > 0 && (
                            <div className="flex items-center gap-1.5 mb-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <IconStar key={i} filled={i < book.rate} />
                                ))}
                                <span className="text-sm text-gray-500 ml-1">{book.rate}.0</span>
                            </div>
                        )}

                        {book.description && (
                            <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-2xl">{book.description}</p>
                        )}

                        {/* Price & Stock */}
                        <div className="flex items-center gap-6 mb-6">
                            <div className="bg-gray-50 border border-gray-100 rounded-xl px-5 py-3 flex-1">
                                <p className="text-xs text-gray-400 mb-1">Harga Sewa</p>
                                <p className="text-primary text-xl font-bold">Rp {book.price?.toLocaleString('id-ID')}</p>
                                <p className="text-xs text-gray-400">/ 7 Hari</p>
                            </div>
                            <div className="bg-gray-50 border border-gray-100 rounded-xl px-5 py-3">
                                <p className="text-xs text-gray-400 mb-1">Stok</p>
                                <p className="text-lg font-bold text-success">Tersedia</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={alreadyRented ? undefined : handleRent}
                                disabled={renting || alreadyRented}
                                className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-colors ${
                                    alreadyRented
                                        ? 'bg-gray-100 text-gray-400 cursor-default'
                                        : 'bg-primary text-white hover:bg-primary/90 cursor-pointer'
                                } disabled:opacity-60`}
                            >
                                <IconCart />
                                {alreadyRented ? 'Sudah Disewa' : renting ? 'Memproses...' : 'Sewa Buku'}
                            </button>
                            <button
                                onClick={() => setFavorited(v => !v)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold border transition-colors ${
                                    favorited ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                                }`}
                            >
                                <IconHeart active={favorited} />
                                {favorited ? 'Difavoritkan' : 'Tambah Favorit'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Similar Books */}
            {similar.length > 0 && (
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-neutral font-jakarta">Buku Serupa</h2>
                        <button onClick={() => navigate(`/books?genre=${book.genre}`)} className="text-primary text-sm font-medium hover:underline">Lihat Semua →</button>
                    </div>
                    <div className="grid grid-cols-6 gap-4">
                        {similar.map(b => (
                            <div key={b.id} className="cursor-pointer group" onClick={() => navigate(`/books/${b.id}`)}>
                                <div className="w-full aspect-[2/3] rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 mb-2">
                                    {b.cover
                                        ? <img src={b.cover} alt={b.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                        : <div className="w-full h-full flex items-center justify-center p-2"><p className="text-xs text-center text-primary/30 font-ebgaramond">{b.name}</p></div>
                                    }
                                </div>
                                <p className="text-xs font-semibold text-neutral truncate">{b.name}</p>
                                <p className="text-xs text-gray-400 truncate">{b.users?.name}</p>
                                {b.rate > 0 && (
                                    <div className="flex items-center gap-0.5 mt-0.5">
                                        <IconStar />
                                        <span className="text-xs text-gray-500">{b.rate}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </UserLayout>
    )
}

export default BookDetail