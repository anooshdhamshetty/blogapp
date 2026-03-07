import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

function RootLayout() {
  return (
    <div className="app-container">
      <Header/>
      <div className="main-content" style={{minHeight:"100vh"}}>
        <Outlet/>
      </div>
      <Footer/>
    </div>
  )
}

export default RootLayout