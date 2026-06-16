import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../../assets/logomerah.png'
import useAuth from '../../Hooks/useAuth'
import { useCart } from '../../Context/CartContext'
import api from '../../services/api'

const icons = {
    dashboard: <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M6 19h3v-6h6v6h3v-9l-6-4.5L6 10zm-2 2V9l8-6l8 6v12h-7v-6h-2v6z"/></svg>,
    books: <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M6 22q-.825 0-1.412-.587T4 20V4q0-.825.588-1.412T6 2h12q.825 0 1.413.588T20 4v16q0 .825-.587 1.413T18 22zm0-2h12V4h-2v7l-2.5-1.5L11 11V4H6z"/></svg>,
    transactions: <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2M4 19V5h16v3h-6c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h6v3zm16-9v4h-6v-4z"/></svg>,
    cart: <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M7 22q-.825 0-1.412-.587T5 20t.588-1.412T7 18t1.413.588T9 20t-.587 1.413T7 22m10 0q-.825 0-1.412-.587T15 20t.588-1.412T17 18t1.413.588T19 20t-.587 1.413T17 22M1 2h2.27l3.96 8.55L5.25 13q-.275.5-.262 1.05T5.3 15.1Q5.7 15.7 6.35 16H19v-2H6.9l1.05-2H16q.8 0 1.45-.437t.95-1.113l3.5-6.35A1 1 0 0 0 21 2.5a1 1 0 0 0-.87-.5H4.43L3.73.85A1 1 0 0 0 2.82 0H1z"/></svg>,
    logout: <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h7v2H5v14h7v2zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5z"/></svg>,
    admin: <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12c5.16-1.26 9-6.45 9-12V5zm0 4a3 3 0 1 1 0 6a3 3 0 0 1 0-6m0 14c-2.33 0-4.31-1.46-5.11-3.5h10.22C16.31 17.54 14.33 19 12 19"/></svg>,
}

const ReaderSidebar = () => {
    const location  = useLocation()
    const navigate  = useNavigate()
    const { user, logout } = useAuth()
    const { items } = useCart()
    const [applying, setApplying] = useState(false)
    const [applyMsg, setApplyMsg] = useState('')

    const navItems = [
        { label: 'Dashboard',      icon: 'dashboard',    path: '/dashboard' },
        { label: 'Daftar Buku',    icon: 'books',        path: '/books' },
        { label: 'Transaksi Saya', icon: 'transactions', path: '/transaksi' },
        { label: 'Keranjang',      icon: 'cart',         path: '/keranjang', badge: items.length },
    ]

    const handleApply = async () => {
        const reason = prompt('Tuliskan alasan kamu ingin menjadi penulis:')
        if (!reason) return
        setApplying(true)
        try {
            await api.post('/apply', { reason })
            setApplyMsg('Lamaran terkirim! Menunggu persetujuan.')
        } catch (e) {
            setApplyMsg(e.response?.data?.message || 'Gagal mengirim lamaran')
        } finally { setApplying(false) }
    }

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
                                <span className="flex-1">{item.label}</span>
                                {/* Badge counter keranjang */}
                                {item.badge > 0 && (
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center
                                        ${active ? 'bg-white text-primary' : 'bg-primary text-white'}`}>
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        </li>
                    )
                })}

                {user?.role === 'author' && (
                    <li>
                        <Link to="/admin/dashboard"
                            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary/8 transition-all duration-200">
                            {icons.admin}
                            Admin Dashboard
                        </Link>
                    </li>
                )}
            </ul>

            {user?.role === 'reader' && (
                <div className="mt-auto w-full mb-4">
                    <div className="bg-tertiary rounded-xl p-4 border border-primary/15 text-center">
                        <p className="text-xs text-neutral/70 mb-3 leading-relaxed">
                            {applyMsg || 'Jadilah Bagian dari Komunitas CHAPTERLY! Gabung sekarang dan mulai menulis buku kamu.'}
                        </p>
                        {!applyMsg && (
                            <button onClick={handleApply} disabled={applying}
                                className="w-full bg-primary text-white text-xs font-semibold py-2 rounded-lg hover:bg-primary/90 transition disabled:opacity-60 cursor-pointer">
                                {applying ? 'Mengirim...' : '+ Jadilah Penulis'}
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div className="h-px rounded-full bg-primary/10 w-11/12 mt-auto mb-2" />
            <button onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2.5 w-full text-sm font-medium text-primary hover:bg-primary/8 rounded-lg transition cursor-pointer">
                {icons.logout} Keluar
            </button>
        </aside>
    )
}

export default ReaderSidebar
