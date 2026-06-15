import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UserLayout from '../../Components/User/UserLayout'
import api from '../../services/api'

const ApplyAuthor = () => {
    const navigate = useNavigate()
    const [reason, setReason] = useState('')
    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState(null)

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3000)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!reason.trim()) { showToast('Alasan tidak boleh kosong', 'error'); return }
        setLoading(true)
        try {
            await api.post('/apply', { reason })
            showToast('Pengajuan berhasil dikirim! Tunggu persetujuan admin.')
            setTimeout(() => navigate('/dashboard'), 2000)
        } catch (err) {
            showToast(err.response?.data?.message || 'Gagal mengirim pengajuan', 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <UserLayout>
            {toast && (
                <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${toast.type === 'success' ? 'bg-success' : 'bg-red-600'}`}>
                    {toast.msg}
                </div>
            )}
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-neutral font-ebgaramond">Daftar Jadi Penulis</h1>
                <p className="text-gray-500 text-sm mt-0.5">Bagikan karya tulismu dengan jutaan pembaca di Chapterly.</p>
            </header>
            <div className="max-w-xl">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                    <div className="flex items-start gap-4 mb-6 p-4 bg-tertiary rounded-xl border border-primary/10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" className="text-primary shrink-0 mt-0.5"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m1 15h-2v-2h2zm0-4h-2V7h2z"/></svg>
                        <div>
                            <p className="text-sm font-semibold text-primary mb-1">Syarat Menjadi Penulis</p>
                            <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                                <li>Memiliki karya orisinal yang siap dipublikasikan</li>
                                <li>Menyetujui ketentuan layanan Chapterly untuk penulis</li>
                                <li>Pengajuan akan diproses dalam 1-3 hari kerja</li>
                            </ul>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-1.5 mb-6">
                            <label className="text-sm font-semibold text-neutral">Mengapa kamu ingin menjadi penulis?</label>
                            <p className="text-xs text-gray-400 mb-2">Ceritakan latar belakang, pengalaman menulis, dan karya yang ingin kamu bagikan.</p>
                            <textarea
                                value={reason}
                                onChange={e => setReason(e.target.value)}
                                rows={6}
                                placeholder="Tulis alasanmu di sini..."
                                className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-neutral outline-none focus:border-primary transition-colors resize-none"
                                required
                            />
                            <p className="text-xs text-gray-400 text-right">{reason.length} / 1000 karakter</p>
                        </div>
                        <div className="flex gap-3">
                            <button type="submit" disabled={loading || !reason.trim()} className="flex-1 bg-primary text-white py-3 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-60">
                                {loading ? 'Mengirim...' : 'Kirim Pengajuan'}
                            </button>
                            <button type="button" onClick={() => navigate(-1)} className="border border-gray-200 px-6 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                                Batal
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </UserLayout>
    )
}

export default ApplyAuthor