import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import UserLayout from '../../Components/User/UserLayout'
import useAuth from '../../Hooks/useAuth'
import api from '../../services/api'

// ── Icons ────────────────────────────────────────────────────
function IconBook() { return <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M6 22q-.825 0-1.412-.587T4 20V4q0-.825.588-1.412T6 2h12q.825 0 1.413.588T20 4v16q0 .825-.587 1.413T18 22zm0-2h12V4h-2v7l-2.5-1.5L11 11V4H6zm0 0V4zm5-9l2.5-1.5L16 11l-2.5-1.5z" /></svg> }
function IconCoin() { return <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m1 15h-2v-2h2zm0-4h-2V7h2z" /></svg> }
function IconClock() { return <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m2.8-4.8l1.4-1.4l-3.2-3.2V8h-2v5.4z" /></svg> }
function IconBookmark() { return <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M5 21V5q0-.825.588-1.412T7 3h10q.825 0 1.413.588T19 5v16l-7-3zm2-3.05l5-2.15l5 2.15V5H7zM7 5h10z" /></svg> }
function IconSearch() { return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14" /></svg> }
function IconBell() { return <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24"><path fill="currentColor" d="M4 19v-2h2v-7q0-2.075 1.25-3.687T10.5 4.2v-.7q0-.625.438-1.062T12 2t1.063.438T13.5 3.5v.7q2 .5 3.25 2.113T18 10v7h2v2zm8 3q-.825 0-1.412-.587T10 20h4q0 .825-.587 1.413T12 22" /></svg> }
function IconChevronRight() { return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M8.59 16.58L13.17 12L8.59 7.41L10 6l6 6l-6 6z" /></svg> }
function IconStar() { return <svg xmlns="http://www.w3.org/2000/svg" width="0.9em" height="0.9em" viewBox="0 0 24 24"><path fill="currentColor" d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08z" /></svg> }

// ── Stat Card ────────────────────────────────────────────────
function StatCard({ label, value, unit, icon: Icon, color = 'bg-primary' }) {
    return (
        <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl px-5 py-4 flex-1 shadow-sm">
            <div className={`${color} text-white rounded-xl p-3 flex items-center justify-center shrink-0`}>
                <Icon />
            </div>
            <div className="flex flex-col">
                <span className="text-gray-500 text-xs font-medium">{label}</span>
                <span className="text-neutral text-2xl font-bold font-ebgaramond">{value ?? '—'}</span>
                <span className="text-gray-400 text-xs">{unit}</span>
            </div>
        </div>
    )
}

// ── Book Card ────────────────────────────────────────────────
function BookCard({ book, onClick }) {
    return (
        <div
            className="flex flex-col gap-2 cursor-pointer group"
            onClick={() => onClick && onClick(book)}
        >
            <div className="w-full aspect-[2/3] rounded-lg bg-gray-100 border border-gray-200 overflow-hidden">
                {book?.cover ? (
                    <img src={book.cover} alt={book.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                        <span className="text-primary/40 text-xs text-center px-2 font-ebgaramond">{book?.name}</span>
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-0.5">
                <p className="text-xs font-semibold text-neutral truncate leading-tight">{book?.name || '—'}</p>
                <p className="text-xs text-gray-400 truncate">{book?.users?.name || '—'}</p>
                {book?.rate > 0 && (
                    <div className="flex items-center gap-0.5 text-secondary">
                        <IconStar />
                        <span className="text-xs text-gray-500">{book.rate}</span>
                    </div>
                )}
            </div>
        </div>
    )
}

// ── Status Badge ─────────────────────────────────────────────
function StatusBadge({ status }) {
    const map = {
        active: { label: 'Aktif', cls: 'bg-green-100 text-success' },
        returned: { label: 'Dikembalikan', cls: 'bg-gray-100 text-gray-500' },
        pending: { label: 'Pending', cls: 'bg-yellow-100 text-yellow-700' },
    }
    const s = map[status] || { label: status || '—', cls: 'bg-gray-100 text-gray-500' }
    return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${s.cls}`}>{s.label}</span>
}

// ── Transaction Item ─────────────────────────────────────────
function TransactionItem({ item }) {
    const book = item?.books
    return (
        <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
            <div className="w-10 h-14 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                {book?.cover ? (
                    <img src={book.cover} alt={book.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
                )}
            </div>
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <p className="text-xs font-semibold text-neutral truncate">{book?.name || '—'}</p>
                <p className="text-xs text-gray-400 truncate">{book?.users?.name || '—'}</p>
                <p className="text-xs text-gray-400">{item?.rent_time ? new Date(item.rent_time).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</p>
            </div>
            <StatusBadge status="active" />
        </div>
    )
}

// ── Topbar ───────────────────────────────────────────────────
function Topbar({ user, onSearch }) {
    const [q, setQ] = useState('')
    return (
        <header className="flex items-center justify-between mb-8">
            <div>
                <p className="text-gray-400 text-sm">Selamat Datang Kembali,</p>
                <h1 className="text-primary text-2xl font-bold font-ebgaramond italic">{user?.name ?? 'Pembaca'} 👋</h1>
                <p className="text-gray-500 text-sm mt-0.5">Lanjutkan petualangan membacamu hari ini!</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 w-72 shadow-sm">
                    <span className="text-gray-400"><IconSearch /></span>
                    <input
                        type="text"
                        placeholder="Cari buku, penulis, atau genre..."
                        value={q}
                        onChange={e => setQ(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && onSearch(q)}
                        className="bg-transparent outline-none text-sm text-gray-600 placeholder-gray-400 w-full"
                    />
                </div>
                <button className="text-gray-500 hover:text-primary transition-colors relative">
                    <IconBell />
                </button>
                <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold cursor-pointer shrink-0">
                    {user?.name?.[0]?.toUpperCase() ?? 'U'}
                </div>
            </div>
        </header>
    )
}

// ── Main Dashboard ───────────────────────────────────────────
const UserDashboard = () => {
    const { user } = useAuth()
    const navigate = useNavigate()

    const [rents, setRents] = useState([])
    const [allBooks, setAllBooks] = useState([])
    const [history, setHistory] = useState([])
    const [loadingRents, setLoadingRents] = useState(true)
    const [loadingBooks, setLoadingBooks] = useState(true)

    useEffect(() => {
        fetchRents()
        fetchBooks()
        fetchHistory()
    }, [])

    const fetchRents = async () => {
        setLoadingRents(true)
        try {
            const res = await api.get('/rent')
            setRents(res.data.data || [])
        } catch {
            setRents([])
        } finally {
            setLoadingRents(false)
        }
    }

    const fetchBooks = async () => {
        setLoadingBooks(true)
        try {
            const res = await api.get('/books')
            setAllBooks(res.data.data || [])
        } catch {
            setAllBooks([])
        } finally {
            setLoadingBooks(false)
        }
    }

    const fetchHistory = async () => {
        try {
            const res = await api.get('/rent/history')
            setHistory(res.data.data || [])
        } catch {
            setHistory([])
        }
    }

    const rentedBookIds = new Set(rents.map(r => r.book_id))
    const recommendedBooks = allBooks.filter(b => !rentedBookIds.has(b.id)).slice(0, 6)
    const rentedBooksData = rents.map(r => r.books).filter(Boolean)

    const handleSearch = (q) => {
        if (q.trim()) navigate(`/books?search=${encodeURIComponent(q)}`)
    }

    const statCards = [
        { label: 'Buku Disewa', value: rents.length, unit: 'Buku', icon: IconBook },
        { label: 'Total Transaksi', value: rents.length + history.length, unit: 'Total', icon: IconCoin },
        { label: 'Buku Aktif', value: rents.length, unit: 'Sedang dibaca', icon: IconClock },
        { label: 'Selesai Dibaca', value: history.length, unit: 'Buku', icon: IconBookmark },
    ]

    const skeletonBooks = Array.from({ length: 6 })

    return (
        <UserLayout>
            <Topbar user={user} onSearch={handleSearch} />

            {/* Stat Cards */}
            <div className="flex gap-4 mb-8">
                {statCards.map(s => <StatCard key={s.label} {...s} />)}
            </div>

            {/* Two-column layout */}
            <div className="flex gap-6">
                {/* Left column */}
                <div className="flex flex-col gap-6 flex-1">
                    {/* Buku yang Sedang Disewa */}
                    <section className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-bold text-neutral font-jakarta">Buku yang Sedang Disewa</h2>
                            <button onClick={() => navigate('/transactions')} className="flex items-center gap-0.5 text-primary text-sm font-medium hover:underline">
                                Lihat Semua <IconChevronRight />
                            </button>
                        </div>
                        {loadingRents ? (
                            <div className="grid grid-cols-6 gap-4">
                                {skeletonBooks.map((_, i) => (
                                    <div key={i} className="flex flex-col gap-2">
                                        <div className="w-full aspect-[2/3] rounded-lg bg-gray-100 animate-pulse" />
                                        <div className="h-3 w-3/4 rounded bg-gray-100 animate-pulse" />
                                        <div className="h-2.5 w-1/2 rounded bg-gray-100 animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        ) : rentedBooksData.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                                <IconBook />
                                <p className="mt-2 text-sm">Belum ada buku yang disewa</p>
                                <button onClick={() => navigate('/books')} className="mt-3 text-xs text-primary font-semibold hover:underline">Jelajahi Buku →</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-6 gap-4">
                                {rentedBooksData.slice(0, 6).map((book, i) => (
                                    <BookCard key={i} book={book} onClick={b => navigate(`/books/${b.id}`)} />
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Rekomendasi Untukmu */}
                    <section className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-bold text-neutral font-jakarta">Rekomendasi Untukmu</h2>
                            <button onClick={() => navigate('/books')} className="flex items-center gap-0.5 text-primary text-sm font-medium hover:underline">
                                Lihat Semua <IconChevronRight />
                            </button>
                        </div>
                        {loadingBooks ? (
                            <div className="grid grid-cols-6 gap-4">
                                {skeletonBooks.map((_, i) => (
                                    <div key={i} className="flex flex-col gap-2">
                                        <div className="w-full aspect-[2/3] rounded-lg bg-gray-100 animate-pulse" />
                                        <div className="h-3 w-3/4 rounded bg-gray-100 animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        ) : recommendedBooks.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 text-sm">Tidak ada rekomendasi saat ini</div>
                        ) : (
                            <div className="grid grid-cols-6 gap-4">
                                {recommendedBooks.map(book => (
                                    <BookCard key={book.id} book={book} onClick={b => navigate(`/books/${b.id}`)} />
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                {/* Right column – Riwayat Transaksi */}
                <aside className="w-72 shrink-0">
                    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-bold text-neutral font-jakarta">Riwayat Transaksi</h2>
                            <button onClick={() => navigate('/transactions')} className="flex items-center gap-0.5 text-primary text-sm font-medium hover:underline">
                                Lihat Semua <IconChevronRight />
                            </button>
                        </div>
                        {rents.length === 0 && history.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 text-sm">Belum ada transaksi</div>
                        ) : (
                            <div className="flex flex-col">
                                {rents.slice(0, 5).map(item => (
                                    <TransactionItem key={item.id} item={item} />
                                ))}
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </UserLayout>
    )
}

export default UserDashboard