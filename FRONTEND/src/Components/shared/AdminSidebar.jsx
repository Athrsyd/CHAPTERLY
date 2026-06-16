import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../../assets/logomerah.png'
import useAuth from '../../Hooks/useAuth'

const icons = {
    dashboard: <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M6 19h3v-6h6v6h3v-9l-6-4.5L6 10zm-2 2V9l8-6l8 6v12h-7v-6h-2v6z" /></svg>,
    books: <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M6 22q-.825 0-1.412-.587T4 20V4q0-.825.588-1.412T6 2h12q.825 0 1.413.588T20 4v16q0 .825-.587 1.413T18 22zm0-2h12V4h-2v7l-2.5-1.5L11 11V4H6z" /></svg>,
    data: <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2M4 19V5h16v3h-6c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h6v3zm16-9v4h-6v-4z" /></svg>,
    profil: <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12m-8 8v-2.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20z" /></svg>,
    logout: <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h7v2H5v14h7v2zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5z" /></svg>,
    sewa: <svg xmlns="http://www.w3.org/2000/svg" width="1.6em" viewBox="0 0 24 24">
	<g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
		<path d="M5 5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1zm4 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zM5 8h4m0 8h4"></path>
		<path d="m13.803 4.56l2.184-.53c.562-.135 1.133.19 1.282.732l3.695 13.418a1.02 1.02 0 0 1-.634 1.219l-.133.041l-2.184.53c-.562.135-1.133-.19-1.282-.732L13.036 5.82a1.02 1.02 0 0 1 .634-1.219zM14 9l4-1m-2 8l3.923-.98"></path>
	</g>
</svg>,
}

const navItems = [
    { label: 'Dashboard', icon: 'dashboard', path: '/admin/dashboard' },
    { label: 'Kelola Buku', icon: 'books', path: '/admin/kelola-buku' },
    { label: 'Data Penyewaan', icon: 'data', path: '/admin/data-penyewaan' },
    { label: 'Profil', icon: 'profil', path: '/admin/profil' },
    { label: 'Sewa Buku', icon: 'sewa', path: '/dashboard' },
]

const AdminSidebar = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const handleLogout = () => { logout(); navigate('/') }

    return (
        <aside className="text-primary flex justify-start items-center border-r border-primary/15 flex-col fixed h-full w-64 p-4 bg-white z-40">
            <div className="logo mb-6 flex items-center gap-2 text-primary mt-2">
                <img src={logo} alt="Logo" className='w-10' />
                <h1 className="text-xl font-semibold font-ebgaramond">CHAPTERLY</h1>
            </div>
            <div className="h-px rounded-full bg-primary/10 w-11/12 mb-6" />

            <ul className="menu flex flex-col gap-1 w-full">
                {navItems.map(item => {
                    const active = location.pathname === item.path
                    return (
                        <li key={item.path}>
                            <Link to={item.path}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${active ? 'bg-primary text-white' : 'text-primary hover:bg-primary/8'}`}>
                                {icons[item.icon]}
                                {item.label}
                            </Link>
                        </li>
                    )
                })}
            </ul>



            <div className="h-px rounded-full bg-primary/10 w-11/12 mt-auto mb-2" />
            <button onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2.5 w-full text-sm font-medium text-primary hover:bg-primary/8 rounded-lg transition cursor-pointer">
                {icons.logout} Keluar
            </button>
        </aside>
    )
}

export default AdminSidebar
