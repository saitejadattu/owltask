import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./index.css"
const SignUp = () => {
    const [userDetails, setUserDetails] = useState({ "username": '', "email": '', "password": '' })
    const [showError, setShowError] = useState('')
    const navigate = useNavigate()
    const handleOnchange = (e) => {
        const { name, value } = e.target
        // console.log(e.target)
        setUserDetails((prevState) => ({ ...prevState, [name]: value }))
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(userDetails)
        const result = await axios.post("http://localhost:3006/user/signup ", userDetails)
        console.log(result)
        if (result.data.status === 200) {
            setShowError('')
            toast(result.data.message)
            navigate("/login")
        } else {
            setShowError(result.data.message)
            toast(result.data.message);
        }
        setUserDetails({ "username": '', "email": '', "password": '' })
    }
    // const fetchData = async () => {
    //     const response = await axios.get("http://localhost:3006/user/allusers")
    //     console.log(response.data)
    // }
    // useEffect(() => {
    //     fetchData()
    // }, [])
    return (
        <div className='login-bg-container'>
            <form className='login-container' onSubmit={handleSubmit}>
                <ToastContainer />
                <h1>Signup</h1>
                <br />
                <label htmlFor="name">Name</label>
                <br />
                <input value={userDetails.username} onChange={handleOnchange} name="username" id="name" type='text' className='in-input' placeholder='Enter your Name' required />
                <br />
                <br />
                <label htmlFor="email">Email</label>
                <br />
                <input value={userDetails.email} onChange={handleOnchange} name='email' id="email" type='email' className='in-input' placeholder='Enter your Email' required />
                <br />
                <br />
                <label htmlFor="password">Password</label>
                <br />
                <input value={userDetails.password} onChange={handleOnchange} name="password" id="password" type='password' className='in-input' placeholder='Enter your Password' required />
                <br />
                <br />
                <div className='submit-button-container'>
                    <button type="submit" vale="signup">SignUp</button>
                    <div className='error-msg'>
                        <p>{showError}</p>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default SignUp
