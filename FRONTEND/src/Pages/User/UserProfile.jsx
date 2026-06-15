import React, { useState } from 'react'
import UserLayout from '../../Components/User/UserLayout'
import useAuth from '../../Hooks/useAuth'
import api from '../../services/api'

function IconEdit() { return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M5 19h1.425L16.2 9.225L14.775 7.8L5 17.575zm-2 2v-4.25l10.575-10.55q.3-.275.663-.425t.762-.15t.775.15t.65.45L17.25 7.65q.275.3.413.663t.137.762q0 .4-.137.763t-.413.662L6.25 21zM19 21v-2h2v2zm-4-14.575l-1.425-1.425zM13.75 8.5L13 7.775L14.775 9.5z"/></svg> }
function IconLock() { return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2m-6 9c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2m3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1c1.71 0 3.1 1.39 3.1 3.1z"/></svg> }
function IconCamera() { return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17q1.875 0 3.188-1.312T16.5 12.5t-1.312-3.187T12 8t-3.187 1.313T7.5 12.5t1.313 3.188T12 17m0-2q-1.05 0-1.775-.725T9.5 12.5t.725-1.775T12 10t1.775.725T14.5 12.5t-.725 1.775T12 15M4 21q-.825 0-1.412-.587T2 19V7q0-.825.588-1.412T4 5h3.15L9 3h6l1.85 2H20q.825 0 1.413.588T22 7v12q0 .825-.587 1.413T20 21z"/></svg> }

const UserProfile = () => {
    const { user, updateUser } = useAuth()
    const [editMode, setEditMode] = useState(false)
    const [pwdMode, setPwdMode] = useState(false)
    const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' })
    const [pwdForm, setPwdForm] = useState({ current_password: '', new_password: '', confirm_password: '' })
    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState(null)

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3000)
    }

    const handleSaveProfile = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await api.put('/auth/me', { name: form.name, phone: form.phone })
            updateUser(res.data.data)
            showToast('Profil berhasil diperbarui!')
            setEditMode(false)
        } catch (err) {
            showToast(err.response?.data?.message || 'Gagal memperbarui profil', 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleChangePassword = async (e) => {
        e.preventDefault()
        if (pwdForm.new_password !== pwdForm.confirm_password) {
            showToast('Konfirmasi password tidak cocok', 'error')
            return
        }
        setLoading(true)
        try {
            await api.put('/auth/password', { current_password: pwdForm.current_password, new_password: pwdForm.new_password })
            showToast('Password berhasil diubah!')
            setPwdMode(false)
            setPwdForm({ current_password: '', new_password: '', confirm_password: '' })
        } catch (err) {
            showToast(err.response?.data?.message || 'Gagal mengubah password', 'error')
        } finally {
            setLoading(false)
        }
    }

    const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

    return (
        <UserLayout>
            {toast && (
                <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${toast.type === 'success' ? 'bg-success' : 'bg-red-600'}`}>
                    {toast.msg}
                </div>
            )}

            <header className="mb-6">
                <h1 className="text-2xl font-bold text-neutral font-ebgaramond">Profil</h1>
                <p className="text-gray-500 text-sm mt-0.5">Kelola informasi akun kamu.</p>
            </header>

            <div className="max-w-2xl">
                {/* Avatar Section */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4 flex items-center gap-6">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
                            {initials}
                        </div>
                        <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-primary shadow-sm">
                            <IconCamera />
                        </button>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-neutral font-ebgaramond">{user?.name}</h2>
                        <p className="text-gray-400 text-sm">{user?.email}</p>
                        <span className="mt-1 inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-tertiary text-primary border border-primary/20 capitalize">{user?.role}</span>
                    </div>
                </div>

                {/* Profile Info */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-neutral">Informasi Pribadi</h3>
                        {!editMode && (
                            <button onClick={() => setEditMode(true)} className="flex items-center gap-1.5 text-sm text-primary font-semibold hover:underline">
                                <IconEdit /> Edit Profil
                            </button>
                        )}
                    </div>
                    {editMode ? (
                        <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nama Lengkap</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-neutral outline-none focus:border-primary transition-colors"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    disabled
                                    className="border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-400 bg-gray-50 cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-400">Email tidak dapat diubah</p>
                            </div>
                            <div className="flex gap-3 mt-2">
                                <button type="submit" disabled={loading} className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60">
                                    {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                                <button type="button" onClick={() => setEditMode(false)} className="border border-gray-200 px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                                    Batal
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {[{ label: 'Nama Lengkap', value: user?.name }, { label: 'Email', value: user?.email }].map(f => (
                                <div key={f.label} className="flex flex-col gap-1">
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{f.label}</span>
                                    <span className="text-sm text-neutral font-medium">{f.value || '—'}</span>
                                    <div className="h-px bg-gray-100" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Change Password */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-neutral">Keamanan Akun</h3>
                        {!pwdMode && (
                            <button onClick={() => setPwdMode(true)} className="flex items-center gap-1.5 text-sm text-primary font-semibold hover:underline">
                                <IconLock /> Ubah Password
                            </button>
                        )}
                    </div>
                    {pwdMode ? (
                        <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
                            {[
                                { name: 'current_password', label: 'Password Saat Ini' },
                                { name: 'new_password', label: 'Password Baru' },
                                { name: 'confirm_password', label: 'Konfirmasi Password Baru' },
                            ].map(f => (
                                <div key={f.name} className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{f.label}</label>
                                    <input
                                        type="password"
                                        value={pwdForm[f.name]}
                                        onChange={e => setPwdForm(p => ({ ...p, [f.name]: e.target.value }))}
                                        required
                                        className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-neutral outline-none focus:border-primary transition-colors"
                                    />
                                </div>
                            ))}
                            <div className="flex gap-3 mt-2">
                                <button type="submit" disabled={loading} className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60">
                                    {loading ? 'Menyimpan...' : 'Ubah Password'}
                                </button>
                                <button type="button" onClick={() => setPwdMode(false)} className="border border-gray-200 px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                                    Batal
                                </button>
                            </div>
                        </form>
                    ) : (
                        <p className="text-sm text-gray-400">Password terakhir diubah: belum pernah diubah</p>
                    )}
                </div>
            </div>
        </UserLayout>
    )
}

export default UserProfile