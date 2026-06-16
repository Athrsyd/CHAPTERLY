import React, { useEffect, useState } from 'react'
import AdminSidebar from '../../Components/shared/AdminSidebar'
import api from '../../services/api'

const statusStyles = {
    'Aktif': 'bg-green-100 text-success',
    'Selesai': 'bg-gray-100 text-gray-500',
    'Pending': 'bg-yellow-100 text-yellow-700',
    'Cancelled': 'bg-red-100 text-red-600',
}

export default function AdminDataPenyewaan() {
    const [rents, setRents] = useState([])
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        Promise.all([api.get('/rent'), api.get('/rent/history')])
            .then(([r, h]) => { setRents(r.data.data || []); setHistory(h.data.data || []) })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const allData = [
        ...rents.map(r => ({ ...r, bookName: r.books?.name, status: 'Aktif', date: r.rent_time, price: r.books?.price })),
        ...history.map(h => ({ ...h, bookName: h.rent_books?.books?.name, status: 'Selesai', date: h.finished_date, price: h.rent_books?.books?.price }))
    ].filter(x => !search || x.bookName?.toLowerCase().includes(search.toLowerCase()))

    const totalTx = allData.length
    const popularBook = rents.reduce((acc, r) => {
        const n = r.books?.name; if (!n) return acc
        acc[n] = (acc[n] || 0) + 1; return acc
    }, {})
    const topBook = Object.entries(popularBook).sort((a, b) => b[1] - a[1])[0]

    return (
        <div className="flex w-full min-h-screen bg-gray-50 font-jakarta">
            <AdminSidebar />
            <main className="flex-1 ml-64 px-8 py-7">
                <h1 className="text-2xl font-bold text-neutral font-ebgaramond mb-1">Data Penyewaan</h1>
                <p className="text-gray-500 text-sm mb-6">Lihat semua transaksi penyewaan buku.</p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24" className="text-primary"><path fill="currentColor" d="M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2M4 19V5h16v3h-6c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h6v3zm16-9v4h-6v-4z"/></svg>
                        </div>
                        <div><p className="text-xs text-gray-400">Total Penyewaan</p><p className="text-2xl font-bold text-neutral">{totalTx}</p><p className="text-xs text-gray-400">Transaksi</p></div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
                        <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24" className="text-secondary"><path fill="currentColor" d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08z"/></svg>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Buku Paling Disewa</p>
                            <p className="text-sm font-bold text-neutral truncate max-w-48">{topBook?.[0] || '-'}</p>
                            <p className="text-xs text-gray-400">{topBook?.[1] || 0} kali disewa</p>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 mb-4 max-w-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" className="text-gray-400" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"/></svg>
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama user atau judul buku..." className="text-sm outline-none bg-transparent w-full" />
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>{['User', 'Judul Buku', 'Tanggal', 'Harga', 'Status'].map(h =>
                                <th key={h} className="text-left text-xs text-gray-400 font-medium px-4 py-3">{h}</th>)}</tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                [...Array(5)].map((_, i) => <tr key={i}><td colSpan="5" className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse"/></td></tr>)
                            ) : allData.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-12 text-gray-400">Belum ada data penyewaan</td></tr>
                            ) : allData.map((item, i) => (
                                <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                                                {(item.user_id || i).toString()[0]}
                                            </div>
                                            <span className="text-neutral text-xs">User #{item.user_id || '-'}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-neutral font-medium max-w-36 truncate">{item.bookName || '-'}</td>
                                    <td className="px-4 py-3 text-gray-500 text-xs">{item.date ? new Date(item.date).toLocaleDateString('id-ID') : '-'}</td>
                                    <td className="px-4 py-3 text-neutral font-medium">Rp {Number(item.price || 0).toLocaleString('id-ID')}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[item.status] || 'bg-gray-100 text-gray-500'}`}>{item.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!loading && <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">Menampilkan {allData.length} data</div>}
                </div>
            </main>
        </div>
    )
}
