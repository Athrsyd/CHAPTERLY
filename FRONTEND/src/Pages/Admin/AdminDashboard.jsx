import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../Components/Admin/AdminLayout'
import useAuth from '../../Hooks/useAuth'
import api from '../../services/api'

function IconUsers() { return <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3m-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3m0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5m8 0c-.29 0-.62.02-.97.05c1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5"/></svg> }
function IconAdmin() { return <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12c5.16-1.26 9-6.45 9-12V5zm0 4a3 3 0 1 1 0 6a3 3 0 0 1 0-6m0 14c-2.7-.75-4.93-2.55-6.23-5H18.23c-1.3 2.45-3.53 4.25-6.23 5"/></svg> }
function IconBook() { return <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M6 22q-.825 0-1.412-.587T4 20V4q0-.825.588-1.412T6 2h12q.825 0 1.413.588T20 4v16q0 .825-.587 1.413T18 22zm0-2h12V4h-2v7l-2.5-1.5L11 11V4H6zm0 0V4zm5-9l2.5-1.5L16 11l-2.5-1.5z"/></svg> }
function IconCoin() { return <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15c0-1.09 1.01-1.85 2.7-1.85c1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61c0 2.31 1.91 3.46 4.7 4.13c2.5.6 3 1.48 3 2.41c0 .69-.49 1.79-2.7 1.79c-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55c0-2.84-2.43-3.81-4.7-4.4"/></svg> }
function IconBell() { return <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24"><path fill="currentColor" d="M4 19v-2h2v-7q0-2.075 1.25-3.687T10.5 4.2v-.7q0-.625.438-1.062T12 2t1.063.438T13.5 3.5v.7q2 .5 3.25 2.113T18 10v7h2v2zm8 3q-.825 0-1.412-.587T10 20h4q0 .825-.587 1.413T12 22"/></svg> }
function IconChevronRight() { return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M8.59 16.58L13.17 12L8.59 7.41L10 6l6 6l-6 6z"/></svg> }

function StatCard({ label, value, sub, icon: Icon, color = 'bg-primary' }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex-1">
            <div className="flex items-center gap-4">
                <div className={`${color} text-white rounded-xl p-3 shrink-0`}><Icon /></div>
                <div>
                    <p className="text-xs text-gray-400 font-medium">{label}</p>
                    <p className="text-2xl font-bold text-neutral font-ebgaramond">{value ?? <span className="text-gray-300 animate-pulse">—</span>}</p>
                    {sub && <p className="text-xs text-success font-medium mt-0.5">{sub}</p>}
                </div>
            </div>
        </div>
    )
}

function StatusBadge({ status }) {
    const map = {
        active: 'bg-green-100 text-success', pending: 'bg-yellow-100 text-yellow-700',
        returned: 'bg-gray-100 text-gray-500', cancelled: 'bg-red-100 text-red-600',
    }
    const labels = { active: 'Aktif', pending: 'Pending', returned: 'Selesai', cancelled: 'Batal' }
    return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${map[status] || 'bg-gray-100 text-gray-500'}`}>{labels[status] || status}</span>
}

const AdminDashboard = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [stats, setStats] = useState({ users: null, admins: null, books: null, transactions: null, revenue: null })
    const [books, setBooks] = useState([])
    const [rents, setRents] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [booksRes, rentsRes] = await Promise.all([
                api.get('/books'),
                api.get('/rent').catch(() => ({ data: { data: [] } })),
            ])
            const allBooks = booksRes.data.data || []
            const allRents = rentsRes.data.data || []
            setBooks(allBooks)
            setRents(allRents)
            setStats({
                users: '—', admins: '—',
                books: allBooks.length,
                transactions: allRents.length,
                revenue: allRents.reduce((s, r) => s + (r.books?.price || 0), 0),
            })
        } catch {
            setStats({ users: '—', admins: '—', books: 0, transactions: 0, revenue: 0 })
        } finally {
            setLoading(false)
        }
    }

    const topBook = books.length > 0
        ? books.reduce((top, b) => (b.rate || 0) > (top.rate || 0) ? b : top, books[0])
        : null

    return (
        <AdminLayout>
            {/* Topbar */}
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-neutral font-ebgaramond">Dashboard</h1>
                    <p className="text-gray-400 text-sm">Selamat datang kembali, <strong>{user?.name}</strong> 👋</p>
                    <p className="text-gray-400 text-xs mt-0.5">Berikut ringkasan statistik sistem Chapterly.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="text-gray-400 hover:text-primary transition-colors"><IconBell /></button>
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 cursor-pointer shadow-sm">
                        <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                            {user?.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-neutral">{user?.name}</span>
                    </div>
                </div>
            </header>

            {/* Stat Cards */}
            <div className="flex gap-4 mb-8">
                <StatCard label="Total Buku" value={stats.books} icon={IconBook} />
                <StatCard label="Total Transaksi" value={stats.transactions} icon={IconCoin} color="bg-secondary" />
                <StatCard label="Total Pendapatan" value={stats.revenue !== null ? `Rp ${stats.revenue?.toLocaleString('id-ID')}` : null} icon={IconCoin} color="bg-success" />
                <StatCard label="Total Penulis" value={books.map(b => b.author_id).filter((v, i, a) => a.indexOf(v) === i).length} icon={IconAdmin} color="bg-neutral" />
            </div>

            {/* Two columns */}
            <div className="flex gap-6">
                {/* Buku Terbaru */}
                <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-bold text-neutral">Buku Terbaru</h2>
                        <button onClick={() => navigate('/admin/books')} className="flex items-center gap-0.5 text-primary text-sm font-medium hover:underline">
                            Lihat Semua <IconChevronRight />
                        </button>
                    </div>
                    {loading ? (
                        <div className="flex flex-col gap-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-3 animate-pulse">
                                    <div className="w-10 h-14 rounded-lg bg-gray-100" />
                                    <div className="flex-1 flex flex-col gap-2">
                                        <div className="h-3 w-1/2 bg-gray-100 rounded" />
                                        <div className="h-2.5 w-1/3 bg-gray-100 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 text-xs text-gray-400 font-medium">
                                    <th className="text-left pb-3">Buku</th>
                                    <th className="text-left pb-3">Penulis</th>
                                    <th className="text-left pb-3">Genre</th>
                                    <th className="text-left pb-3">Harga</th>
                                    <th className="text-left pb-3">Rating</th>
                                </tr>
                            </thead>
                            <tbody>
                                {books.slice(0, 6).map(book => (
                                    <tr key={book.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => navigate('/admin/books')}>
                                        <td className="py-2.5 flex items-center gap-3">
                                            <div className="w-8 h-11 rounded bg-gradient-to-br from-primary/20 to-secondary/20 shrink-0 overflow-hidden">
                                                {book.cover && <img src={book.cover} alt={book.name} className="w-full h-full object-cover" />}
                                            </div>
                                            <span className="font-medium text-neutral truncate max-w-32">{book.name}</span>
                                        </td>
                                        <td className="py-2.5 text-gray-500">{book.users?.name || '—'}</td>
                                        <td className="py-2.5"><span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{book.genre || '—'}</span></td>
                                        <td className="py-2.5 text-primary font-semibold">Rp {book.price?.toLocaleString('id-ID')}</td>
                                        <td className="py-2.5">
                                            {book.rate > 0 ? (
                                                <span className="text-secondary font-semibold">★ {book.rate}</span>
                                            ) : <span className="text-gray-300">—</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Transaksi Terbaru */}
                <div className="w-72 shrink-0 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-bold text-neutral">Transaksi Terbaru</h2>
                        <button onClick={() => navigate('/admin/transactions')} className="flex items-center gap-0.5 text-primary text-sm font-medium hover:underline">
                            Lihat Semua <IconChevronRight />
                        </button>
                    </div>
                    {loading ? (
                        <div className="flex flex-col gap-3">
                            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />)}
                        </div>
                    ) : rents.length === 0 ? (
                        <p className="text-center text-gray-400 text-sm py-8">Belum ada transaksi</p>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {rents.slice(0, 5).map(rent => (
                                <div key={rent.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                                    <div className="w-9 h-12 rounded bg-gradient-to-br from-primary/10 to-secondary/10 shrink-0 overflow-hidden">
                                        {rent.books?.cover && <img src={rent.books.cover} alt="" className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-neutral truncate">{rent.books?.name || '—'}</p>
                                        <p className="text-xs text-gray-400">{rent.rent_time ? new Date(rent.rent_time).toLocaleDateString('id-ID') : '—'}</p>
                                        <p className="text-xs text-primary font-semibold">Rp {rent.books?.price?.toLocaleString('id-ID') || 0}</p>
                                    </div>
                                    <StatusBadge status="active" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    )
}

export default AdminDashboard