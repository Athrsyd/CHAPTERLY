import { useEffect, useState, useRef } from 'react'
import booksData from '../../data/booksData.json'

// ── Cari data buku berdasarkan kesamaan nama (fuzzy match) ───
const findBookContent = (bookName) => {
    if (!bookName) return null
    const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim()
    const target = normalize(bookName)
    return booksData.find(b => {
        const src = normalize(b.title)
        return src === target || src.includes(target) || target.includes(src)
    }) || null
}

const FONT_SIZES = [14, 16, 18, 20, 24]
const THEMES = [
    { id: 'cream',  bg: '#FBF5EB', text: '#2D2926', label: 'Krem'  },
    { id: 'white',  bg: '#FFFFFF', text: '#2D2926', label: 'Putih' },
    { id: 'dark',   bg: '#1A1615', text: '#E8DDD0', label: 'Gelap' },
    { id: 'sepia',  bg: '#F0E6D3', text: '#5C3D2E', label: 'Sepia' },
]

export default function ReadBookModal({ book, onClose }) {
    const content     = findBookContent(book?.name)
    const [page, setPage]           = useState(0)
    const [fontIdx, setFontIdx]     = useState(1)   // default 16px
    const [themeIdx, setThemeIdx]   = useState(0)   // default cream
    const [showSettings, setShowSettings] = useState(false)
    const [animDir, setAnimDir]     = useState('none') // 'left' | 'right' | 'none'
    const contentRef = useRef()

    const paragraphs = content?.text || []
    const totalPages = paragraphs.length
    const theme      = THEMES[themeIdx]
    const fontSize   = FONT_SIZES[fontIdx]
    const progress   = totalPages > 1 ? (page / (totalPages - 1)) * 100 : 100

    // Lock body scroll saat modal buka
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = '' }
    }, [])

    // Keyboard navigation
    useEffect(() => {
        const handler = (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext()
            if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goPrev()
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [page])

    const goNext = () => {
        if (page >= totalPages - 1) return
        setAnimDir('left')
        setTimeout(() => { setPage(p => p + 1); setAnimDir('none') }, 200)
        contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const goPrev = () => {
        if (page <= 0) return
        setAnimDir('right')
        setTimeout(() => { setPage(p => p - 1); setAnimDir('none') }, 200)
        contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(26,22,21,0.85)', backdropFilter: 'blur(6px)' }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                className="relative w-full flex flex-col overflow-hidden"
                style={{
                    maxWidth: 760,
                    maxHeight: '92vh',
                    borderRadius: 24,
                    backgroundColor: theme.bg,
                    boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,30,30,0.15)',
                }}
            >
                {/* ── Header ─────────────────────────────────────────────── */}
                <div
                    className="flex items-center justify-between px-6 py-4 shrink-0"
                    style={{
                        borderBottom: `1px solid ${theme.id === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(139,30,30,0.1)'}`,
                        backgroundColor: theme.id === 'dark' ? '#110E0D' : theme.bg,
                    }}
                >
                    {/* Judul + author */}
                    <div className="flex items-center gap-3 min-w-0">
                        {/* Mini cover */}
                        <div className="w-9 h-12 rounded-md overflow-hidden shrink-0 shadow"
                            style={{ backgroundColor: '#8B1E1E' }}>
                            {book?.cover
                                ? <img src={book.cover} alt="" className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center text-white/40">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M6 22q-.825 0-1.412-.587T4 20V4q0-.825.588-1.412T6 2h12q.825 0 1.413.588T20 4v16q0 .825-.587 1.413T18 22zm0-2h12V4h-2v7l-2.5-1.5L11 11V4H6z"/></svg>
                                  </div>}
                        </div>
                        <div className="min-w-0">
                            <p className="font-bold truncate font-ebgaramond text-base" style={{ color: theme.id === 'dark' ? '#E8DDD0' : '#8B1E1E' }}>
                                {content ? book?.name : book?.name}
                            </p>
                            <p className="text-xs truncate" style={{ color: theme.id === 'dark' ? 'rgba(232,221,208,0.5)' : 'rgba(45,41,38,0.5)' }}>
                                {book?.users?.name || 'Penulis'}
                            </p>
                        </div>
                    </div>

                    {/* Controls kanan */}
                    <div className="flex items-center gap-2 shrink-0">
                        {/* Settings toggle */}
                        <button
                            onClick={() => setShowSettings(s => !s)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer"
                            style={{
                                backgroundColor: showSettings
                                    ? 'rgba(139,30,30,0.15)'
                                    : (theme.id === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(139,30,30,0.07)'),
                                color: theme.id === 'dark' ? '#E8DDD0' : '#8B1E1E',
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 15.5q1.45 0 2.475-1.025T15.5 12t-1.025-2.475T12 8.5T9.525 9.525T8.5 12t1.025 2.475T12 15.5m0-2q-.625 0-1.062-.437T10.5 12t.438-1.062T12 10.5t1.063.438T13.5 12t-.437 1.063T12 13.5M12 22l-2.35-.85q-.525-.2-.875-.637t-.35-.988v-1.275q-.475-.225-.925-.5t-.875-.6l-1.2.4q-.55.175-1.088-.038t-.812-.737L2.4 14.75q-.275-.5-.163-1.063T2.8 12.8L3.8 12L2.8 11.2q-.4-.325-.513-.888T2.4 9.25L3.525 7.225q.275-.525.813-.737t1.087-.038l1.2.4q.425-.325.875-.6t.925-.5V4.475q0-.55.35-.988t.875-.637L12 2l2.35.85q.525.2.875.637t.35.988v1.275q.475.225.925.5t.875.6l1.2-.4q.55-.175 1.088.038t.812.737l1.125 2.025q.275.5.163 1.063t-.538.887L19.2 11.2l1 .8l-1 .8l1 1.45q.425.325.538.888t-.163 1.062l-1.125 2.025q-.275.525-.812.738t-1.088.037l-1.2-.4q-.425.325-.875.6t-.925.5v1.275q0 .55-.35.988t-.875.637z"/></svg>
                            Tampilan
                        </button>

                        {/* Tutup */}
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-lg transition cursor-pointer"
                            style={{
                                backgroundColor: theme.id === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(139,30,30,0.07)',
                                color: theme.id === 'dark' ? '#E8DDD0' : '#8B1E1E',
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/></svg>
                        </button>
                    </div>
                </div>

                {/* ── Settings Panel ──────────────────────────────────────── */}
                {showSettings && (
                    <div
                        className="px-6 py-4 shrink-0 flex flex-wrap items-center gap-5"
                        style={{
                            borderBottom: `1px solid ${theme.id === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(139,30,30,0.1)'}`,
                            backgroundColor: theme.id === 'dark' ? '#0F0C0B' : (theme.id === 'white' ? '#F9F9F9' : theme.bg),
                        }}
                    >
                        {/* Font size */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium" style={{ color: theme.id === 'dark' ? 'rgba(232,221,208,0.6)' : 'rgba(45,41,38,0.5)' }}>Ukuran</span>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setFontIdx(i => Math.max(0, i - 1))}
                                    disabled={fontIdx === 0}
                                    className="w-7 h-7 rounded-md flex items-center justify-center disabled:opacity-30 cursor-pointer transition"
                                    style={{ backgroundColor: 'rgba(139,30,30,0.1)', color: '#8B1E1E' }}
                                >A<span className="text-[8px]">-</span></button>
                                <span className="text-xs w-10 text-center font-semibold" style={{ color: theme.text }}>{fontSize}px</span>
                                <button
                                    onClick={() => setFontIdx(i => Math.min(FONT_SIZES.length - 1, i + 1))}
                                    disabled={fontIdx === FONT_SIZES.length - 1}
                                    className="w-7 h-7 rounded-md flex items-center justify-center disabled:opacity-30 cursor-pointer transition"
                                    style={{ backgroundColor: 'rgba(139,30,30,0.1)', color: '#8B1E1E' }}
                                >A<span className="text-[10px]">+</span></button>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-6 w-px" style={{ backgroundColor: theme.id === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(139,30,30,0.15)' }} />

                        {/* Theme */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium" style={{ color: theme.id === 'dark' ? 'rgba(232,221,208,0.6)' : 'rgba(45,41,38,0.5)' }}>Tema</span>
                            <div className="flex gap-1.5">
                                {THEMES.map((t, i) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setThemeIdx(i)}
                                        title={t.label}
                                        className="w-7 h-7 rounded-full border-2 transition cursor-pointer"
                                        style={{
                                            backgroundColor: t.bg,
                                            borderColor: themeIdx === i ? '#8B1E1E' : 'rgba(139,30,30,0.2)',
                                            boxShadow: themeIdx === i ? '0 0 0 2px rgba(139,30,30,0.3)' : 'none',
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Keyboard hint */}
                        <div className="ml-auto hidden md:flex items-center gap-1.5 opacity-50">
                            <kbd className="text-[10px] px-1.5 py-0.5 rounded border font-mono" style={{ borderColor: theme.text, color: theme.text }}>←</kbd>
                            <kbd className="text-[10px] px-1.5 py-0.5 rounded border font-mono" style={{ borderColor: theme.text, color: theme.text }}>→</kbd>
                            <span className="text-[10px]" style={{ color: theme.text }}>navigasi</span>
                        </div>
                    </div>
                )}

                {/* ── Content ─────────────────────────────────────────────── */}
                <div
                    ref={contentRef}
                    className="flex-1 overflow-y-auto px-10 py-8"
                    style={{ backgroundColor: theme.bg }}
                >
                    {!content ? (
                        /* Buku tidak ada di data lokal */
                        <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                                style={{ backgroundColor: 'rgba(139,30,30,0.1)' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.8em" height="1.8em" viewBox="0 0 24 24" style={{ color: '#8B1E1E' }}><path fill="currentColor" d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2M6 4h5v8l-2.5-1.5L6 12zm0 16V14h12v6zm6-8V4h6v8z"/></svg>
                            </div>
                            <p className="font-bold text-lg mb-1 font-ebgaramond" style={{ color: '#8B1E1E' }}>Konten Tidak Tersedia</p>
                            <p className="text-sm max-w-xs leading-relaxed" style={{ color: theme.id === 'dark' ? 'rgba(232,221,208,0.5)' : 'rgba(45,41,38,0.4)' }}>
                                Buku <span className="font-semibold">"{book?.name}"</span> belum tersedia untuk dibaca online saat ini.
                            </p>
                        </div>
                    ) : (
                        <div
                            key={page}
                            style={{
                                opacity: animDir === 'none' ? 1 : 0,
                                transform: animDir === 'left' ? 'translateX(-24px)' : animDir === 'right' ? 'translateX(24px)' : 'translateX(0)',
                                transition: 'opacity 0.2s ease, transform 0.2s ease',
                            }}
                        >
                            {/* Chapter label */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-px flex-1" style={{ backgroundColor: 'rgba(139,30,30,0.15)' }} />
                                <span
                                    className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
                                    style={{ backgroundColor: 'rgba(139,30,30,0.1)', color: '#8B1E1E' }}
                                >
                                    Bagian {page + 1} dari {totalPages}
                                </span>
                                <div className="h-px flex-1" style={{ backgroundColor: 'rgba(139,30,30,0.15)' }} />
                            </div>

                            {/* Paragraph */}
                            <p
                                className="leading-relaxed text-justify"
                                style={{
                                    fontSize,
                                    color: theme.text,
                                    fontFamily: "'EB Garamond', serif",
                                    lineHeight: '1.9',
                                    letterSpacing: '0.01em',
                                }}
                            >
                                {paragraphs[page]}
                            </p>

                            {/* Ornament bawah */}
                            {page === totalPages - 1 && (
                                <div className="flex flex-col items-center gap-3 mt-10">
                                    <div className="flex items-center gap-2">
                                        <div className="h-px w-16" style={{ backgroundColor: 'rgba(139,30,30,0.2)' }} />
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" style={{ color: '#8B1E1E', opacity: 0.4 }}><path fill="currentColor" d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08z"/></svg>
                                        <div className="h-px w-16" style={{ backgroundColor: 'rgba(139,30,30,0.2)' }} />
                                    </div>
                                    <p className="text-xs font-medium" style={{ color: 'rgba(139,30,30,0.5)' }}>Selesai dibaca</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* ── Footer Navigation ──────────────────────────────────── */}
                {content && (
                    <div
                        className="px-6 py-4 shrink-0 flex items-center gap-4"
                        style={{
                            borderTop: `1px solid ${theme.id === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(139,30,30,0.1)'}`,
                            backgroundColor: theme.id === 'dark' ? '#110E0D' : theme.bg,
                        }}
                    >
                        {/* Prev */}
                        <button
                            onClick={goPrev}
                            disabled={page === 0}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                            style={{
                                backgroundColor: 'rgba(139,30,30,0.1)',
                                color: '#8B1E1E',
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M15.41 7.41L14 6l-6 6l6 6l1.41-1.41L10.83 12z"/></svg>
                            Sebelumnya
                        </button>

                        {/* Progress bar */}
                        <div className="flex-1 flex flex-col gap-1.5">
                            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(139,30,30,0.12)' }}>
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{ width: `${progress}%`, backgroundColor: '#8B1E1E' }}
                                />
                            </div>
                            <p className="text-center text-xs" style={{ color: theme.id === 'dark' ? 'rgba(232,221,208,0.4)' : 'rgba(45,41,38,0.4)' }}>
                                {Math.round(progress)}% selesai
                            </p>
                        </div>

                        {/* Next */}
                        <button
                            onClick={goNext}
                            disabled={page === totalPages - 1}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                            style={{
                                backgroundColor: page === totalPages - 1 ? 'rgba(139,30,30,0.1)' : '#8B1E1E',
                                color: page === totalPages - 1 ? '#8B1E1E' : 'white',
                            }}
                        >
                            Selanjutnya
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M10 6L8.59 7.41L13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
