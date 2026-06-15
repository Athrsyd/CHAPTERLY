import React from 'react'
import AdminSidebar from './AdminSidebar'

const AdminLayout = ({ children }) => {
    return (
        <div className="flex w-full min-h-screen bg-gray-50 font-jakarta">
            <AdminSidebar />
            <main className="flex-1 ml-64 px-8 py-7">
                {children}
            </main>
        </div>
    )
}

export default AdminLayout