import React, { useEffect, useState } from 'react'
import SuperAdminSidebar from '../../Components/shared/SuperAdminSidebar'
import api from '../../services/api'

export default function SuperAdminKelolaUser() {
    // Note: Supabase doesn't expose a users list endpoint by default.
    // We pull from /admin/authors and show what we can; a real implementation
    // would need a dedicated /admin/users endpoint in the Flask backend.
    const [authors, setAuthors] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('Semua Status')

    useEffect(() => {
        api.get('/admin/authors')
            .then(res => setAuthors(res.data.data || []))
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    // We show authors as a proxy for "managed users" since the backend
    // doesn't expose a full user list endpoint yet.
    const filtered = authors.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="flex w-full min-h-screen font-jakarta" style={{ backgroundColor: '#F9F5F0' }}>
            <SuperAdminSidebar />
            <main className="flex-1 ml-56 px-8 py-7">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral font-ebgaramond">Kelola User</h1>
                        <p className="text-gray-500 text-sm mt-1">Kelola semua data user yang terdaftar di Chapterly.</p>
                    </div>
                    {/* <button className="flex items-center gap-2 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 transition cursor-pointer"
                        style={{ backgroundColor: '#8B1E1E' }}>
                        + Tambah User
                    </button> */}
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 mb-5">
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 flex-1 max-w-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" className="text-gray-400" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"/></svg>
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama user atau email..." className="text-sm outline-none bg-transparent w-full" />
                    </div>
                    {/* <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                        className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none cursor-pointer">
                        {['Semua Status', 'Aktif', 'Nonaktif'].map(s => <option key={s}>{s}</option>)}
                    </select> */}
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>{['No', 'Nama', 'Email', 'Tanggal Daftar', 'Status', 'Aksi'].map(h =>
                                <th key={h} className="text-left text-xs text-gray-400 font-medium px-4 py-3">{h}</th>)}</tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                [...Array(6)].map((_, i) => <tr key={i}><td colSpan="6" className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>)
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-12 text-gray-400">Tidak ada data user</td></tr>
                            ) : filtered.map((u, i) => (
                                <tr key={u.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                    <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                                                {u.name?.[0]?.toUpperCase()}
                                            </div>
                                            <span className="font-medium text-neutral">{u.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                                    <td className="px-4 py-3 text-gray-400 text-xs">{new Date().toLocaleDateString('id-ID')}</td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-success font-medium">Aktif</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button className="p-1.5 rounded-lg hover:bg-primary/10 text-gray-400 hover:text-primary transition cursor-pointer">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 24 24"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83l3.75 3.75z"/></svg>
                                            </button>
                                            <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition cursor-pointer">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 24 24"><path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zm2-4h2V8H9zm4 0h2V8h-2z"/></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!loading && (
                        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                            <p className="text-xs text-gray-400">Menampilkan 1 - {filtered.length} dari {authors.length} data</p>
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
