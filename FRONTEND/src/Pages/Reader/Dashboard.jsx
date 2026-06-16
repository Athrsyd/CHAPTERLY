import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReaderSidebar from '../../Components/shared/ReaderSidebar'
import useAuth from '../../Hooks/useAuth'
import api from '../../services/api'

const IconBook = () => <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M6 22q-.825 0-1.412-.587T4 20V4q0-.825.588-1.412T6 2h12q.825 0 1.413.588T20 4v16q0 .825-.587 1.413T18 22zm0-2h12V4h-2v7l-2.5-1.5L11 11V4H6z"/></svg>
const IconCalendar = () => <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M5 22q-.825 0-1.412-.587T3 20V6q0-.825.588-1.412T5 4h1V2h2v2h8V2h2v2h1q.825 0 1.413.588T21 6v14q0 .825-.587 1.413T19 22zm0-2h14V10H5zM5 8h14V6H5z"/></svg>
const IconClock = () => <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m2.8-4.8l1.4-1.4l-3.2-3.2V8h-2v5.4z"/></svg>
const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M5 21V5q0-.825.588-1.412T7 3h10q.825 0 1.413.588T19 5v16l-7-3z"/></svg>
const IconSearch = () => <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"/></svg>
const IconBell = () => <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24"><path fill="currentColor" d="M4 19v-2h2v-7q0-2.075 1.25-3.687T10.5 4.2v-.7q0-.625.438-1.062T12 2t1.063.438T13.5 3.5v.7q2 .5 3.25 2.113T18 10v7h2v2zm8 3q-.825 0-1.412-.587T10 20h4q0 .825-.587 1.413T12 22"/></svg>
const IconChevron = () => <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M8.59 16.58L13.17 12L8.59 7.41L10 6l6 6l-6 6z"/></svg>

const StarRating = ({ rate }) => (
    <div className="flex items-center gap-0.5">
        {[1,2,3,4,5].map(i => (
            <svg key={i} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24">
                <path fill={i <= rate ? '#D97706' : '#E5E7EB'} d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08z"/>
            </svg>
        ))}
    </div>
)

export default function ReaderDashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [activeRents, setActiveRents] = useState([])
    const [allBooks, setAllBooks] = useState([])
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [rentsRes, booksRes, histRes] = await Promise.all([
                    api.get('/rent'),
                    api.get('/books'),
                    api.get('/rent/history'),
                ])
                setActiveRents(rentsRes.data.data || [])
                setAllBooks(booksRes.data.data || [])
                setHistory(histRes.data.data || [])
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }
        fetchAll()
    }, [])

    const statCards = [
        { label: 'Buku Disewa', value: activeRents.length, unit: 'Buku', icon: <IconBook />, color: 'bg-primary' },
        { label: 'Transaksi', value: history.length + activeRents.length, unit: 'Total', icon: <IconCalendar />, color: 'bg-primary' },
        { label: 'Buku Aktif', value: activeRents.length, unit: 'Buku', icon: <IconClock />, color: 'bg-primary' },
        { label: 'Selesai Dibaca', value: history.length, unit: 'Buku', icon: <IconCheck />, color: 'bg-primary' },
    ]

    const recommendations = allBooks.filter(b => !activeRents.find(r => r.book_id === b.id)).slice(0, 5)

    return (
        <div className="flex w-full min-h-screen bg-gray-50 font-jakarta">
            <ReaderSidebar />
            <main className="flex-1 ml-64 px-8 py-7">
                {/* Topbar */}
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <p className="text-gray-400 text-sm">Selamat Datang Kembali,</p>
                        <h1 className="text-primary text-2xl font-bold font-ebgaramond italic">{user?.name || 'Pembaca'}</h1>
                        <p className="text-gray-500 text-sm mt-0.5">Lanjutkan petualangan membacamu hari ini!</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 w-72 shadow-sm">
                            <span className="text-gray-400"><IconSearch /></span>
                            <input value={search} onChange={e => setSearch(e.target.value)}
                                type="text" placeholder="Cari buku, penulis, atau genre..."
                                className="bg-transparent outline-none text-sm text-gray-600 placeholder-gray-400 w-full" />
                        </div>
                        <button className="text-gray-500 hover:text-primary transition-colors"><IconBell /></button>
                        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm cursor-pointer">
                            {user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                    </div>
                </header>

                {/* Stat Cards */}
                <div className="flex gap-4 mb-8">
                    {statCards.map(s => (
                        <div key={s.label} className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl px-5 py-4 flex-1 shadow-sm">
                            <div className="bg-primary text-white rounded-lg p-2.5">{s.icon}</div>
                            <div className="flex flex-col">
                                <span className="text-primary text-xs font-semibold uppercase tracking-wide">{s.label}</span>
                                <span className="text-primary text-3xl font-bold font-ebgaramond leading-tight">{s.value}</span>
                                <span className="text-gray-400 text-xs">{s.unit}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex gap-6">
                    {/* Left */}
                    <div className="flex flex-col gap-6 flex-1">
                        {/* Buku yang Sedang Disewa */}
                        <section className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-neutral">Buku yang Sedang Disewa</h2>
                                <button onClick={() => navigate('/transaksi')} className="flex items-center gap-0.5 text-primary text-sm font-medium hover:underline">Lihat Semua <IconChevron /></button>
                            </div>
                            {loading ? (
                                <div className="grid grid-cols-5 gap-4">{[...Array(5)].map((_, i) => <div key={i} className="aspect-2/3 rounded-lg bg-gray-100 animate-pulse" />)}</div>
                            ) : activeRents.length === 0 ? (
                                <div className="text-center py-8 text-gray-400 text-sm">Belum ada buku yang disewa. <button onClick={() => navigate('/books')} className="text-primary underline">Cari buku</button></div>
                            ) : (
                                <div className="grid grid-cols-5 gap-4">
                                    {activeRents.slice(0, 5).map(rent => (
                                        <div key={rent.id} onClick={() => navigate(`/books/${rent.book_id}`)} className="flex flex-col gap-2 cursor-pointer group">
                                            <div className="w-full aspect-2/3 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden">
                                                {rent.books?.cover
                                                    ? <img src={rent.books.cover} alt={rent.books?.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                                                    : 
                                                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary/40 text-xs text-center p-2">{rent.books?.name}</div>
                                                    }
                                            </div>
                                            <p className="text-xs font-semibold text-neutral truncate">{rent.books?.name || '-'}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Rekomendasi */}
                        <section className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-neutral">Rekomendasi Untukmu</h2>
                                <button onClick={() => navigate('/books')} className="flex items-center gap-0.5 text-primary text-sm font-medium hover:underline">Lihat Semua <IconChevron /></button>
                            </div>
                            <div className="grid grid-cols-5 gap-4">
                                {loading ? [...Array(5)].map((_, i) => <div key={i} className="aspect-2/3 rounded-lg bg-gray-100 animate-pulse" />) :
                                    recommendations.slice(0, 5).map(book => (
                                        <div key={book.id} onClick={() => navigate(`/books/${book.id}`)} className="flex flex-col gap-2 cursor-pointer group">
                                            <div className="w-full aspect-2/3 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden">
                                                {book.cover
                                                    ? <img src={book.cover} alt={book.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                                                    : <div className="w-full h-full bg-secondary/10 flex items-center justify-center text-secondary/50 text-xs text-center p-2">{book.name}</div>}
                                            </div>
                                            <p className="text-sm font-semibold text-neutral truncate">{book.name}</p>
                                            <p className="text-xs font-semibold text-neutral/70 truncate">{book?.users?.name}</p>
                                            <StarRating rate={book.rate} />
                                                <p className="text-md font-semibold text-primary truncate">Rp {Number(book.price || 0).toLocaleString('id-ID')}</p>
                                        </div>
                                    ))}
                            </div>
                        </section>
                    </div>

                    {/* Right - Riwayat Transaksi */}
                    <aside className="w-72 shrink-0">
                        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-neutral">Riwayat Transaksi</h2>
                                <button onClick={() => navigate('/transaksi')} className="flex items-center gap-0.5 text-primary text-sm font-medium hover:underline">Lihat Semua <IconChevron /></button>
                            </div>
                            {history.length === 0 && !loading ? (
                                <p className="text-sm text-gray-400 text-center py-4">Belum ada riwayat</p>
                            ) : (
                                <div className="flex flex-col">
                                    {history.slice(0, 5).map(h => (
                                        <div key={h.id} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
                                            <div className="w-12 h-16 rounded bg-gray-200 shrink-0 overflow-hidden">
                                                {h.rent_books?.books?.cover && <img src={h.rent_books.books.cover} alt="" className="w-full h-full object-cover" />}
                                            </div>
                                            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-neutral truncate">{h.rent_books?.books?.name || '-'}</p>
                                                <p className="text-xs text-gray-400 truncate">{h.rent_books?.books?.users?.name || '-'}</p>
                                                <p className="text-xs text-gray-400">{h.finished_date ? new Date(h.finished_date).toLocaleDateString('id-ID') : '-'}</p>
                                            </div>
                                            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-success shrink-0">Selesai</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    )
}
