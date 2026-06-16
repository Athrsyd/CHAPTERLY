import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SuperAdminSidebar from '../../Components/shared/SuperAdminSidebar'
import useAuth from '../../Hooks/useAuth'
import api from '../../services/api'

export default function SuperAdminDashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [books, setBooks] = useState([])
    const [rents, setRents] = useState([])
    const [history, setHistory] = useState([])
    const [authors, setAuthors] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            api.get('/books'),
            api.get('/rent'),
            api.get('/rent/history'),
            api.get('/admin/authors'),
        ]).then(([b, r, h, a]) => {
            setBooks(b.data.data || [])
            setRents(r.data.data || [])
            setHistory(h.data.data || [])
            setAuthors(a.data.data || [])
        }).catch(console.error).finally(() => setLoading(false))
    }, [])

    const totalTx = rents.length + history.length
    const stats = [
        // { label: 'Total User', value: '—', sub: 'Pengguna', icon: '👥', onClick: () => navigate('/superadmin/kelola-user') },
        { label: 'Total penulis terafiliasi', value: authors.length, sub: 'Penulis', icon:  <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12c5.16-1.26 9-6.45 9-12V5zm0 4a3 3 0 1 1 0 6a3 3 0 0 1 0-6m0 14c-2.33 0-4.31-1.46-5.11-3.5h10.22C16.31 17.54 14.33 19 12 19"/></svg>, onClick: () => navigate('/superadmin/kelola-admin') },
        { label: 'Total buku', value: books.length, sub: 'Buku', icon: <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M6 22q-.825 0-1.412-.587T4 20V4q0-.825.588-1.412T6 2h12q.825 0 1.413.588T20 4v16q0 .825-.587 1.413T18 22zm0-2h12V4h-2v7l-2.5-1.5L11 11V4H6z"/></svg>, onClick: () => navigate('/superadmin/kelola-buku') },
        { label: 'Riwayat peminjaman', value: totalTx, sub: 'Transaksi', icon: <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2M4 19V5h16v3h-6c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h6v3zm16-9v4h-6v-4z"/></svg>, onClick: () => navigate('/superadmin/kelola-transaksi') },
        // { label: 'Total Pendapatan', value: `Rp ${(totalTx * 6000).toLocaleString('id-ID')}`, sub: '+12% dari minggu lalu', icon: '💰' },
    ]

    const recentTx = [
        ...rents.map(r => ({ book: r.books?.name, date: r.rent_time, price: r.books?.price, status: 'Success' })),
        ...history.map(h => ({ book: h.rent_books?.books?.name, date: h.finished_date, price: h.rent_books?.books?.price, status: 'Success' }))
    ].slice(0, 5)

    const statusStyle = { Success: 'bg-green-100 text-success', Pending: 'bg-yellow-100 text-yellow-600', Cancelled: 'bg-red-100 text-red-500' }

    return (
        <div className="flex w-full min-h-screen font-jakarta" style={{ backgroundColor: '#F9F5F0' }}>
            <SuperAdminSidebar />
            <main className="flex-1 ml-56 px-8 py-7">
                {/* Header */}
                <div className="flex items-center justify-between mb-7">
                    <div>
                        <h1 className="text-4xl font-bold text-neutral font-ebgaramond">Dashboard</h1>
                        <p className="text-gray-500 text-lg">Selamat datang kembali, Pustakawan </p>
                        <p className="text-gray-400 text-md mt-0.5">Berikut ringkasan statistik sistem Chapterly.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* <button className="relative p-2 rounded-full hover:bg-white transition">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24" className="text-gray-500"><path fill="currentColor" d="M4 19v-2h2v-7q0-2.075 1.25-3.687T10.5 4.2v-.7q0-.625.438-1.062T12 2t1.063.438T13.5 3.5v.7q2 .5 3.25 2.113T18 10v7h2v2zm8 3q-.825 0-1.412-.587T10 20h4q0 .825-.587 1.413T12 22"/></svg>
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                        </button> */}
                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm cursor-pointer">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: '#8B1E1E' }}>P</div>
                            <span className="text-sm font-medium text-neutral">Pustakawan</span>
                            {/* <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" className="text-gray-400"><path fill="currentColor" d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6z"/></svg> */}
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-7">
                    {stats.map(s => (
                        <div key={s.label} onClick={s.onClick} className={`bg-white rounded-xl border border-gray-100 shadow-sm p-4 ${s.onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all' : ''}`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xl">{s.icon}</span>
                                {s.onClick && <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" className="text-gray-300" viewBox="0 0 24 24"><path fill="currentColor" d="M8.59 16.58L13.17 12L8.59 7.41L10 6l6 6l-6 6z"/></svg>}
                            </div>
                            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
                            <p className="text-xl font-bold text-neutral font-ebgaramond">{s.value}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-3 gap-6">
                    {/* Transaksi Terbaru */}
                    <div className="col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-neutral">Riwayat Peminjaman</h2>
                            <button onClick={() => navigate('/superadmin/kelola-transaksi')} className="text-primary text-sm hover:underline cursor-pointer">Lihat Semua &rsaquo;</button>
                        </div>
                        {loading ? <div className="h-40 animate-pulse bg-gray-50 rounded-xl" /> : (
                            <div className="space-y-3">
                                {recentTx.map((tx, i) => (
                                    <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                                        <div className="w-10 h-14 bg-gray-100 rounded shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-neutral truncate">{tx.book || '-'}</p>
                                            <p className="text-xs text-gray-400">{tx.date ? new Date(tx.date).toLocaleDateString('id-ID') : '-'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-neutral">Rp {Number(tx.price || 0).toLocaleString('id-ID')}</p>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyle[tx.status]}`}>{tx.status}</span>
                                        </div>
                                    </div>
                                ))}
                                {recentTx.length === 0 && <p className="text-center text-gray-400 text-sm py-6">Belum ada transaksi</p>}
                            </div>
                        )}
                    </div>

                    {/* Statistik */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                            <h3 className="font-semibold text-neutral mb-4">Statistik Pengguna</h3>
                            <div className="flex items-center justify-center">
                                <div className="relative w-24 h-24">
                                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F3E8E8" strokeWidth="3" />
                                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#8B1E1E" strokeWidth="3" strokeDasharray="91 9" />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-neutral">91%</div>
                                </div>
                            </div>
                            <div className="mt-3 space-y-1.5">
                                <div className="flex items-center gap-2 text-xs"><div className="w-3 h-3 rounded-full bg-primary shrink-0" /><span className="text-gray-500">User (91%)</span></div>
                                <div className="flex items-center gap-2 text-xs"><div className="w-3 h-3 rounded-full bg-tertiary border border-primary/20 shrink-0" /><span className="text-gray-500">Admin ({authors.length})</span></div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                            <h3 className="font-semibold text-neutral mb-3">Buku Terpopuler</h3>
                            {books[0] && (
                                <div className="flex gap-3">
                                    <div className="w-12 h-16 bg-gray-100 rounded overflow-hidden shrink-0">
                                        {books[0].cover && <img src={books[0].cover} alt="" className="w-full h-full object-cover" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-neutral line-clamp-2">{books[0].name}</p>
                                        <p className="text-xs text-gray-400 mt-1">1.200+ disewa</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
