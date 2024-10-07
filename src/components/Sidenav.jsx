import React, { useState, useEffect } from 'react';
import logo from '../assets/navlogo.png'
import home from '../assets/Home.png'
import help from '../assets/Help.png'
import users from '../assets/Users.png'
import grades from '../assets/Grades.png'
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Sidenav = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false); // State to toggle sidebar on smaller screens
  const [user, setUser] = useState(null); // State to store user info

  const navigate = useNavigate();

  // Fetch user data 
  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://16.171.33.87:8000/api/user_detail/', {
        withCredentials: true,
        headers: {
          Authorization: 'Token ' + localStorage.getItem('token'),
        },
      });
      setUser(response.data?.username); 
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUser('User');
    }
  };

  const navLinkStyles = ({ isActive }) => {
    return {
      backgroundColor: isActive ? '#DAF2FF80' : '',  // Active background color
      borderRight: isActive ? '10px solid #0E2633' : '',  // Active border-right style
    };
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="flex h-screen relative">
      {/* Sidebar for large screens */}
      <div className={`w-fit lg:w-[15%] bg-white font-Inter shadow-right flex flex-col justify-between z-50 fixed left-0 h-full lg:flex ${isSidebarOpen ? 'block' : 'hidden'} lg:block`}>
        {/* Top section */}
        <div>
          <div className="text-center py-4">
            <img className="inline-block" src={logo} alt="Academix Pro" />
          </div>

          <NavLink to="home" style={navLinkStyles} className="flex items-center gap-4 px-10 text-xl text-[#313131] border-opacity-20 py-5 border-b border-solid border-[#313131]">
            <img className="w-5 h-5" src={home} alt="Home" />
            <p>Home</p>
          </NavLink>

          <NavLink to={`/user/questions`} style={navLinkStyles} className="flex items-center gap-4 px-10 text-xl text-[#313131] border-opacity-20 py-5 border-b border-solid border-[#313131]">
            <img className="w-5 h-5" src={help} alt="Questions" />
            <p>Questions</p>
          </NavLink>

          <div className="flex items-center gap-4 px-10 text-xl text-[#313131] border-opacity-20 py-5 border-b border-solid border-[#313131]">
            <img className="w-5 h-5" src={users} alt="Users" />
            <p>Friends <span className='text-xs bg-red-300 px-1 rounded'>Soon</span></p>
          </div>
          
          <NavLink to="assess" style={navLinkStyles} className="flex items-center gap-4 px-10 text-xl text-[#313131] border-opacity-20 py-5 border-b border-solid border-[#313131]">
            <img className="w-5 h-5" src={grades} alt="Grades" />
            <p>Assessment</p>
          </NavLink>
        </div>

        {/* Bottom section for Settings/Logout */}
        <div className="flex items-center gap-4 px-10 text-xl text-[#313131] py-5 cursor-pointer" onClick={handleLogout}>
          <p className='flex gap-2 items-center'> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" /></svg>Logout</p>
        </div>

        {/* X button to close the sidebar on smaller screens */}
        <div className="absolute top-4 right-4 lg:hidden" onClick={() => setSidebarOpen(false)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>


      {/* Main content */}
      <div className="flex-1 py-6 lg:pl-8 pl-4 pr-3 lg:p-8 bg-white w-full lg:w-[85%] absolute right-0">
        <Outlet context={{ user, setSidebarOpen }} />
      </div>
    </div>
  );
};
