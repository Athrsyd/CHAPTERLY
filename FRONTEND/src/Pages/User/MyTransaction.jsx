import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import UserLayout from '../../Components/User/UserLayout'
import api from '../../services/api'

function IconBell() { return <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24"><path fill="currentColor" d="M4 19v-2h2v-7q0-2.075 1.25-3.687T10.5 4.2v-.7q0-.625.438-1.062T12 2t1.063.438T13.5 3.5v.7q2 .5 3.25 2.113T18 10v7h2v2zm8 3q-.825 0-1.412-.587T10 20h4q0 .825-.587 1.413T12 22"/></svg> }
function IconReturn() { return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M7 19q-.825 0-1.412-.587T5 17V7q0-.825.588-1.412T7 5h5.925q.4 0 .763.15t.637.425l4.1 4.1q.275.275.425.638t.15.762V17q0 .825-.587 1.413T17 19zm10-7.85L13.85 8H7v9h10zM7 12v5z"/></svg> }

function StatusBadge({ status }) {
    const map = {
        active: { label: 'Aktif', cls: 'bg-green-100 text-success' },
        returned: { label: 'Dikembalikan', cls: 'bg-gray-100 text-gray-500' },
    }
    const s = map[status] || { label: status, cls: 'bg-gray-100 text-gray-500' }
    return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.cls}`}>{s.label}</span>
}

const MyTransactions = () => {
    const navigate = useNavigate()
    const [activeRents, setActiveRents] = useState([])
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [tab, setTab] = useState('active')
    const [returning, setReturning] = useState(null)
    const [toast, setToast] = useState(null)

    useEffect(() => {
        fetchAll()
    }, [])

    const fetchAll = async () => {
        setLoading(true)
        try {
            const [rentRes, histRes] = await Promise.all([
                api.get('/rent'),
                api.get('/rent/history').catch(() => ({ data: { data: [] } }))
            ])
            setActiveRents(rentRes.data.data || [])
            setHistory(histRes.data.data || [])
        } catch {
            setActiveRents([])
        } finally {
            setLoading(false)
        }
    }

    const handleReturn = async (rentId) => {
        setReturning(rentId)
        try {
            await api.delete(`/rent/${rentId}`)
            showToast('Buku berhasil dikembalikan!', 'success')
            fetchAll()
        } catch (err) {
            showToast(err.response?.data?.message || 'Gagal mengembalikan buku', 'error')
        } finally {
            setReturning(null)
        }
    }

    const showToast = (msg, type) => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3000)
    }

    const skeletons = Array.from({ length: 5 })

    return (
        <UserLayout>
            {toast && (
                <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${toast.type === 'success' ? 'bg-success' : 'bg-red-600'}`}>
                    {toast.msg}
                </div>
            )}

            <header className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-neutral font-ebgaramond">Transaksi Saya</h1>
                    <p className="text-gray-500 text-sm mt-0.5">Kelola semua penyewaan buku kamu di sini.</p>
                </div>
                <button className="text-gray-500 hover:text-primary transition-colors"><IconBell /></button>
            </header>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
                {[{ key: 'active', label: `Aktif (${activeRents.length})` }, { key: 'history', label: `Riwayat (${history.length})` }].map(t => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t.key ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex flex-col gap-3">
                    {skeletons.map((_, i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 animate-pulse">
                            <div className="w-14 h-20 rounded-lg bg-gray-100" />
                            <div className="flex-1 flex flex-col gap-2">
                                <div className="h-4 w-1/3 bg-gray-100 rounded" />
                                <div className="h-3 w-1/4 bg-gray-100 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : tab === 'active' ? (
                activeRents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24"><path fill="currentColor" d="M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2M4 19V5h16v3h-6c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h6v3zm16-9v4h-6v-4z"/></svg>
                        <p className="mt-3 text-base font-medium">Tidak ada buku yang sedang disewa</p>
                        <button onClick={() => navigate('/books')} className="mt-3 text-primary text-sm font-semibold hover:underline">Jelajahi Buku →</button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {activeRents.map(rent => {
                            const book = rent.books
                            return (
                                <div key={rent.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
                                    <div
                                        className="w-14 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 shrink-0 cursor-pointer"
                                        onClick={() => navigate(`/books/${book?.id}`)}
                                    >
                                        {book?.cover
                                            ? <img src={book.cover} alt={book.name} className="w-full h-full object-cover" />
                                            : <div className="w-full h-full flex items-center justify-center p-1"><p className="text-[8px] text-center text-primary/30 font-ebgaramond">{book?.name}</p></div>
                                        }
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-bold text-neutral truncate">{book?.name || '—'}</h3>
                                        <p className="text-xs text-gray-400 truncate mt-0.5">{book?.users?.name || '—'}</p>
                                        <div className="flex items-center gap-4 mt-2">
                                            <p className="text-xs text-gray-500">Disewa: <span className="font-semibold">{rent.rent_time ? new Date(rent.rent_time).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}</span></p>
                                            <p className="text-xs text-primary font-bold">Rp {book?.price?.toLocaleString('id-ID')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <StatusBadge status="active" />
                                        <button
                                            onClick={() => handleReturn(rent.id)}
                                            disabled={returning === rent.id}
                                            className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-primary border border-gray-200 hover:border-primary px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            <IconReturn />
                                            {returning === rent.id ? 'Memproses...' : 'Kembalikan'}
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )
            ) : (
                history.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-base font-medium">Belum ada riwayat penyewaan</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {history.map(h => {
                            const rentBook = h.rent_books
                            const book = rentBook?.books
                            return (
                                <div key={h.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
                                    <div className="w-14 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shrink-0">
                                        {book?.cover
                                            ? <img src={book.cover} alt={book.name} className="w-full h-full object-cover opacity-75" />
                                            : <div className="w-full h-full" />
                                        }
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-bold text-neutral truncate">{book?.name || '—'}</h3>
                                        <p className="text-xs text-gray-400 truncate mt-0.5">{book?.users?.name || '—'}</p>
                                        <p className="text-xs text-gray-400 mt-1">Dikembalikan: <span className="font-semibold">{h.finished_date ? new Date(h.finished_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}</span></p>
                                    </div>
                                    <StatusBadge status="returned" />
                                </div>
                            )
                        })}
                    </div>
                )
            )}
        </UserLayout>
    )
}

export default MyTransactions