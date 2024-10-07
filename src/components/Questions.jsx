import React, { useState, useEffect } from 'react';
import axios from 'axios';
import profpic from '../assets/profpic.png';
import { parseISO, format } from 'date-fns';
import { Link, NavLink, useOutletContext } from 'react-router-dom';

export const Questions = () => {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  const { setSidebarOpen, user } = useOutletContext()

  const fetchData = async () => {
    try {
      const recentsResponse = await axios.get('http://16.171.33.87:8000/api/user_questions/', {
        withCredentials: true,
        headers: {
          "Authorization": "Token " + localStorage.getItem('token'),
        },
        
      }) ;


        setActivity(recentsResponse.data);
        // console.log(recentsResponse);

        setLoading(false); 
    } catch (error) {
        setError(error.message);
        setLoading(false); // 
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <p>Loading questions...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className='font-Inter text-[#313131]'>
        <div className='flex justify-between lg:justify-end items-center'>
        {/* Left Side */}
        <div className=" lg:hidden" onClick={() => setSidebarOpen(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
          </svg>
        </div>
        {/* Right Side */}
        <div className='flex justify-center items-center gap-4'>
          <div className='flex items-center gap-2 bg-[#DAF2FF] w-fit py-2 px-2 rounded-2xl text-base lg:text-xl font-semibold'>
            <img src={profpic} className=' w-6 lg:w-full' alt='user' /> 
            <p>{user}</p>
          </div>
          <div>
            <NavLink to='/user/generate' className='py-2 px-2 bg-[#0E2633] text-white rounded-xl text-base md:text-xl lg:text-2xl'>Generate</NavLink>
          </div>
        </div>  
      </div>
      <h2 className='text-2xl lg:text-4xl font-semibold mb-4 border-b border-solid pb-2 mt-12'>Questions</h2>
      <div className="mt-2">
        
        {/* Render recent activity or show "Nothing to see here" if no data */}
      <div>
        {activity && activity.questions && activity.questions.length === 0 ? (
          <p className='text-center text-xl py-6'>Nothing to see here</p>
        ) : (
          activity && activity.questions && activity.questions.map(item => (
            <Link to={`/user/questiondetails/${item.id}`} key={item.id} className='flex justify-between items-center py-4 lg:px-6 border-b border-solid border-black border-opacity-20'>
              <div className='grid grid-cols-5 lg:grid-cols-3 lg:justify-between w-full items-center'>
                <p className='text-base lg:text-xl font-semibold text-[#313131] col-span-2 lg:col-span-1'>{item.question_name}</p>
                <p className='bg-[#daf2ff] py-2 px-1 text-sm lg:text-base lg:px-3 w-fit rounded-xl col-span-2 lg:col-span-1 text-center'>{item.category}</p>
                <div className='col-span-1 text-sm lg:text-lg rounded-lg text-center'>{format(parseISO(item.date_created), 'MMM d')}</div>
              </div>
            </Link>
          ))
        )}
      </div>
      </div>
    </div>
  );
};
