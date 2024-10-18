import React from 'react'
import './sidebar.css'
import SidebarButton from './sidebarButton'
import { MdFavorite } from "react-icons/md";
import { FaGripfire, FaPlay } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { IoLibrary } from "react-icons/io5";
import { MdSpaceDashboard } from "react-icons/md";


export default function Sidebar() {
  return (
    <div className='sidebar-container'>
      <img src="src/assets/images/profile/profile.jpg" className='profile-img' alt="Profile" />
      <div>
         <SidebarButton title='Feed' to='/home/feed' icon={<MdSpaceDashboard />}/>
         <SidebarButton title='Trending' to='/home/trending' icon={<FaGripfire />}/>
         <SidebarButton title='Player' to='/home/player' icon={< FaPlay/>}/>
         <SidebarButton title='Favorites' to='/home/favorites' icon={<MdFavorite/>}/>
         <SidebarButton title='Library' to='/home' icon={<IoLibrary />}/>
      </div>
      <SidebarButton title='Sing Out' to='' icon={<FaSignOutAlt/>}/>
    </div>
  )
}
