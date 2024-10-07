import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import xbutton from '../assets/xbutton.png'
import axios from 'axios'

export const Signup = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [last_name, setLastName] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [showError, setShowError] = useState(false)

    const handleName = (e) =>{
        setName(e.target.value)
    }

    const handleUsername = (e) => {
        setUsername(e.target.value)
    }

    const handleLastName= (e) => {
        setLastName(e.target.value)
    }

    const handlePassword = (e) => {
        setPassword(e.target.value)
    }

    const handleConfirm = (e) => {
        setConfirm(e.target.value)
        if (password !== e.target.value) {
            setShowError(true);
        } else {
            setShowError(false);
        }
    }

    const handleEmail = (e) => {
        setEmail(e.target.value)
    }

    const navigate = useNavigate()

    //Details from the form to be submitted
    const userInfo = {
        first_name: name,
        last_name: last_name,
        username: username,
        email: email,
        password: password,
    }
    const url = 'http://16.171.33.87:8000/api/register/'


    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            const response = await axios.post(url, userInfo)
            if(response.status === 201) {navigate('/login')}
            

        } catch (error) {
            console.log(error.status);
        }
    }

  return (
    //Page Content
    <div className='flex flex-wrap md:flex-nowrap items-center justify-center mx-auto h-screen w-screen py-4'>
        <div className='md:w-[60%] w-[95%] mx-auto bg-white shadow-[0_4px_50px_1px_rgba(0,0,0,0.25)] md:px-16 px-8 py-6 text-left items-center rounded-lg'>
            <div className='text-5xl font-semibold flex justify-between'>
                <h2>Register</h2>
                <div><Link to='/'><img src={xbutton} alt="" /></Link></div>
            </div>
            <div>
                <div>
                    <input autoFocus className='mt-12 border-b-[1px] border-b-black border-solid outline-none py-[10px] w-full' type="text" name="name" id="name" placeholder='Name' value={name} onChange={handleName} />
                </div>
                <div>
                    <input className='mt-8 border-b-[1px] border-b-black border-solid outline-none py-[10px] w-full' type="text" name="last name" id='last name' placeholder='lastname' value={last_name} onChange={handleLastName}/>
                </div>

                <div>
                    <input className='mt-8 border-b-[1px] border-b-black border-solid outline-none py-[10px] w-full' type="text" name="username" id="username" placeholder='Username' value={username} onChange={handleUsername} />
                </div>

                <div>
                    <input className='mt-8 border-b-[1px] border-b-black border-solid outline-none py-[10px] w-full' type="email" name="email" id="email" placeholder='Email' value={email} onChange={handleEmail} />
                </div>
                <div>
                    <input className='mt-8 border-b-[1px] border-b-black border-solid outline-none py-[10px] w-full' type="password" name='password' id='password' placeholder='Password' value={password} onChange={handlePassword}/>
                </div>
                <div>
                    <input className='mt-8 border-b-[1px] border-b-black border-solid outline-none py-[10px] w-full' type="password" name='confirm' id='confirm' placeholder='Confirm Password' value={confirm} onChange={handleConfirm}/>
                    <p className={`text-red-500 text-lg mt-2 ${showError ? 'inline-block' : 'hidden'}`}>Password does not match</p>
                </div>

                <div className='mt-10 text-center'>
                    <button className='bg-[#313131] px-6 py-2 text-white text-xl font-medium rounded-lg hover:shadow-[0_4px_50px_1px_rgba(0,0,0,0.25)]' onClick={handleSubmit}>Sign Up</button>
                    <p>Already have an account? <Link to="/login" className='underline text-[#3B9DD4]'>Log In</Link></p>
                </div>
            </div>
        </div>
    </div>
  )
}
