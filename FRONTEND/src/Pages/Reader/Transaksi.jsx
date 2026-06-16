import React, { useEffect, useState } from 'react'
import ReaderSidebar from '../../Components/shared/ReaderSidebar'
import api from '../../services/api'
import { Link } from 'react-router-dom'

const statusBadge = (status) => {
    const map = {
        'Aktif': 'bg-green-100 text-success',
        'Selesai': 'bg-gray-100 text-gray-500',
    }
    return map[status] || 'bg-gray-100 text-gray-500'
}

export default function ReaderTransaksi() {
    const [activeRents, setActiveRents] = useState([])
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [tab, setTab] = useState('aktif')
    const [returning, setReturning] = useState(null)
    const [msg, setMsg] = useState('')

    const load = async () => {
        setLoading(true)
        try {
            const [rentsRes, histRes] = await Promise.all([api.get('/rent'), api.get('/rent/history')])
            setActiveRents(rentsRes.data.data || [])
            setHistory(histRes.data.data || [])
        } catch { } finally { setLoading(false) }
    }

    useEffect(() => { load() }, [])

    const handleReturn = async (rentId) => {
        if (!confirm('Kembalikan buku ini?')) return
        setReturning(rentId)
        try {
            await api.delete(`/rent/${rentId}`)
            setMsg('Buku berhasil dikembalikan!')
            load()
        } catch (e) {
            setMsg(e.response?.data?.message || 'Gagal mengembalikan buku')
        } finally { setReturning(null) }
    }

    useEffect(() => {
        console.log('Active rents updated:', activeRents)
    }, [activeRents, history])

    return (
        <div className="flex w-full min-h-screen bg-gray-50 font-jakarta">
            <ReaderSidebar />
            <main className="flex-1 ml-64 px-8 py-7">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-neutral font-ebgaramond">Transaksi Saya</h1>
                    <p className="text-gray-500 text-sm mt-1">Kelola buku yang sedang kamu sewa</p>
                </div>

                {msg && (
                    <div className="mb-4 px-4 py-3 rounded-xl bg-green-50 text-success text-sm border border-green-200">{msg}
                        <button onClick={() => setMsg('')} className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer">✕</button>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
                    {[['aktif', `Aktif (${activeRents.length})`], ['history', `Riwayat (${history.length})`]].map(([key, label]) => (
                        <button key={key} onClick={() => setTab(key)}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${tab === key ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-neutral'}`}>
                            {label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-white rounded-xl animate-pulse" />)}</div>
                ) : tab === 'aktif' ? (
                    activeRents.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                            <p className="text-5xl mb-4">📖</p>
                            <p className="text-neutral font-semibold mb-1">Belum ada buku aktif</p>
                            <p className="text-gray-400 text-sm">Sewa buku dari Daftar Buku untuk mulai membaca</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {activeRents.map(rent => (
                                <Link to={`/books/${rent.books?.id}`} key={rent.id}>

                                    <div key={rent.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition cursor-pointer hover:-translate-y-2 hover:bg-gray-100">
                                        <div className="w-14 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                            {rent.books?.cover && <img src={rent.books.cover} alt="" className="w-full h-full object-cover" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-neutral">{rent.books?.name || '-'}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{rent.books?.users?.name || '-'}</p>
                                            <p className="text-xs text-gray-400 mt-1">Disewa: {rent.rent_time ? new Date(rent.rent_time).toLocaleDateString('id-ID') : '-'}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-success">Aktif</span>
                                            <button onClick={() => handleReturn(rent.id)} disabled={returning === rent.id}
                                                className="px-4 py-2 border border-primary text-primary text-sm rounded-lg hover:bg-primary hover:text-white transition cursor-pointer disabled:opacity-60">
                                                {returning === rent.id ? 'Memproses...' : 'Kembalikan'}
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )
                ) : (
                    history.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                            <p className="text-5xl mb-4">📚</p>
                            <p className="text-neutral font-semibold">Belum ada riwayat</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {history.map(h => (
                                <div key={h.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
                                    <div className="w-14 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                        {h.rent_books?.books?.cover && <img src={h.rent_books.books.cover} alt="" className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-neutral">{h.rent_books?.books?.name || '-'}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{h.rent_books?.books?.users?.name || '-'}</p>
                                        <p className="text-xs text-gray-400 mt-1">Selesai: {h.finished_date ? new Date(h.finished_date).toLocaleDateString('id-ID') : '-'}</p>
                                    </div>
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">Selesai</span>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </main>
        </div>
    )
}
