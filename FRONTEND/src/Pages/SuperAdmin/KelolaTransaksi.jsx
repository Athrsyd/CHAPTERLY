import React, { useEffect, useState } from 'react'
import SuperAdminSidebar from '../../Components/shared/SuperAdminSidebar'
import api from '../../services/api'

const statusStyle = {
    'Success': 'bg-green-100 text-success',
    'Pending': 'bg-yellow-100 text-yellow-600',
    'Cancelled': 'bg-red-100 text-red-500',
    'Selesai': 'bg-gray-100 text-gray-500',
    'Aktif': 'bg-green-100 text-success',
}

export default function SuperAdminKelolaTransaksi() {
    const [rents, setRents] = useState([])
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('Semua Status')

    useEffect(() => {
        Promise.all([api.get('/rent'), api.get('/rent/history')])
            .then(([r, h]) => {
                setRents(r.data.data || [])
                setHistory(h.data.data || [])
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const allTx = [
        ...rents.map((r, i) => ({
            id: `TRX-${String(i + 1).padStart(6, '0')}`,
            rawId: r.id,
            user: `User #${r.user_id}`,
            book: r.books?.name || '-',
            date: r.rent_time,
            duration: '7 Hari',
            total: r.books?.price || 0,
            status: 'Aktif',
        })),
        ...history.map((h, i) => ({
            id: `TRX-${String(rents.length + i + 1).padStart(6, '0')}`,
            rawId: h.id,
            user: `User #${h.rent_books?.user_id}`,
            book: h.rent_books?.books?.name || '-',
            date: h.finished_date,
            duration: '7 Hari',
            total: h.rent_books?.books?.price || 0,
            status: 'Selesai',
        })),
    ]

    const filtered = allTx.filter(tx => {
        const matchSearch = !search ||
            tx.id.toLowerCase().includes(search.toLowerCase()) ||
            tx.book.toLowerCase().includes(search.toLowerCase()) ||
            tx.user.toLowerCase().includes(search.toLowerCase())
        const matchStatus = statusFilter === 'Semua Status' || tx.status === statusFilter
        return matchSearch && matchStatus
    })

    return (
        <div className="flex w-full min-h-screen font-jakarta" style={{ backgroundColor: '#F9F5F0' }}>
            <SuperAdminSidebar />
            <main className="flex-1 ml-56 px-8 py-7">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral font-ebgaramond">Kelola Transaksi</h1>
                        <p className="text-gray-500 text-sm mt-1">Kelola semua transaksi penyewaan buku.</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 cursor-pointer hover:border-primary transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" className="text-gray-400"><path fill="currentColor" d="M5 22q-.825 0-1.412-.587T3 20V6q0-.825.588-1.412T5 4h1V2h2v2h8V2h2v2h1q.825 0 1.413.588T21 6v14q0 .825-.587 1.413T19 22zm0-2h14V10H5zM5 8h14V6H5z"/></svg>
                        {new Date().toLocaleDateString('id-ID', { day:'2-digit', month:'short', year:'numeric' })}
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 mb-5">
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 flex-1 max-w-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" className="text-gray-400" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"/></svg>
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari ID transaksi, user, atau judul buku..." className="text-sm outline-none bg-transparent w-full" />
                    </div>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                        className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none cursor-pointer">
                        {['Semua Status', 'Aktif', 'Selesai', 'Pending', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                    </select>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>{['No', 'ID Transaksi', 'User', 'Buku', 'Tanggal', 'Durasi', 'Total', 'Status', 'Aksi'].map(h =>
                                <th key={h} className="text-left text-xs text-gray-400 font-medium px-3 py-3">{h}</th>)}</tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                [...Array(6)].map((_, i) => <tr key={i}><td colSpan="9" className="px-3 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>)
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="9" className="text-center py-12 text-gray-400">Tidak ada transaksi ditemukan</td></tr>
                            ) : filtered.map((tx, i) => (
                                <tr key={tx.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                    <td className="px-3 py-3 text-gray-400 text-xs">{i + 1}</td>
                                    <td className="px-3 py-3 text-xs font-mono text-primary font-semibold">{tx.id}</td>
                                    <td className="px-3 py-3 text-neutral text-xs">{tx.user}</td>
                                    <td className="px-3 py-3 font-medium text-neutral text-xs max-w-32"><p className="truncate">{tx.book}</p></td>
                                    <td className="px-3 py-3 text-gray-400 text-xs">{tx.date ? new Date(tx.date).toLocaleDateString('id-ID') : '-'}</td>
                                    <td className="px-3 py-3 text-gray-500 text-xs">{tx.duration}</td>
                                    <td className="px-3 py-3 text-neutral font-semibold text-xs">Rp {Number(tx.total).toLocaleString('id-ID')}</td>
                                    <td className="px-3 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusStyle[tx.status] || 'bg-gray-100 text-gray-500'}`}>{tx.status}</span>
                                    </td>
                                    <td className="px-3 py-3">
                                        <button className="p-1.5 rounded-lg hover:bg-primary/10 text-gray-400 hover:text-primary transition cursor-pointer" title="Detail">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5"/></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!loading && (
                        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                            <p className="text-xs text-gray-400">Menampilkan {filtered.length} dari {allTx.length} transaksi</p>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map(p => (
                                    <button key={p} className={`w-7 h-7 rounded text-xs font-medium cursor-pointer ${p === 1 ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-100'}`}>{p}</button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
