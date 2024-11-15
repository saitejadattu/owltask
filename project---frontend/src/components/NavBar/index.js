import React from 'react'
import Cookies from "js-cookie"
import "./index.css"
import {useNavigate} from "react-router-dom"
const NavBar = (props) => {
    const navigate = useNavigate()
    const handleLogOut = () => {
        Cookies.remove("jwtToken")
        navigate("/login")
    }
    return (
        <div className='nav-container'>
            <h1>TaskManager</h1>
            <button value="signup" onClick={handleLogOut}>Logout</button>
        </div>
    )
}

export default NavBar
