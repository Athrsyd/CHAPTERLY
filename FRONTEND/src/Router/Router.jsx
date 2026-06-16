import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from '../Pages/LandingPage'
import Login from '../Pages/Auth/Login'
import Register from '../Pages/Auth/Register'

// Reader
import ReaderDashboard from '../Pages/Reader/Dashboard'
import ReaderBooks from '../Pages/Reader/Books'
import ReaderBookDetail from '../Pages/Reader/BookDetail'
import ReaderTransaksi from '../Pages/Reader/Transaksi'
import ReaderKeranjang from '../Pages/Reader/Keranjang'

// Admin (Author/Penulis)
import AdminDashboard from '../Pages/Admin/Dashboard'
import AdminKelolaBuku from '../Pages/Admin/KelolaBuku'
import AdminDataPenyewaan from '../Pages/Admin/DataPenyewaan'
import AdminProfil from '../Pages/Admin/Profil'

// Super Admin (Owner)
import SuperAdminDashboard from '../Pages/SuperAdmin/Dashboard'
import SuperAdminKelolaBuku from '../Pages/SuperAdmin/KelolaBuku'
import SuperAdminKelolAdmin from '../Pages/SuperAdmin/KelolaAdmin'
import SuperAdminKelolaUser from '../Pages/SuperAdmin/KelolaUser'
import SuperAdminKelolaTransaksi from '../Pages/SuperAdmin/KelolaTransaksi'

import ProtectedRoute from './ProtectedRoute'

const Router = () => {
    return (
        <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />

            {/* Reader routes */}
            <Route path='/dashboard' element={<ProtectedRoute roles={['reader','author','owner']}><ReaderDashboard /></ProtectedRoute>} />
            <Route path='/books' element={<ProtectedRoute roles={['reader','author','owner']}><ReaderBooks /></ProtectedRoute>} />
            <Route path='/books/:id' element={<ProtectedRoute roles={['reader','author','owner']}><ReaderBookDetail /></ProtectedRoute>} />
            <Route path='/transaksi' element={<ProtectedRoute roles={['reader','author','owner']}><ReaderTransaksi /></ProtectedRoute>} />
            <Route path='/keranjang' element={<ProtectedRoute roles={['reader','author','owner']}><ReaderKeranjang /></ProtectedRoute>} />

            {/* Admin (author) routes */}
            <Route path='/admin/dashboard' element={<ProtectedRoute roles={['author','owner']}><AdminDashboard /></ProtectedRoute>} />
            <Route path='/admin/kelola-buku' element={<ProtectedRoute roles={['author','owner']}><AdminKelolaBuku /></ProtectedRoute>} />
            <Route path='/admin/data-penyewaan' element={<ProtectedRoute roles={['author','owner']}><AdminDataPenyewaan /></ProtectedRoute>} />
            <Route path='/admin/profil' element={<ProtectedRoute roles={['author','owner']}><AdminProfil /></ProtectedRoute>} />

            {/* Super Admin (owner) routes */}
            <Route path='/superadmin/dashboard' element={<ProtectedRoute roles={['owner']}><SuperAdminDashboard /></ProtectedRoute>} />
            <Route path='/superadmin/kelola-user' element={<ProtectedRoute roles={['owner']}><SuperAdminKelolaUser /></ProtectedRoute>} />
            <Route path='/superadmin/kelola-admin' element={<ProtectedRoute roles={['owner']}><SuperAdminKelolAdmin /></ProtectedRoute>} />
            <Route path='/superadmin/kelola-buku' element={<ProtectedRoute roles={['owner']}><SuperAdminKelolaBuku /></ProtectedRoute>} />
            <Route path='/superadmin/kelola-transaksi' element={<ProtectedRoute roles={['owner']}><SuperAdminKelolaTransaksi /></ProtectedRoute>} />

            <Route path='*' element={<Navigate to='/' />} />
        </Routes>
    )
}

export default Router
