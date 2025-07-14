import React, { useState } from 'react'
import DashboardLayout from '../../components/Layouts/DashboardLayout'

import LOGO from "../../assets/logo.png"
import Login from '../../components/Auth/Login';
import Signup from '../../components/Auth/Signup';


const AdminLogin = () => {
  const [currentPage, setCurrentPage]=useState("login");
  return (
    <>
    <div className='bg-white py-5 border-b border-gray-50'>
      <div className='container mx-auto'>
        <img src={LOGO} alt="logo" className='h-[26px] pl-6'/>
      </div>

      <div className='min-h-[calc(100vh-67px)] flex items-center justify-center'>
        <div className='bg-white rounded-2xl overflow-hidden shadow-2xl shadow-gray-200/60'>
          {currentPage==="login"?(
            <Login setCurrentPage={setCurrentPage} />
          ):(
            <Signup setCurrentPage={setCurrentPage} />
          )}
        </div>
      </div>
    </div>
    </>
  )
}

export default AdminLogin
