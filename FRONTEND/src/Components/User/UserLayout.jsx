import React from 'react'
import UserSidebar from './UserSidebar'

const UserLayout = ({ children }) => {
    return (
        <div className="flex w-full min-h-screen bg-gray-50 font-jakarta">
            <UserSidebar />
            <main className="flex-1 ml-64 px-8 py-7">
                {children}
            </main>
        </div>
    )
}

export default UserLayout