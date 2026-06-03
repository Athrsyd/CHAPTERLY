import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from '../Pages/LandingPage'

const Router = () => {
    return (
        <Routes>
            <Route path='/' element={<LandingPage />} />
            {/* <Route path='/login' element={ } />
            <Route path='/register' element={ } />
            <Route path='/dashboard' element={ } /> */}

        </Routes>
    )
}

export default Router