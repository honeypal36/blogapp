import React from 'react'
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import SideMenu from './BlogLayout/SideMenu';

import LOGO from "../../assets/logo.png"


const Navbar = ({activeMenu}) => {
    const [openSideMenu, setOpenSideMenu]=useState(false);
  return (
    <div className='flex gap-5 bg-white border border-gray-200/5 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30'>
      <button
        className='block lg:hidden text-black -mt-1'
        onClick={()=>{
            setOpenSideMenu(!setOpenSideMenu);
        }}
      >
        {openSideMenu ? (
            <HiOutlineX className='text-2xl' />
        ):(
            <HiOutlineMenu className='text-2xl' />
        )}
      </button>

      <img src={LOGO} alt="logo" className='h-[24px] md:h-[26px]'/>

      {openSideMenu && (
        <div className='fixed top-[61px] -ml-4 bg-white'>
            <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  )
}

export default Navbar
