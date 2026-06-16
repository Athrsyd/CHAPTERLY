import { createContext, useState, useContext } from 'react'
import { useEffect } from 'react'

export const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
    const STORAGE_KEY = 'chapterly_cart'

    const loadFromStorage = () => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            return raw ? JSON.parse(raw) : []
        } catch {
            return []  // fallback kalau JSON corrupt
        }
    }

    const [items, setItems] = useState(loadFromStorage);
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    }, [items])

    const addToCart = (book) => {
        setItems(prev => {
            if (prev.find(b => b.id === book.id)) return prev  // sudah ada, skip
            return [...prev, book]
        })
    }


    const removeFromCart = (bookId) => {
        setItems(prev => prev.filter(b => b.id !== bookId))
    }

    const isInCart = (bookId) => items.some(b => b.id === bookId)

    const clearCart = () => setItems([])

    const totalPrice = items.reduce((sum, b) => sum + Number(b.price || 0), 0)

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, isInCart, clearCart, totalPrice }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const ctx = useContext(CartContext)
    if (!ctx) throw new Error('useCart harus dipakai di dalam CartProvider')
    return ctx
}
