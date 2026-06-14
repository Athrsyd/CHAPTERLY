import React from 'react'
import Sidebar from '../Components/Dashboard/Sidebar'

// ── Dummy data (semua null untuk sementara) ──────────────────────────────────
const statCards = [
    { label: 'Buku Disewa', value: 12, unit: 'Buku', icon: IconBook },
    { label: 'Transaksi', value: 12, unit: 'Total', icon: IconCalendar },
    { label: 'Buku Aktif', value: 10, unit: 'Buku', icon: IconClock },
    { label: 'Selesai Dibaca', value: 2, unit: 'Buku', icon: IconBookmark },
]

const rentedBooks = [
    { id: 1, title: null, author: null, cover: null },
    { id: 2, title: null, author: null, cover: null },
    { id: 3, title: null, author: null, cover: null },
    { id: 4, title: null, author: null, cover: null },
    { id: 5, title: null, author: null, cover: null },
]

const recommendedBooks = [
    { id: 1, title: null, author: null, cover: null },
    { id: 2, title: null, author: null, cover: null },
    { id: 3, title: null, author: null, cover: null },
    { id: 4, title: null, author: null, cover: null },
    { id: 5, title: null, author: null, cover: null },
]

const transactions = [
    { id: 1, title: null, author: null, cover: null, status: null, date: null },
    { id: 2, title: null, author: null, cover: null, status: null, date: null },
    { id: 3, title: null, author: null, cover: null, status: null, date: null },
    { id: 4, title: null, author: null, cover: null, status: null, date: null },
]

// ── Icons ────────────────────────────────────────────────────────────────────
function IconBook() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
            <path fill="currentColor" d="M6 22q-.825 0-1.412-.587T4 20V4q0-.825.588-1.412T6 2h12q.825 0 1.413.588T20 4v16q0 .825-.587 1.413T18 22zm0-2h12V4h-2v7l-2.5-1.5L11 11V4H6zm0 0V4zm5-9l2.5-1.5L16 11l-2.5-1.5z" />
        </svg>
    )
}

function IconCalendar() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
            <path fill="currentColor" d="M5 22q-.825 0-1.412-.587T3 20V6q0-.825.588-1.412T5 4h1V2h2v2h8V2h2v2h1q.825 0 1.413.588T21 6v14q0 .825-.587 1.413T19 22zm0-2h14V10H5zM5 8h14V6H5zm0 0V6z" />
        </svg>
    )
}

function IconClock() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m2.8-4.8l1.4-1.4l-3.2-3.2V8h-2v5.4z" />
        </svg>
    )
}

function IconBookmark() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
            <path fill="currentColor" d="M5 21V5q0-.825.588-1.412T7 3h10q.825 0 1.413.588T19 5v16l-7-3zm2-3.05l5-2.15l5 2.15V5H7zM7 5h10z" />
        </svg>
    )
}

function IconSearch() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14" />
        </svg>
    )
}

function IconBell() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24">
            <path fill="currentColor" d="M4 19v-2h2v-7q0-2.075 1.25-3.687T10.5 4.2v-.7q0-.625.438-1.062T12 2t1.063.438T13.5 3.5v.7q2 .5 3.25 2.113T18 10v7h2v2zm8 3q-.825 0-1.412-.587T10 20h4q0 .825-.587 1.413T12 22" />
        </svg>
    )
}

function IconChevronRight() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <path fill="currentColor" d="M8.59 16.58L13.17 12L8.59 7.41L10 6l6 6l-6 6z" />
        </svg>
    )
}

// ── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, unit, icon: Icon }) {
    return (
        <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl px-5 py-4 flex-1 shadow-sm">
            <div className="bg-primary text-white rounded-lg p-2.5 flex items-center justify-center shrink-0">
                <Icon />
            </div>
            <div className="flex flex-col">
                <span className="text-primary text-xs font-semibold uppercase tracking-wide">{label}</span>
                <span className="text-primary text-3xl font-bold font-ebgaramond leading-tight">{value}</span>
                <span className="text-gray-400 text-xs">{unit}</span>
            </div>
        </div>
    )
}

function BookCard({ book }) {
    return (
        <div className="flex flex-col gap-2 min-w-30">
            {/* cover placeholder */}
            <div className="w-full aspect-2/3 rounded-lg bg-gray-100 border border-gray-200" />
            <div className="flex flex-col gap-0.5">
                <div className="h-3 w-3/4 rounded bg-gray-200" />
                <div className="h-2.5 w-1/2 rounded bg-gray-100" />
            </div>
        </div>
    )
}

function SectionHeader({ title, onSeeAll }) {
    return (
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-neutral font-jakarta">{title}</h2>
            <button
                onClick={onSeeAll}
                className="flex items-center gap-0.5 text-primary text-sm font-medium hover:underline"
            >
                Lihat Semua <IconChevronRight />
            </button>
        </div>
    )
}

function TransactionItem({ item }) {
    const statusStyle =
        item.status === 'Aktif'
            ? 'bg-green-100 text-success'
            : 'bg-gray-100 text-gray-500'

    return (
        <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
            {/* cover placeholder */}
            <div className="w-12 h-16 rounded bg-gray-200 shrink-0" />
            <div className="flex flex-col gap-1 flex-1">
                <div className="h-3 w-3/4 rounded bg-gray-200" />
                <div className="h-2.5 w-1/2 rounded bg-gray-100" />
                <div className="h-2.5 w-1/3 rounded bg-gray-100 mt-1" />
            </div>
            <div className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${statusStyle}`}>
                {item.status ?? '—'}
            </div>
        </div>
    )
}

// ── Topbar ───────────────────────────────────────────────────────────────────
function Topbar() {
    return (
        <header className="flex items-center justify-between mb-8">
            <div>
                <p className="text-gray-400 text-sm">Selamat Datang Kembali,</p>
                <h1 className="text-primary text-2xl font-bold font-ebgaramond italic">
                    Nakala Eliam
                </h1>
                <p className="text-gray-500 text-sm mt-0.5">Lanjutkan petualangan membacamu hari ini!</p>
            </div>

            <div className="flex items-center gap-4">
                {/* search bar */}
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 w-72 shadow-sm">
                    <span className="text-gray-400"><IconSearch /></span>
                    <input
                        type="text"
                        placeholder="Cari buku, penulis, atau genre..."
                        className="bg-transparent outline-none text-sm text-gray-600 placeholder-gray-400 w-full"
                    />
                </div>

                {/* notif */}
                <button className="text-gray-500 hover:text-primary transition-colors">
                    <IconBell />
                </button>

                {/* avatar */}
                <div className="w-9 h-9 rounded-full bg-primary/20 border-2 border-primary/30 overflow-hidden cursor-pointer" />
            </div>
        </header>
    )
}

// ── Main Dashboard ───────────────────────────────────────────────────────────
const Dashboard = () => {
    return (
        <div className="flex w-full min-h-screen bg-gray-50 font-jakarta">
            <Sidebar />

            <main className="flex-1 ml-64 px-8 py-7">
                <Topbar />

                {/* Stat cards */}
                <div className="flex gap-4 mb-8">
                    {statCards.map((s) => (
                        <StatCard key={s.label} {...s} />
                    ))}
                </div>

                {/* Two-column layout: content left, transactions right */}
                <div className="flex gap-6">
                    {/* Left column */}
                    <div className="flex flex-col gap-6 flex-1">

                        {/* Buku yang Sedang Disewa */}
                        <section className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                            <SectionHeader title="Buku yang Sedang Disewa" onSeeAll={() => { }} />
                            <div className="grid grid-cols-5 gap-4">
                                {rentedBooks.map((book) => (
                                    <BookCard key={book.id} book={book} />
                                ))}
                            </div>
                        </section>

                        {/* Rekomendasi Untukmu */}
                        <section className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                            <SectionHeader title="Rekomendasi Untukmu" onSeeAll={() => { }} />
                            <div className="grid grid-cols-5 gap-4">
                                {recommendedBooks.map((book) => (
                                    <BookCard key={book.id} book={book} />
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right column – Riwayat Transaksi */}
                    <aside className="w-72 shrink-0">
                        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                            <SectionHeader title="Riwayat Transaksi" onSeeAll={() => { }} />
                            <div className="flex flex-col">
                                {transactions.map((item) => (
                                    <TransactionItem key={item.id} item={item} />
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    )
}

export default Dashboard
