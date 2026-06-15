import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import logo from '../../assets/logomerah.png'
import useAuth from '../../Hooks/useAuth'

const icons = {
    dashboard: <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M6 19h3v-6h6v6h3v-9l-6-4.5L6 10zm-2 2V9l8-6l8 6v12h-7v-6h-2v6zm8-8.75"/></svg>,
    books: <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M6 22q-.825 0-1.412-.587T4 20V4q0-.825.588-1.412T6 2h12q.825 0 1.413.588T20 4v16q0 .825-.587 1.413T18 22zm0-2h12V4h-2v7l-2.5-1.5L11 11V4H6zm0 0V4zm5-9l2.5-1.5L16 11l-2.5-1.5z"/></svg>,
    transactions: <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2M4 19V5h16v3h-6c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h6v3zm16-9v4h-6v-4z"/></svg>,
    favorite: <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="m12 21l-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812T2.388 10.4T2 8.15Q2 5.8 3.575 4.225T7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55t2.475-.55q2.35 0 3.925 1.575T22 8.15q0 1.15-.388 2.25t-1.362 2.412t-2.625 2.963T13.45 19.7zm0-2.7q2.4-2.15 3.95-3.688t2.45-2.674t1.25-2.076T19.85 8.2q0-1.5-.975-2.475T16.6 4.75q-1 0-1.875.45t-1.575 1.35l-1.15 1.6l-1.15-1.6q-.675-.9-1.575-1.35T7.4 4.75q-1.45 0-2.425.975T4 8.2q0 .875.3 1.762t1.25 2.076t2.45 2.662T12 18.3"/></svg>,
    profile: <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12m-8 8v-2.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20z"/></svg>,
    logout: <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h7v2H5v14h7v2zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5z"/></svg>,
}

const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { to: '/books', label: 'Daftar Buku', icon: 'books' },
    { to: '/transactions', label: 'Transaksi Saya', icon: 'transactions' },
    { to: '/favorites', label: 'Buku Favorit', icon: 'favorite' },
    { to: '/profile', label: 'Profil', icon: 'profile' },
]

const UserSidebar = () => {
    const { logout, user } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        navigate('/')
    }

    return (
        <aside className="text-primary flex justify-start items-center border-r-2 border-primary/10 flex-col fixed h-full w-64 p-4 bg-white z-40">
            <NavLink to="/" className="logo mb-8 flex items-center gap-2 text-primary mt-2">
                <img src={logo} alt="Logo" className='w-10' />
                <h1 className="text-xl font-semibold font-ebgaramond">CHAPTERLY</h1>
            </NavLink>

            <div className="h-px rounded-full bg-primary/10 w-full mb-4"></div>

            <ul className="menu flex flex-col gap-1 w-full">
                {navItems.map(item => (
                    <li key={item.to}>
                        <NavLink
                            to={item.to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                    isActive
                                        ? 'bg-primary text-white'
                                        : 'text-primary hover:bg-primary/10'
                                }`
                            }
                        >
                            {icons[item.icon]}
                            {item.label}
                        </NavLink>
                    </li>
                ))}
            </ul>

            <div className="mx-auto mt-auto w-full flex flex-col items-center text-sm gap-2 text-center bg-tertiary rounded-xl p-4 border border-primary/10">
                <p className="text-neutral text-xs leading-relaxed">Jadilah Bagian dari Komunitas CHAPTERLY! <br />Gabung dan mulai menulis buku kamu.</p>
                <button 
                    onClick={() => navigate('/apply-author')}
                    className="mt-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-xs font-semibold w-full">
                    + Jadilah Penulis
                </button>
            </div>

            <div className="h-px mt-4 rounded-full bg-primary/10 w-full"></div>
            
            {/* User info */}
            {user && (
                <div className="flex items-center gap-3 w-full px-2 py-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
                        {user.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-neutral truncate">{user.name}</span>
                        <span className="text-xs text-gray-400 truncate">{user.email}</span>
                    </div>
                </div>
            )}

            <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-sm font-medium text-primary hover:bg-red-50 hover:text-red-600 transition-colors duration-200 mt-1"
            >
                {icons.logout}
                Keluar
            </button>
        </aside>
    )
}

export default UserSidebar