import React, { useEffect, useRef, useState } from 'react'
import AdminSidebar from '../../Components/shared/AdminSidebar'
import useAuth from '../../Hooks/useAuth'
import api from '../../services/api'

const genres = ['Romance', 'Fantasy', 'Mystery', 'Adventure', 'Thriller', 'Fiction', 'Horror', 'Historical', 'Other']

const emptyForm = { name: '', genre: '', price: '', rate: '0', description: '', stock: '' }

const MAX_SIZE_KB = 2048
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg']
const ALLOWED_EXT  = /\.(png|jpe?g)$/i

// ── Cover Upload Component ───────────────────────────────────
function CoverUpload({ preview, onChange, error }) {
    const inputRef = useRef()

    const handleFile = (file) => {
        if (!file) return
        if (!ALLOWED_TYPES.includes(file.type) || !ALLOWED_EXT.test(file.name)) {
            onChange(null, 'Format tidak valid. Gunakan .png, .jpg, atau .jpeg')
            return
        }
        if (file.size > MAX_SIZE_KB * 1024) {
            onChange(null, `Ukuran file terlalu besar. Maksimal ${MAX_SIZE_KB} KB`)
            return
        }
        const objectUrl = URL.createObjectURL(file)
        onChange(file, null, objectUrl)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        handleFile(file)
    }

    return (
        <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">
                Cover Buku <span className="text-gray-400 font-normal">(PNG, JPG, JPEG — maks. 2048 KB)</span>
            </label>
            <div
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                onClick={() => inputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed cursor-pointer transition-all
                    ${error ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 hover:border-primary hover:bg-primary/5'}`}
                style={{ minHeight: preview ? 'auto' : '140px' }}
            >
                {preview ? (
                    <div className="relative w-full flex justify-center py-3">
                        <img src={preview} alt="preview" className="h-36 w-auto rounded-lg object-cover shadow" />
                        <button
                            type="button"
                            onClick={e => { e.stopPropagation(); onChange(null, null, null) }}
                            className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition cursor-pointer"
                        >✕</button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2 py-6 px-4 text-center">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.6em" height="1.6em" viewBox="0 0 24 24" className="text-primary">
                                <path fill="currentColor" d="M11 16V7.85l-2.6 2.6L7 9l5-5l5 5l-1.4 1.45l-2.6-2.6V16zm-5 4q-.825 0-1.412-.587T4 18v-3h2v3h12v-3h2v3q0 .825-.587 1.413T18 20z"/>
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-600">Klik atau drag & drop gambar di sini</p>
                        <p className="text-xs text-gray-400">PNG, JPG, JPEG • Maks. 2048 KB</p>
                    </div>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                    className="hidden"
                    onChange={e => handleFile(e.target.files[0])}
                />
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    )
}

// ── Main Page ────────────────────────────────────────────────
export default function AdminKelolaBuku() {
    const { user } = useAuth()
    const [books, setBooks]         = useState([])
    const [loading, setLoading]     = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [form, setForm]           = useState(emptyForm)
    const [coverFile, setCoverFile] = useState(null)       // File object
    const [coverPreview, setCoverPreview] = useState(null) // Object URL / existing URL
    const [coverError, setCoverError]     = useState('')
    const [editId, setEditId]       = useState(null)
    const [saving, setSaving]       = useState(false)
    const [msg, setMsg]             = useState('')
    const [search, setSearch]       = useState('')
    const [genreFilter, setGenreFilter] = useState('Semua Genre')

    const load = async () => {
        try {
            const res = await api.get('/books')
            setBooks((res.data.data || []).filter(b => b.author_id === user?.id))
        } catch { } finally { setLoading(false) }
    }

    useEffect(() => { load() }, [user])

    const openAdd = () => {
        setForm(emptyForm)
        setCoverFile(null); setCoverPreview(null); setCoverError('')
        setEditId(null); setMsg(''); setShowModal(true)
    }

    const openEdit = (b) => {
        setForm({ name: b.name, genre: b.genre || '', price: b.price, rate: b.rate, description: b.description || '', stock: b.stock || '' })
        setCoverFile(null)
        setCoverPreview(b.cover || null)   // tampilkan cover lama
        setCoverError('')
        setEditId(b.id); setMsg(''); setShowModal(true)
    }

    const handleCoverChange = (file, err, preview) => {
        setCoverFile(file)
        setCoverPreview(preview)
        setCoverError(err || '')
    }

    const handleSave = async () => {
        if (!form.name || !form.price) return setMsg('Nama dan harga wajib diisi')
        if (coverError) return setMsg(coverError)

        setSaving(true); setMsg('')
        try {
            // Gunakan FormData karena ada file upload
            const fd = new FormData()
            fd.append('name', form.name)
            fd.append('price', form.price)
            fd.append('genre', form.genre || '')
            fd.append('rate', form.rate || '0')
            fd.append('stock', form.stock || '100')
            fd.append('description', form.description || '')
            if (coverFile) fd.append('cover', coverFile)

            if (editId) {
                await api.put(`/books/${editId}`, fd)
            } else {
                await api.post('/books', fd)
            }
            setShowModal(false)
            load()
        } catch (e) {
            setMsg(e.response?.data?.message || 'Gagal menyimpan buku')
        } finally { setSaving(false) }
    }

    const handleDelete = async (id) => {
        if (!confirm('Hapus buku ini?')) return
        try { await api.delete(`/books/${id}`); load() }
        catch (e) { alert(e.response?.data?.message || 'Gagal menghapus') }
    }

    const filtered = books.filter(b => {
        const matchSearch = b.name?.toLowerCase().includes(search.toLowerCase())
        const matchGenre  = genreFilter === 'Semua Genre' || b.genre === genreFilter
        return matchSearch && matchGenre
    })

    return (
        <div className="flex w-full min-h-screen bg-gray-50 font-jakarta">
            <AdminSidebar />
            <main className="flex-1 ml-64 px-8 py-7">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral font-ebgaramond">Kelola Buku</h1>
                        <p className="text-gray-500 text-sm mt-1">Kelola semua buku yang tersedia di Chapterly.</p>
                    </div>
                    <button onClick={openAdd}
                        className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition cursor-pointer">
                        + Tambah Buku
                    </button>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 mb-5">
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 flex-1 max-w-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" className="text-gray-400" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"/></svg>
                        <input value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Cari judul buku, penulis..."
                            className="text-sm outline-none bg-transparent w-full" />
                    </div>
                    <select value={genreFilter} onChange={e => setGenreFilter(e.target.value)}
                        className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none cursor-pointer">
                        <option>Semua Genre</option>
                        {genres.map(g => <option key={g}>{g}</option>)}
                    </select>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>{['Cover', 'Judul Buku', 'Penulis', 'Genre', 'Harga Sewa', 'Stok', 'Aksi'].map(h =>
                                <th key={h} className="text-left text-xs text-gray-400 font-medium px-4 py-3">{h}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                [...Array(5)].map((_, i) =>
                                    <tr key={i}><td colSpan="7" className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>)
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="7" className="text-center py-12 text-gray-400">
                                    Tidak ada buku.{' '}
                                    <button onClick={openAdd} className="text-primary underline cursor-pointer">Tambah buku</button>
                                </td></tr>
                            ) : filtered.map(b => (
                                <tr key={b.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                    <td className="px-4 py-3">
                                        <div className="w-10 h-14 bg-gray-100 rounded overflow-hidden">
                                            {b.cover
                                                ? <img src={b.cover} alt="" className="w-full h-full object-cover" />
                                                : <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2M8.5 13.5l2.5 3.01L14.5 12l4.5 6H5z"/></svg>
                                                  </div>}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-neutral truncate max-w-36">{b.name}</p>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 text-xs">{b.users?.name || user?.name}</td>
                                    <td className="px-4 py-3">
                                        {b.genre && <span className="px-2 py-0.5 rounded-full text-xs bg-tertiary text-primary">{b.genre}</span>}
                                    </td>
                                    <td className="px-4 py-3 text-neutral font-medium">Rp {Number(b.price).toLocaleString('id-ID')}</td>
                                    <td className="px-4 py-3 text-neutral">{b.stock ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => openEdit(b)}
                                                className="p-1.5 rounded-lg hover:bg-primary/10 text-gray-400 hover:text-primary transition cursor-pointer">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 24 24"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83l3.75 3.75z"/></svg>
                                            </button>
                                            <button onClick={() => handleDelete(b.id)}
                                                className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition cursor-pointer">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 24 24"><path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zm2-4h2V8H9zm4 0h2V8h-2z"/></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!loading && (
                        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
                            Menampilkan {filtered.length} dari {books.length} data
                        </div>
                    )}
                </div>
            </main>

            {/* ── Modal Tambah / Edit ── */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                            <h2 className="text-lg font-bold text-neutral">
                                {editId ? 'Edit Buku' : 'Tambah Buku Baru'}
                            </h2>
                            <button onClick={() => setShowModal(false)}
                                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer text-lg transition">✕</button>
                        </div>

                        <div className="px-6 py-4">
                            {msg && (
                                <div className="mb-4 px-3 py-2.5 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                    {msg}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                {/* Cover Upload */}
                                <CoverUpload
                                    preview={coverPreview}
                                    onChange={handleCoverChange}
                                    error={coverError}
                                />

                                {/* Judul */}
                                <div className="col-span-2">
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Judul Buku *</label>
                                    <input
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        placeholder="Masukkan judul buku"
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary transition" />
                                </div>

                                {/* Genre */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Genre</label>
                                    <select
                                        value={form.genre}
                                        onChange={e => setForm({ ...form, genre: e.target.value })}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary cursor-pointer transition">
                                        <option value="">Pilih genre</option>
                                        {genres.map(g => <option key={g}>{g}</option>)}
                                    </select>
                                </div>

                                {/* Rating */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Rating (0–5)</label>
                                    <input
                                        type="number" min="0" max="5"
                                        value={form.rate}
                                        onChange={e => setForm({ ...form, rate: e.target.value })}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary transition" />
                                </div>

                                {/* Harga */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Harga Sewa (Rp) *</label>
                                    <input
                                        type="number"
                                        value={form.price}
                                        onChange={e => setForm({ ...form, price: e.target.value })}
                                        placeholder="Contoh: 15000"
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary transition" />
                                </div>

                                {/* Stok */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Stok Buku</label>
                                    <input
                                        type="number"
                                        value={form.stock}
                                        onChange={e => setForm({ ...form, stock: e.target.value })}
                                        placeholder="Contoh: 100"
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary transition" />
                                </div>

                                {/* Deskripsi */}
                                <div className="col-span-2">
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Deskripsi</label>
                                    <textarea
                                        rows={3}
                                        value={form.description}
                                        onChange={e => setForm({ ...form, description: e.target.value })}
                                        placeholder="Masukkan deskripsi buku..."
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary resize-none transition" />
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex gap-3 px-6 pb-5 sticky bottom-0 bg-white pt-3 border-t border-gray-100">
                            <button onClick={() => setShowModal(false)}
                                className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 cursor-pointer transition">
                                Batal
                            </button>
                            <button onClick={handleSave} disabled={saving}
                                className="flex-1 bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 cursor-pointer transition">
                                {saving ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                        </svg>
                                        Menyimpan...
                                    </span>
                                ) : 'Simpan Buku'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
