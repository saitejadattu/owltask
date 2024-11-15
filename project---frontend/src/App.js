import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginForm from './components/LoginForm'
import Home from './components/Home'
import SignUp from './components/SignUp'
import ProtectedRoute from './components/ProtectedRoute'
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SignUp />} path="/sign-up" />
        <Route element={<LoginForm />} path="/login" />
        <Route element={<ProtectedRoute />}>
          <Route element={<Home />} path="/" />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App