import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from '../../Components/shared/AdminSidebar'
import useAuth from '../../Hooks/useAuth'
import api from '../../services/api'

export default function AdminDashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [books, setBooks] = useState([])
    const [rents, setRents] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([api.get('/books'), api.get('/rent')])
            .then(([b, r]) => { setBooks(b.data.data || []); setRents(r.data.data || []) })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const myBooks = books.filter(b => b.author_id === user?.id)
    const totalRevenue = rents.length * 0 // placeholder

    const stats = [
        { label: 'Total Buku', value: myBooks.length, unit: 'Buku', color: 'bg-primary', icon:<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
	<path fill="currentColor" d="M19 18H9a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h1v5l2-1.5L14 7V2h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2m-2 2v2H5a2 2 0 0 1-2-2V6h2v14z"></path>
</svg> },
        { label: 'Total Penyewaan', value: rents.length, unit: 'Transaksi', color: 'bg-primary', icon: <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
	<g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
		<path strokeMiterlimit={5.759} d="M3 3v16a2 2 0 0 0 2 2h16"></path>
		<path strokeMiterlimit={5.759} d="m7 14l4-4l4 4l6-6"></path>
		<path d="M18 8h3v3"></path>
	</g>
</svg> },
        { label: 'Buku Terpopuler', value: myBooks[0]?.name || '-', unit: 'Terpopuler', color: 'bg-neutral', icon: <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
	<path fill="currentColor" d="m12 17.275l-4.15 2.5q-.275.175-.575.15t-.525-.2t-.35-.437t-.05-.588l1.1-4.725L3.775 10.8q-.25-.225-.312-.513t.037-.562t.3-.45t.55-.225l4.85-.425l1.875-4.45q.125-.3.388-.45t.537-.15t.537.15t.388.45l1.875 4.45l4.85.425q.35.05.55.225t.3.45t.038.563t-.313.512l-3.675 3.175l1.1 4.725q.075.325-.05.588t-.35.437t-.525.2t-.575-.15z"></path>
</svg> },
    ]

    return (
        <div className="flex w-full min-h-screen bg-gray-50 font-jakarta">
            <AdminSidebar />
            <main className="flex-1 ml-64 px-8 py-7">
                {/* Header */}
                <div className="flex items-center justify-between mb-7">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral font-ebgaramond">Halo, {user?.name} </h1>
                        <p className="text-gray-500 text-sm mt-1">Kelola katalog buku dan pantau penyewaan dengan mudah.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 cursor-pointer">
                            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                                {user?.name?.[0]?.toUpperCase() || 'A'}
                            </div>
                            <span className="text-sm font-medium text-neutral">{user?.name}</span>
                        </div>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-3 gap-4 mb-7">
                    {stats.map(s => (
                        <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-2xl">{s.icon}</span>
                                <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">{s.label}</span>
                            </div>
                            <p className="text-2xl font-bold text-neutral font-ebgaramond">{s.value}</p>
                            <p className="text-xs text-gray-400 mt-1">{s.unit}</p>
                        </div>
                    ))}
                </div>

                {/* Buku Terbaru Table */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-bold text-neutral">Buku Terbaru</h2>
                        <button onClick={() => navigate('/admin/kelola-buku')} className="text-primary text-sm hover:underline cursor-pointer">Lihat Semua &rsaquo;</button>
                    </div>
                    {loading ? <div className="h-40 animate-pulse bg-gray-50 rounded-xl" /> : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    {['Buku', 'Genre', 'Harga Sewa', 'Stok', 'Status', 'Aksi'].map(h => (
                                        <th key={h} className="text-left text-xs text-gray-400 font-medium pb-3">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {myBooks.slice(0, 5).map(b => (
                                    <tr key={b.id} className="border-b border-gray-50 last:border-0">
                                        <td className="py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-14 bg-gray-100 rounded overflow-hidden shrink-0">
                                                    {b.cover && <img src={b.cover} alt="" className="w-full h-full object-cover" />}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-neutral truncate max-w-36">{b.name}</p>
                                                    <p className="text-xs text-gray-400">{b.users?.name || user?.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className="px-2 py-0.5 rounded-full text-xs bg-tertiary text-primary">{b.genre || '-'}</span></td>
                                        <td className="text-neutral font-medium">Rp {Number(b.price).toLocaleString('id-ID')}</td>
                                        <td className="text-neutral">{b.stock ?? '120'}</td>
                                        <td><span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-success font-medium">Aktif</span></td>
                                        <td>
                                            <button onClick={() => navigate('/admin/kelola-buku')} className="text-gray-400 hover:text-primary cursor-pointer">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83l3.75 3.75z"/></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {myBooks.length === 0 && (
                                    <tr><td colSpan="6" className="text-center py-8 text-gray-400 text-sm">Belum ada buku. <button onClick={() => navigate('/admin/kelola-buku')} className="text-primary underline cursor-pointer">Tambah buku</button></td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    )
}
