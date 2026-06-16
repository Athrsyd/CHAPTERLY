import { Navigate } from 'react-router-dom'
import useAuth from '../Hooks/useAuth'

const ProtectedRoute = ({ children, roles }) => {
    const { user, loading } = useAuth()

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-tertiary">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    )

    if (!user) return <Navigate to="/login" replace />

    if (roles && !roles.includes(user.role)) {
        // Redirect to correct dashboard based on role
        if (user.role === 'owner') return <Navigate to="/superadmin/dashboard" replace />
        if (user.role === 'author') return <Navigate to="/admin/dashboard" replace />
        return <Navigate to="/dashboard" replace />
    }

    return children
}

export default ProtectedRoute
