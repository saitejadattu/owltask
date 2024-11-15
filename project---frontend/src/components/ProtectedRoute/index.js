import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie"
import React from 'react'

const ProtectedRoute = () => {
    const jwtToken = Cookies.get("jwtToken")
    return jwtToken === undefined ? <Navigate to="/login" /> : <Outlet />
}

export default ProtectedRoute
