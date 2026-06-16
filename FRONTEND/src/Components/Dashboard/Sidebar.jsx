import React from 'react'
import logo from '../../assets/logomerah.png'

const dataIcons = {
    'dashboard': <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
        <path fill="currentColor" d="M6 19h3v-6h6v6h3v-9l-6-4.5L6 10zm-2 2V9l8-6l8 6v12h-7v-6h-2v6zm8-8.75"></path>
    </svg>,
    'books': <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
        <path fill="currentColor" d="M6 22q-.825 0-1.412-.587T4 20V4q0-.825.588-1.412T6 2h12q.825 0 1.413.588T20 4v16q0 .825-.587 1.413T18 22zm0-2h12V4h-2v7l-2.5-1.5L11 11V4H6zm0 0V4zm5-9l2.5-1.5L16 11l-2.5-1.5z"></path>
    </svg>,
    'transactions': <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
        <path fill="currentColor" d="M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2M4 19V5h16v3h-6c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h6v3zm16-9v4h-6v-4z"></path>
    </svg>,
    'logout': <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
        <path fill="currentColor" d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h7v2H5v14h7v2zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5z"></path>
    </svg>,
    'arrow': <svg xmlns="http://www.w3.org/2000/svg" width="0.5em" height="1.5em" viewBox="0 0 12 24">
        <defs>
            <path id="SVG1pzpbdYY" fill="currentColor" d="m7.588 12.43l-1.061 1.06L.748 7.713a.996.996 0 0 1 0-1.413L6.527.52l1.06 1.06l-5.424 5.425z"></path>
        </defs>
        <use fillRule="evenodd" href="#SVG1pzpbdYY" transform="rotate(-180 5.02 9.505)"></use>
    </svg>
}
const Sidebar = () => {
    return (
        <aside className="text-primary flex justify-start items-center border-r-3 border-primary/25 flex-col fixed h-full w-64 p-4">

            <div className="logo mb-8 flex items-center gap-2 text-primary">
                <img src={logo} alt="Logo" className='w-12' />
                <h1 className="text-2xl font-semibold font-ebgaramond">CHAPTERLY</h1>
            </div>

            <div className="h-0.5 -mt-6 rounded-full bg-primary/10  w-9/10"></div>

            <ul className="menu mt-8 flex flex-col gap-4 -ml-2 text-lg font-medium w-full rounded-lg">
                <li className="hover:bg-primary text-lg text-primary hover:text-white px-6 py-2 rounded-md transition duration-300 ease-in-out cursor-pointer flex items-center gap-2">{dataIcons.dashboard}Dashboard</li>
                <li className="hover:bg-primary text-lg text-primary hover:text-white px-6   py-2 rounded-md transition duration-300 ease-in-out cursor-pointer flex items-center gap-2">{dataIcons.books}Daftar Buku</li>
                <li className="hover:bg-primary text-lg text-primary hover:text-white px-6 py-2 rounded-md transition duration-300 ease-in-out cursor-pointer flex items-center gap-2">{dataIcons.transactions}Transaksi Saya</li>
            </ul>

            <div className="mx-auto mt-auto flex flex-col items-center text-sm gap-2 text-center bg-gray-200 rounded-lg p-4 border border-gray-500">
                <p>Jadilah Bagian dari Komunitas CHAPTERLY! <br />Gabung sekarang dan mulai menulis buku kamu.</p>
                <button className="mt-auto mb-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition duration-300 ease-in-out w-full">Jadilah Penulis</button>
            </div>
            <div className="h-0.5 mt-4 rounded-full bg-primary/10  w-9/10"></div>
            <button className=" hover:bg-primary text-lg font-medium text-primary hover:text-white px-8 py-2 mt-2 rounded-md transition duration-300 ease-in-out cursor-pointer flex items-center justify-start gap-2">{dataIcons.logout}Keluar</button>

        </aside>
    )
}

export default Sidebar