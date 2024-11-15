import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios"
import Cookies from "js-cookie"
import "./index.css"
const LoginForm = (props) => {
  const [userDetails, setUserDetails] = useState({ "email": '', "password": '' })
  const [showError, setShowError] = useState("")
  const navigate = useNavigate()
  const handleOnchange = (e) => {
    console.log(e.target.value)
    const { name, value } = e.target
    setUserDetails((prevState) => ({ ...prevState, [name]: value }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await axios.post("http://localhost:3006/user/login", userDetails)
    console.log(result)
    if(result.data.status==="success"){
      Cookies.set("jwtToken", result.data.jwtToken)
      toast(result.data.message)
      setTimeout(() => {
        navigate("/home")
      }, 4000)
      setShowError('')
    }else {
      setShowError(result.data.message)
      toast(result.data.message)
    }
    setUserDetails({ "email": '', "password": '' })
  }
  return (
    <div className='login-bg-container'>
      <form className='login-container' onSubmit={handleSubmit}>
        <ToastContainer />
        <h1>Login</h1>
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
          <p><Link to="/sign-up">click</Link> here to signup up</p>
          <button type="submit">Login</button>
          <p className='error-msg'>{showError}</p>
        </div>
      </form>
    </div>
  )
}

export default LoginForm
