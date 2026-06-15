import React, { useState, useEffect, useRef } from 'react'
import AdminLayout from '../../Components/Admin/AdminLayout'
import api from '../../services/api'

function IconPlus() { return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z"/></svg> }
function IconEdit() { return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M5 19h1.425L16.2 9.225L14.775 7.8L5 17.575zm-2 2v-4.25l10.575-10.55q.3-.275.663-.425t.762-.15t.775.15t.65.45L17.25 7.65q.275.3.413.663t.137.762q0 .4-.137.763t-.413.662L6.25 21zM19 21v-2h2v2zm-4-14.575l-1.425-1.425zM13.75 8.5L13 7.775L14.775 9.5z"/></svg> }
function IconDelete() { return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"/></svg> }
function IconSearch() { return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"/></svg> }
function IconX() { return <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/></svg> }
function IconUpload() { return <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="M11 16V7.85l-2.6 2.6L7 9l5-5l5 5l-1.4 1.45L13 7.85V16zm-5 4q-.825 0-1.412-.587T4 18v-3h2v3h12v-3h2v3q0 .825-.587 1.413T18 20z"/></svg> }

const GENRES = ['Romance', 'Fantasy', 'Mystery', 'Adventure', 'Thriller', 'Fiction', 'Horror', 'Historical', 'Humor', 'Poetry']
const RATES = [0, 1, 2, 3, 4, 5]

function BookModal({ book, onClose, onSaved }) {
    const isEdit = !!book?.id
    const [form, setForm] = useState({
        name: book?.name || '',
        cover: book?.cover || '',
        genre: book?.genre || '',
        price: book?.price || '',
        rate: book?.rate || 0,
        description: book?.description || '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.name || !form.price) { setError('Judul buku dan harga sewa wajib diisi'); return }
        setLoading(true)
        try {
            const payload = { ...form, price: parseFloat(form.price), rate: parseInt(form.rate) }
            if (isEdit) {
                await api.put(`/books/${book.id}`, payload)
            } else {
                await api.post('/books', payload)
            }
            onSaved()
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal menyimpan buku')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-neutral">{isEdit ? 'Edit Buku' : 'Tambah Buku Baru'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><IconX /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6">
                    {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">{error}</div>}
                    <div className="flex gap-6">
                        {/* Cover preview */}
                        <div className="w-36 shrink-0">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Cover Buku</label>
                            <div className="w-36 h-48 rounded-xl border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50 relative group cursor-pointer hover:border-primary transition-colors">
                                {form.cover ? (
                                    <img src={form.cover} alt="Cover" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center text-gray-300">
                                        <IconUpload />
                                        <span className="text-xs mt-1">Upload Cover</span>
                                        <span className="text-xs text-gray-200">PNG, JPG max 2MB</span>
                                    </div>
                                )}
                            </div>
                            <input
                                type="url"
                                name="cover"
                                placeholder="URL Cover"
                                value={form.cover}
                                onChange={handleChange}
                                className="mt-2 border border-gray-200 rounded-lg px-3 py-2 text-xs w-full outline-none focus:border-primary"
                            />
                        </div>

                        <div className="flex-1 flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Judul Buku</label>
                                <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Masukkan judul buku" className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors" />
                            </div>
                            <div className="flex gap-3">
                                <div className="flex flex-col gap-1.5 flex-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Genre</label>
                                    <select name="genre" value={form.genre} onChange={handleChange} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors">
                                        <option value="">Pilih genre</option>
                                        {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1.5 flex-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Rating</label>
                                    <select name="rate" value={form.rate} onChange={handleChange} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors">
                                        {RATES.map(r => <option key={r} value={r}>{r} {r > 0 ? '★' : '(Belum di-rating)'}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Harga Sewa (Rp)</label>
                                <input type="number" name="price" value={form.price} onChange={handleChange} required min="0" placeholder="Masukkan harga sewa" className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Deskripsi</label>
                                <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Masukkan deskripsi buku..." className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors resize-none" />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-6 justify-end">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Batal</button>
                        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-60">
                            {loading ? 'Menyimpan...' : 'Simpan Buku'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

function ConfirmModal({ title, desc, onConfirm, onCancel, loading }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
                <h3 className="text-lg font-bold text-neutral mb-2">{title}</h3>
                <p className="text-sm text-gray-500 mb-6">{desc}</p>
                <div className="flex gap-3 justify-end">
                    <button onClick={onCancel} className="px-5 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Batal</button>
                    <button onClick={onConfirm} disabled={loading} className="px-5 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 disabled:opacity-60">{loading ? 'Menghapus...' : 'Hapus'}</button>
                </div>
            </div>
        </div>
    )
}

const AdminBooks = () => {
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [genreFilter, setGenreFilter] = useState('Semua')
    const [modal, setModal] = useState(null) // null | { type: 'add' | 'edit' | 'delete', book }
    const [toast, setToast] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const PER_PAGE = 8

    useEffect(() => { fetchBooks() }, [genreFilter])

    const fetchBooks = async () => {
        setLoading(true)
        try {
            const params = genreFilter !== 'Semua' ? { genre: genreFilter } : {}
            const res = await api.get('/books', { params })
            setBooks(res.data.data || [])
        } catch { setBooks([]) }
        finally { setLoading(false) }
    }

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3000)
    }

    const handleSaved = () => {
        setModal(null)
        fetchBooks()
        showToast(modal?.type === 'edit' ? 'Buku berhasil diperbarui!' : 'Buku berhasil ditambahkan!')
    }

    const handleDelete = async () => {
        try {
            await api.delete(`/books/${modal.book.id}`)
            setModal(null)
            fetchBooks()
            showToast('Buku berhasil dihapus!')
        } catch (err) {
            showToast(err.response?.data?.message || 'Gagal menghapus buku', 'error')
        }
    }

    const filtered = books.filter(b => {
        const q = search.toLowerCase()
        return !q || b.name?.toLowerCase().includes(q) || b.users?.name?.toLowerCase().includes(q)
    })

    const totalPages = Math.ceil(filtered.length / PER_PAGE)
    const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

    return (
        <AdminLayout>
            {toast && (
                <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${toast.type === 'success' ? 'bg-success' : 'bg-red-600'}`}>{toast.msg}</div>
            )}
            {modal?.type === 'add' && <BookModal book={null} onClose={() => setModal(null)} onSaved={handleSaved} />}
            {modal?.type === 'edit' && <BookModal book={modal.book} onClose={() => setModal(null)} onSaved={handleSaved} />}
            {modal?.type === 'delete' && (
                <ConfirmModal
                    title="Hapus Buku"
                    desc={`Apakah kamu yakin ingin menghapus "${modal.book.name}"? Tindakan ini tidak dapat dibatalkan.`}
                    onConfirm={handleDelete}
                    onCancel={() => setModal(null)}
                />
            )}

            <header className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-neutral font-ebgaramond">Kelola Buku</h1>
                    <p className="text-gray-500 text-sm mt-0.5">Kelola semua buku yang tersedia di Chapterly.</p>
                </div>
                <button onClick={() => setModal({ type: 'add' })} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors">
                    <IconPlus /> + Tambah Buku
                </button>
            </header>

            {/* Filters */}
            <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 w-72 shadow-sm">
                    <span className="text-gray-400"><IconSearch /></span>
                    <input type="text" placeholder="Cari judul buku atau penulis..." value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1) }} className="bg-transparent outline-none text-sm text-gray-600 placeholder-gray-400 w-full" />
                </div>
                <select value={genreFilter} onChange={e => { setGenreFilter(e.target.value); setCurrentPage(1) }} className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 outline-none shadow-sm">
                    <option value="Semua">Semua Genre</option>
                    {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50">
                            <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">No</th>
                            <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Cover</th>
                            <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Judul Buku</th>
                            <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Penulis</th>
                            <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Genre</th>
                            <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Harga Sewa</th>
                            <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Rating</th>
                            <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <tr key={i} className="border-b border-gray-50">
                                    {Array.from({ length: 8 }).map((_, j) => <td key={j} className="px-5 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>)}
                                </tr>
                            ))
                        ) : paginated.length === 0 ? (
                            <tr><td colSpan={8} className="text-center py-12 text-gray-400">Tidak ada buku ditemukan</td></tr>
                        ) : (
                            paginated.map((book, idx) => (
                                <tr key={book.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-3 text-gray-400">{(currentPage - 1) * PER_PAGE + idx + 1}</td>
                                    <td className="px-5 py-3">
                                        <div className="w-9 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
                                            {book.cover && <img src={book.cover} alt={book.name} className="w-full h-full object-cover" />}
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 font-medium text-neutral max-w-40 truncate">{book.name}</td>
                                    <td className="px-5 py-3 text-gray-500">{book.users?.name || '—'}</td>
                                    <td className="px-5 py-3"><span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{book.genre || '—'}</span></td>
                                    <td className="px-5 py-3 text-primary font-semibold">Rp {book.price?.toLocaleString('id-ID')}</td>
                                    <td className="px-5 py-3">
                                        {book.rate > 0 ? <span className="text-secondary font-semibold">★ {book.rate}</span> : <span className="text-gray-300">—</span>}
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => setModal({ type: 'edit', book })} className="text-primary hover:bg-primary/10 p-1.5 rounded-lg transition-colors"><IconEdit /></button>
                                            <button onClick={() => setModal({ type: 'delete', book })} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"><IconDelete /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-xs text-gray-400">Menampilkan {(currentPage-1)*PER_PAGE+1} - {Math.min(currentPage*PER_PAGE, filtered.length)} dari {filtered.length} data</p>
                        <div className="flex gap-1">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button key={i} onClick={() => setCurrentPage(i+1)} className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${currentPage === i+1 ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'}`}>{i+1}</button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}

export default AdminBooks
ENDOFFILE