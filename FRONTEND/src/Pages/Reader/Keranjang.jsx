import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReaderSidebar from '../../Components/shared/ReaderSidebar'
import { useCart } from '../../Context/CartContext'
import api from '../../services/api'

export default function ReaderKeranjang() {
    const navigate = useNavigate()
    const { items, removeFromCart, clearCart, totalPrice } = useCart()

    const [loading, setLoading]   = useState(false)
    const [results, setResults]   = useState([])   // [{bookName, status, msg}]
    const [done, setDone]         = useState(false)

    // ── Checkout: foreach loop tiap buku POST ke /rent ───────
    const handleCheckout = async () => {
        if (items.length === 0) return
        setLoading(true)
        setResults([])

        const hasil = []

        for (const book of items) {
            try {
                await api.post('/rent', { book_id: book.id })
                hasil.push({ bookName: book.name, status: 'success', msg: 'Berhasil disewa' })
            } catch (e) {
                const msg = e.response?.data?.message || 'Gagal menyewa'
                hasil.push({ bookName: book.name, status: 'error', msg })
            }
        }

        setResults(hasil)
        setDone(true)
        setLoading(false)

        // Hapus dari keranjang hanya yang berhasil
        const successIds = items
            .filter((_, i) => hasil[i]?.status === 'success')
            .map(b => b.id)
        successIds.forEach(id => removeFromCart(id))
    }

    const handleSelesai = () => {
        setDone(false)
        setResults([])
        navigate('/transaksi')
    }

    const successCount = results.filter(r => r.status === 'success').length
    const errorCount   = results.filter(r => r.status === 'error').length

    return (
        <div className="flex w-full min-h-screen bg-gray-50 font-jakarta">
            <ReaderSidebar />
            <main className="flex-1 ml-64 px-8 py-7">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-neutral font-ebgaramond">Keranjang Sewa</h1>
                    <p className="text-gray-500 text-sm mt-1">Periksa buku pilihanmu sebelum menyewa</p>
                </div>

                {/* ── Hasil Checkout ── */}
                {done && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                        <h2 className="font-bold text-neutral mb-4 text-lg">Hasil Penyewaan</h2>
                        <div className="space-y-2 mb-5">
                            {results.map((r, i) => (
                                <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm
                                    ${r.status === 'success' ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
                                    {r.status === 'success'
                                        ? <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" className="text-success shrink-0"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8z"/></svg>
                                        : <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" className="text-red-500 shrink-0"><path fill="currentColor" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m5 13.59L15.59 17L12 13.41L8.41 17L7 15.59L10.59 12L7 8.41L8.41 7L12 10.59L15.59 7L17 8.41L13.41 12z"/></svg>}
                                    <div className="flex-1">
                                        <span className="font-semibold text-neutral">{r.bookName}</span>
                                        <span className={`ml-2 ${r.status === 'success' ? 'text-success' : 'text-red-500'}`}>— {r.msg}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={`px-4 py-3 rounded-xl text-sm font-medium mb-4
                            ${errorCount === 0 ? 'bg-green-50 text-success' : successCount === 0 ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-700'}`}>
                            {successCount > 0 && `${successCount} buku berhasil disewa. `}
                            {errorCount > 0 && `${errorCount} buku gagal disewa.`}
                        </div>

                        <button onClick={handleSelesai}
                            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition cursor-pointer">
                            Lihat Transaksi Saya
                        </button>
                    </div>
                )}

                {/* ── Keranjang Kosong ── */}
                {!done && items.length === 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
                        <div className="text-6xl mb-4">🛒</div>
                        <p className="text-neutral font-semibold text-lg mb-1">Keranjang masih kosong</p>
                        <p className="text-gray-400 text-sm mb-6">Tambahkan buku dari halaman detail buku</p>
                        <button onClick={() => navigate('/books')}
                            className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition cursor-pointer">
                            Jelajahi Buku
                        </button>
                    </div>
                )}

                {/* ── Daftar Item Keranjang ── */}
                {!done && items.length > 0 && (
                    <div className="flex gap-6">
                        {/* List buku */}
                        <div className="flex-1 space-y-3">
                            {items.map(book => (
                                <div key={book.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
                                    {/* Cover */}
                                    <div className="w-14 h-20 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                        {book.cover
                                            ? <img src={book.cover} alt={book.name} className="w-full h-full object-cover" />
                                            : <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs text-center p-1">{book.name}</div>}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-neutral truncate">{book.name}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{book.users?.name || '-'}</p>
                                        {book.genre && (
                                            <span className="inline-block mt-1 text-xs bg-tertiary text-primary px-2 py-0.5 rounded-full">{book.genre}</span>
                                        )}
                                    </div>

                                    {/* Harga */}
                                    <div className="text-right shrink-0">
                                        <p className="font-bold text-primary">Rp {Number(book.price || 0).toLocaleString('id-ID')}</p>
                                        <p className="text-xs text-gray-400">/ 7 Hari</p>
                                    </div>

                                    {/* Hapus */}
                                    <button onClick={() => removeFromCart(book.id)}
                                        className="p-2 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition cursor-pointer shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zm2-4h2V8H9zm4 0h2V8h-2z"/></svg>
                                    </button>
                                </div>
                            ))}

                            {/* Kosongkan keranjang */}
                            <button onClick={clearCart}
                                className="text-sm text-gray-400 hover:text-red-400 transition cursor-pointer flex items-center gap-1 mt-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zm2-4h2V8H9zm4 0h2V8h-2z"/></svg>
                                Kosongkan keranjang
                            </button>
                        </div>

                        {/* Ringkasan */}
                        <div className="w-72 shrink-0">
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sticky top-6">
                                <h2 className="font-bold text-neutral mb-4">Ringkasan Pesanan</h2>

                                <div className="space-y-2 mb-4">
                                    {items.map(book => (
                                        <div key={book.id} className="flex justify-between text-sm">
                                            <span className="text-gray-500 truncate max-w-36">{book.name}</span>
                                            <span className="text-neutral font-medium shrink-0 ml-2">Rp {Number(book.price || 0).toLocaleString('id-ID')}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="h-px bg-gray-100 mb-4" />

                                <div className="flex justify-between mb-1">
                                    <span className="text-sm text-gray-500">Total ({items.length} buku)</span>
                                    <span className="font-bold text-primary">Rp {totalPrice.toLocaleString('id-ID')}</span>
                                </div>
                                <p className="text-xs text-gray-400 mb-5">Durasi sewa 7 hari per buku</p>

                                <button onClick={handleCheckout} disabled={loading}
                                    className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2">
                                    {loading
                                        ? <>
                                            <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                            </svg>
                                            Memproses {items.length} buku...
                                          </>
                                        : <>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 24 24"><path fill="currentColor" d="M7 22q-.825 0-1.412-.587T5 20V10.975q-.875-.325-1.437-1.1T3 8V4h18v4q0 1-.563 1.775t-1.437 1.1V20q0 .825-.587 1.413T17 22zm5-7l3-3l-1.4-1.4l-1.6 1.575l-.6-.575L10 13z"/></svg>
                                            Sewa Semua ({items.length} Buku)
                                          </>}
                                </button>

                                <button onClick={() => navigate('/books')}
                                    className="w-full mt-2 border border-gray-200 text-gray-500 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition cursor-pointer">
                                    + Tambah Buku Lagi
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
