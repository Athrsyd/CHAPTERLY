import React, { useState } from 'react'
import AdminSidebar from '../../Components/shared/AdminSidebar'
import useAuth from '../../Hooks/useAuth'
import api from '../../services/api'

export default function AdminProfil() {
    const { user, setUser } = useAuth()
    const [editing, setEditing] = useState(false)
    const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' })
    const [pwForm, setPwForm] = useState({ old_password: '', new_password: '' })
    const [saving, setSaving] = useState(false)
    const [msg, setMsg] = useState('')

    const handleSave = async () => {
        setSaving(true); setMsg('')
        try {
            // In a real app you'd have a PUT /auth/profile endpoint
            const updated = { ...user, name: form.name, email: form.email }
            localStorage.setItem('user', JSON.stringify(updated))
            setUser(updated)
            setEditing(false)
            setMsg('Profil berhasil diperbarui!')
        } catch (e) { setMsg('Gagal memperbarui profil') }
        finally { setSaving(false) }
    }

    return (
        <div className="flex w-full min-h-screen bg-gray-50 font-jakarta">
            <AdminSidebar />
            <main className="flex-1 ml-64 px-8 py-7">
                <h1 className="text-2xl font-bold text-neutral font-ebgaramond mb-1">Profil</h1>
                <p className="text-gray-500 text-sm mb-6">Kelola informasi akun admin Anda.</p>

                {msg && <div className="mb-4 px-4 py-3 bg-green-50 text-success text-sm rounded-xl border border-green-200">{msg}</div>}

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-lg">
                    {/* Avatar */}
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold">
                                {user?.name?.[0]?.toUpperCase() || 'A'}
                            </div>
                            <button className="absolute bottom-0 right-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="0.8em" height="0.8em" viewBox="0 0 24 24" className="text-white"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83l3.75 3.75z"/></svg>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Nama Lengkap</label>
                            {editing
                                ? <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary" />
                                : <p className="text-neutral font-medium">{user?.name}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                            {editing
                                ? <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary" />
                                : <p className="text-neutral font-medium">{user?.email}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Role</label>
                            <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">Author</span>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        {editing ? (
                            <>
                                <button onClick={() => setEditing(false)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 cursor-pointer">Batal</button>
                                <button onClick={handleSave} disabled={saving} className="flex-1 bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 cursor-pointer">
                                    {saving ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => setEditing(true)} className="flex-1 bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 cursor-pointer">✏️ Edit Profil</button>
                                <button className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 cursor-pointer">🔒 Ubah Password</button>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
