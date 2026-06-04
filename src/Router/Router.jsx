import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from '../Pages/LandingPage'
import Login from '../Pages/Auth/Login'
import Register from '../Pages/Auth/Register'

const Router = () => {
    return (
        <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            {/* <Route path='/dashboard' element={ } /> */}

        </Routes>
    )
}

export default Router