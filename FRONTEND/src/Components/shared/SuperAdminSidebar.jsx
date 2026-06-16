import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../../Hooks/useAuth'
import Logo from '../../assets/logoputih.png'

const icons = {
    dashboard: <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M6 19h3v-6h6v6h3v-9l-6-4.5L6 10zm-2 2V9l8-6l8 6v12h-7v-6h-2v6z" /></svg>,
    user: <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12m-8 8v-2.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20z" /></svg>,
    admin: <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12c5.16-1.26 9-6.45 9-12V5zm0 4a3 3 0 1 1 0 6a3 3 0 0 1 0-6m0 14c-2.33 0-4.31-1.46-5.11-3.5h10.22C16.31 17.54 14.33 19 12 19" /></svg>,
    books: <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M6 22q-.825 0-1.412-.587T4 20V4q0-.825.588-1.412T6 2h12q.825 0 1.413.588T20 4v16q0 .825-.587 1.413T18 22zm0-2h12V4h-2v7l-2.5-1.5L11 11V4H6z" /></svg>,
    transaksi: <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2M4 19V5h16v3h-6c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h6v3zm16-9v4h-6v-4z" /></svg>,
    logout: <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M5 21q-.825 0-1.41₂-.587T3 ₁₉V₅q₀-.₈₂₅.₅₈₈-₁.₄₁₂T₆₂ h7v₂H₅v₁₄h7v₂zm₁₁-₄l₋₁.₃₇₅₋₁.₄₅l₂.₅₅₋₂.₅₅H9v₋₂h8.₁₇₅l₋₂.₅₅₋₂.₅₅L₁₆ 7l5 5z" /></svg>,
}

const navItems = [
    { label: 'Dashboard', icon: 'dashboard', path: '/superadmin/dashboard' },
    // { label: 'Kelola User', icon: 'user', path: '/superadmin/kelola-user' },
    { label: 'Kelola Penulis', icon: 'admin', path: '/superadmin/kelola-admin' },
    { label: 'Kelola Buku', icon: 'books', path: '/superadmin/kelola-buku' },
    { label: 'Riwayat Peminjaman', icon: 'transaksi', path: '/superadmin/kelola-transaksi' },
]

const SuperAdminSidebar = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const handleLogout = () => { logout(); navigate('/') }

    return (
        <aside className="flex flex-col fixed h-full w-56 z-40" style={{ backgroundColor: '#3D0A0A' }}>
            <div className="logo mb-6 flex items-center gap-2 text-white mt-5 ml-5">
                <img src={Logo} alt="Logo" className='w-10' />
                <h1 className="text-xl font-semibold font-ebgaramond">CHAPTERLY</h1>
            </div>

            <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
                {navItems.map(item => {
                    const active = location.pathname === item.path
                    return (
                        <Link key={item.path} to={item.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${active ? 'bg-white/20 text-white' : 'text-white/65 hover:bg-white/10 hover:text-white'}`}>
                            {icons[item.icon]}
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            <div className="mx-3 mb-4 p-3 rounded-xl bg-white/8 border border-white/10 flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center">
                    <svg width='1em' color='#FFFFFF' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M313 87.2c9.2-7.3 15-18.6 15-31.2 0-22.1-17.9-40-40-40s-40 17.9-40 40c0 12.6 5.9 23.9 15 31.2L194.6 194.8c-10 15.7-31.3 19.6-46.2 8.4L88.9 158.7c4.5-6.4 7.1-14.3 7.1-22.7 0-22.1-17.9-40-40-40s-40 17.9-40 40c0 21.8 17.5 39.6 39.2 40L87.8 393.5c4.7 31.3 31.6 54.5 63.3 54.5l273.8 0c31.7 0 58.6-23.2 63.3-54.5L520.8 176c21.7-.4 39.2-18.2 39.2-40 0-22.1-17.9-40-40-40s-40 17.9-40 40c0 8.4 2.6 16.3 7.1 22.7l-59.4 44.6c-14.9 11.2-36.2 7.3-46.2-8.4L313 87.2z" /></svg>
                </div>
                <p className="text-xs font-semibold text-white">{user?.name || 'Pustakawan'}</p>
                <p className="text-xs text-white/40 text-center">Pengelola Utama Sistem</p>
            </div>

            <div className="h-px bg-white/10 mx-4" />
            <button onClick={handleLogout}
                className="flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-white/60 hover:text-white hover:bg-white/8 transition cursor-pointer">
                {icons.logout} Logout
            </button>
        </aside>
    )
}

export default SuperAdminSidebar
