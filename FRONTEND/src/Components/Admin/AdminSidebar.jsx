import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import logo from '../../assets/logomerah.png'
import useAuth from '../../Hooks/useAuth'

const icons = {
    dashboard: <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24"><path fill="currentColor" d="M6 19h3v-6h6v6h3v-9l-6-4.5L6 10zm-2 2V9l8-6l8 6v12h-7v-6h-2v6zm8-8.75"/></svg>,
    users: <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24"><path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3m-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3m0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5m8 0c-.29 0-.62.02-.97.05c1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5"/></svg>,
    admins: <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12c5.16-1.26 9-6.45 9-12V5zm0 4a3 3 0 1 1 0 6a3 3 0 0 1 0-6m0 14c-2.7-.75-4.93-2.55-6.23-5H18.23c-1.3 2.45-3.53 4.25-6.23 5"/></svg>,
    books: <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24"><path fill="currentColor" d="M6 22q-.825 0-1.412-.587T4 20V4q0-.825.588-1.412T6 2h12q.825 0 1.413.588T20 4v16q0 .825-.587 1.413T18 22zm0-2h12V4h-2v7l-2.5-1.5L11 11V4H6zm0 0V4zm5-9l2.5-1.5L16 11l-2.5-1.5z"/></svg>,
    transactions: <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24"><path fill="currentColor" d="M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2M4 19V5h16v3h-6c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h6v3zm16-9v4h-6v-4z"/></svg>,
    apply: <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24"><path fill="currentColor" d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8zm2 14H8v-2h8zm0-4H8v-2h8zm-3-5V3.5L18.5 9z"/></svg>,
    logout: <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24"><path fill="currentColor" d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h7v2H5v14h7v2zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5z"/></svg>,
}

const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { to: '/admin/users', label: 'Kelola User', icon: 'users' },
    { to: '/admin/admins', label: 'Kelola Admin', icon: 'admins' },
    { to: '/admin/books', label: 'Kelola Buku', icon: 'books' },
    { to: '/admin/transactions', label: 'Kelola Transaksi', icon: 'transactions' },
    { to: '/admin/applications', label: 'Pengajuan Penulis', icon: 'apply' },
]

const AdminSidebar = () => {
    const { logout, user } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        navigate('/')
    }

    return (
        <aside className="text-white flex justify-start items-center flex-col fixed h-full w-64 bg-neutral z-40">
            <div className="w-full px-5 py-5">
                <NavLink to="/admin/dashboard" className="flex items-center gap-2 mb-6">
                    <img src={logo} alt="Logo" className='w-9 brightness-200' />
                    <div>
                        <h1 className="text-base font-bold font-ebgaramond text-white leading-none">CHAPTERLY</h1>
                        <p className="text-xs text-white/50 mt-0.5 uppercase tracking-widest">Super Admin</p>
                    </div>
                </NavLink>

                <div className="h-px bg-white/10 mb-4"></div>

                <ul className="flex flex-col gap-1">
                    {navItems.map(item => (
                        <li key={item.to}>
                            <NavLink
                                to={item.to}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                        isActive
                                            ? 'bg-primary text-white'
                                            : 'text-white/60 hover:text-white hover:bg-white/10'
                                    }`
                                }
                            >
                                {icons[item.icon]}
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-auto w-full px-5 pb-5">
                {/* Decorative image */}
                <div className="bg-white/5 rounded-xl p-4 mb-4 text-center">
                    <p className="text-xs text-white/50 leading-relaxed">Kelola sistem dengan mudah dan efisien.</p>
                </div>
                <div className="h-px bg-white/10 mb-4"></div>
                {user && (
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
                            {user.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-xs font-semibold text-white truncate">{user.name}</span>
                            <span className="text-xs text-white/50">Pengelola Utama Sistem</span>
                        </div>
                    </div>
                )}
                <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                    {icons.logout} Logout
                </button>
            </div>
        </aside>
    )
}

export default AdminSidebar