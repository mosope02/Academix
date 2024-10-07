import React from 'react'
import splash from '../assets/academix_pro.png'
import { Link } from 'react-router-dom'
import sshot from '../assets/sshot.png'

export const Landing = () => {
  return (
    <div className='font-Inter h-screen'>
      {/* Top Navigation */}
        <div className='flex bg-white z-50 justify-between md:px-16 px-4 items-center pt-4'>
          {/* Left Side */}
            <div><img src={splash} className='md:w-20 w-20' alt="" /></div>

            {/* Right Side */}
            <div className='flex gap-6'>
              <Link to='/login' className='md:px-6 px-2 py-1 md:py-2 rounded-lg border-2 border-solid border-[#0E2633]'>Login</Link>
              <Link to='/signup' className='md:px-6 px-2 md:py-2 py-2 rounded-lg bg-[#0E2633] text-white font-semibold'>Signup</Link>
            </div>
        </div>
      {/* End of Top Navigation */}

      {/* Start of main content */}

      <div className='flex flex-col-reverse md:flex-row md:h-[92%] '>

        {/* Left Side */}
        <div className='md:w-[55%] h-full mt-4 md:mt-0 flex flex-col justify-center landing-left md:pl-16 px-5'>
          <h2 className='text-[#0E2633] md:text-5xl text-4xl height leading-[1.2] font-semibold block md:w-[70%] w-[95%] mb-4'>Convert Lecture Notes to Practice Questions Instantly</h2>
          <p className='md:w-[73%] w-[90%] mt-2 text-[#0E2633] text-xl mb-2'>Transform your lecture notes into custom practice questions that enhance retention, deepens understanding, and helps you ace your exams with targeted, effective sessions tailored just for you.</p>
          <div className='flex gap-4 mb-16 md:mt-0 mt-4'>
              <Link to='/login' className='px-6 py-2 rounded-lg border-2 border-solid border-[#0E2633]'>Login</Link>
              <Link to='/signup' className='px-6 py-2 rounded-lg bg-[#0E2633] text-white font-semibold'>Signup</Link>
            </div>
        </div>

        {/* Right Side */}

        <div className='flex justify-end md:w-[45%] w-[90%] mt-4 md:mt-0 landing-right h-full items-center'>
          <img src={sshot} className='h-3/4 md:w-full' alt="" />
        </div>


      </div>
    </div>
  )
}
