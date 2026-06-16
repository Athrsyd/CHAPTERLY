import React, { useEffect, useState } from 'react'
import SuperAdminSidebar from '../../Components/shared/SuperAdminSidebar'
import api from '../../services/api'

export default function SuperAdminKelolaAdmin() {
    const [authors, setAuthors] = useState([])
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [tab, setTab] = useState('authors')
    const [search, setSearch] = useState('')
    const [actionLoading, setActionLoading] = useState(null)
    const [msg, setMsg] = useState('')

    const load = async () => {
        setLoading(true)
        try {
            const [aRes, apRes] = await Promise.all([
                api.get('/admin/authors'),
                api.get('/apply?status=pending'),
            ])
            setAuthors(aRes.data.data || [])
            setApplications(apRes.data.data || [])
        } catch { } finally { setLoading(false) }
    }

    useEffect(() => { load() }, [])

    const handleDelete = async (id) => {
        if (!confirm('Hapus author ini? Role akan dikembalikan ke reader.')) return
        setActionLoading(id)
        try {
            await api.delete(`/admin/authors/${id}`)
            setMsg('Author berhasil dihapus.')
            load()
        } catch (e) { setMsg(e.response?.data?.message || 'Gagal') }
        finally { setActionLoading(null) }
    }

    const handleReview = async (id, status) => {
        setActionLoading(id)
        try {
            await api.patch(`/apply/${id}`, { status })
            setMsg(`Lamaran berhasil ${status === 'approved' ? 'disetujui' : 'ditolak'}.`)
            load()
        } catch (e) { setMsg(e.response?.data?.message || 'Gagal') }
        finally { setActionLoading(null) }
    }

    const filtered = authors.filter(a =>
        a.name?.toLowerCase().includes(search.toLowerCase()) ||
        a.email?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="flex w-full min-h-screen font-jakarta" style={{ backgroundColor: '#F9F5F0' }}>
            <SuperAdminSidebar />
            <main className="flex-1 ml-56 px-8 py-7">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral font-ebgaramond">Kelola Penulis</h1>
                        <p className="text-gray-500 text-sm mt-1">Kelola semua data penulis yang dapat mengelola buku.</p>
                    </div>
                    {applications.length > 0 && (
                        <span className="bg-secondary text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                            {applications.length} lamaran menunggu
                        </span>
                    )}
                </div>

                {msg && (
                    <div className="mb-4 px-4 py-3 bg-green-50 text-success text-sm rounded-xl border border-green-200 flex items-center justify-between">
                        {msg}
                        <button onClick={() => setMsg('')} className="text-gray-400 hover:text-gray-600 cursor-pointer ml-3">✕</button>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-1 bg-white/60 p-1 rounded-xl mb-5 w-fit border border-gray-200">
                    {[['authors', `Daftar Admin (${authors.length})`], ['applications', `Lamaran (${applications.length})`]].map(([key, label]) => (
                        <button key={key} onClick={() => setTab(key)}
                            className={`px-5 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${tab === key ? 'text-white shadow-sm' : 'text-gray-500 hover:text-neutral'}`}
                            style={tab === key ? { backgroundColor: '#8B1E1E' } : {}}>
                            {label}
                        </button>
                    ))}
                </div>

                {tab === 'authors' ? (
                    <>
                        {/* Search */}
                        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 mb-4 max-w-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" className="text-gray-400" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"/></svg>
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama admin atau email..." className="text-sm outline-none bg-transparent w-full" />
                        </div>

                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>{['No', 'Nama', 'Email', 'Role', 'Status', 'Aksi'].map(h =>
                                        <th key={h} className="text-left text-xs text-gray-400 font-medium px-4 py-3">{h}</th>)}</tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        [...Array(5)].map((_, i) => <tr key={i}><td colSpan="6" className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>)
                                    ) : filtered.length === 0 ? (
                                        <tr><td colSpan="6" className="text-center py-12 text-gray-400">Belum ada admin</td></tr>
                                    ) : filtered.map((a, i) => (
                                        <tr key={a.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                            <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                                                        {a.name?.[0]?.toUpperCase()}
                                                    </div>
                                                    <span className="font-medium text-neutral">{a.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500">{a.email}</td>
                                            <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary font-medium">Admin</span></td>
                                            <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-success font-medium">Aktif</span></td>
                                            <td className="px-4 py-3">
                                                <button onClick={() => handleDelete(a.id)} disabled={actionLoading === a.id}
                                                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition cursor-pointer disabled:opacity-50">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 24 24"><path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zm2-4h2V8H9zm4 0h2V8h-2z"/></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {!loading && <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">Menampilkan {filtered.length} dari {authors.length} data</div>}
                        </div>
                    </>
                ) : (
                    /* Applications Tab */
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>{['No', 'Nama', 'Email', 'Alasan', 'Tanggal', 'Aksi'].map(h =>
                                    <th key={h} className="text-left text-xs text-gray-400 font-medium px-4 py-3">{h}</th>)}</tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    [...Array(3)].map((_, i) => <tr key={i}><td colSpan="6" className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>)
                                ) : applications.length === 0 ? (
                                    <tr><td colSpan="6" className="text-center py-12 text-gray-400">Tidak ada lamaran yang menunggu</td></tr>
                                ) : applications.map((app, i) => (
                                    <tr key={app.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                        <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                                        <td className="px-4 py-3 font-medium text-neutral">{app.users?.name || '-'}</td>
                                        <td className="px-4 py-3 text-gray-500">{app.users?.email || '-'}</td>
                                        <td className="px-4 py-3 text-gray-500 max-w-xs"><p className="truncate">{app.reason}</p></td>
                                        <td className="px-4 py-3 text-gray-400 text-xs">{app.applied_at ? new Date(app.applied_at).toLocaleDateString('id-ID') : '-'}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button onClick={() => handleReview(app.id, 'approved')} disabled={actionLoading === app.id}
                                                    className="px-3 py-1 bg-green-100 text-success text-xs font-semibold rounded-lg hover:bg-green-200 transition cursor-pointer disabled:opacity-50">
                                                    Setujui
                                                </button>
                                                <button onClick={() => handleReview(app.id, 'rejected')} disabled={actionLoading === app.id}
                                                    className="px-3 py-1 bg-red-100 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-200 transition cursor-pointer disabled:opacity-50">
                                                    Tolak
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {!loading && <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">Menampilkan {applications.length} lamaran pending</div>}
                    </div>
                )}
            </main>
        </div>
    )
}
