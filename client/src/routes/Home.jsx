// import dotenv from 'dotenv/config';
// import path from 'path'
import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { HideLoading, Loading } from 'react-loading-ui';

// dotenv.co



const Home = () => {
  const navigate = useNavigate()
  const [login, setLogin] = useState(true);
  const [userCredentials, setUserCredentials] = useState(false)
  const [adminCredntials, setAdminCredentials] = useState({})
  const handleAdminCredentialsInput = (e) => {
    const { name, value } = e.target
    setAdminCredentials({ ...adminCredntials, [name]: value })
  }
  const hanleAdminCredentialsSubmit = async () => {
    sessionStorage.clear()
    Loading()
    try {
      const url = "http://localhost:5002/login"
      const sendRequest = await axios.post(url, adminCredntials)
      const responsestatus = sendRequest.status
      const responseData = sendRequest.data
      if (responsestatus === 200) {
        const convertToString = JSON.stringify(responseData)
        sessionStorage.setItem('session', convertToString)
        setTimeout(() => {
          navigate('/admin')
        }, 300);
        Loading()
      }
    } catch (error) {
      alert('error connecting to database')
      HideLoading()
      console.log(e)
    }
  }
  return (
    <>
      <div className='lg:block md:hidden sm:hidden'>
        <div className='w-full h-[100svh] bg-whites'>
          <div className='w-full h-[10svh] flex justify-start items-center'>
            <Link to={'/'} className='w-[20%]'> <h3 className='w-full font-sans font-[600] text-[calc(1.5px_+_1svw_+_1.5svh)] text-center capitalize border border-blue text-red cursor-pointer'>animal care</h3></Link>
            <h3 className='w-[80%] font-sans font-[600] text-[calc(1.5px_+_1svw_+_1.5svh)] text-center uppercase  text-red cursor-pointer'>farm 1 pen data record and statistics</h3>
          </div>
          <div className='w-full h-[90svh] bg-blue flex justify-center items-center'>
            {login ?
              <div className='w-[50%] h-[80%] bg-whites rounded-2xl'>
                <h3 className='w-full h-[10svh]  text-blue text-[calc(1px_+_1.5svw_+_1.5svh)] font-[600] uppercase flex justify-center items-center '>
                  see our data and statistics
                </h3>
                <h3 className='w-full h-[10svh]  text-blue text-[calc(1px_+_1.5svw_+_1.5svh)] font-[600] uppercase flex justify-center items-center '>
                  login as
                </h3>
                <div className='w-full h-[30svh] flex justify-evenly items-center '>
                  <h3 className='w-[45%] rounded-2xl h-[10svh] text-[calc(1px_+_1.5svw_+_1.5svh)] font-[600] uppercase flex justify-center items-center hover:cursor-pointer hover:bg-blue hover:text-red  bg-red text-whites' onClick={function () {
                    setLogin(false)
                    setUserCredentials(!userCredentials)
                  }}>
                    admin
                  </h3>
                  <Link to={'/partners'} className='w-[45%]'> <h3 className='w-full rounded-2xl h-[10svh] text-[calc(1px_+_1.5svw_+_1.5svh)] font-[600] uppercase flex justify-center items-center hover:cursor-pointer hover:bg-blue hover:text-red bg-red text-whites'>
                    client
                  </h3></Link>
                </div>

              </div> : ''}
            {userCredentials ?
              <div className='w-[30%] h-[80%] bg-whites rounded-2xl'>
                <h3 className='w-full h-[10svh]  text-blue text-[calc(1px_+_1.2svw_+_1.2svh)] font-[600] uppercase flex justify-center items-center '>
                  provide authorization
                </h3>
                <form action="" className='py-8 h-[70%] flex flex-col items-start justify-start gap-[3rem]' onSubmit={hanleAdminCredentialsSubmit}>
                  <label htmlFor="" className='w-full h-[7svh]'>
                    <h3 className='text-[calc(1px_+_1.1svh_+_1.1svw)] font-[600] uppercase'>username:</h3>
                    <input type="text" name="username" id="" className='border border-black bg-blue w-full h-full text-whites text-[calc(1px_+_1.1svh_+_1.1svw)] outline-none' onChange={handleAdminCredentialsInput} />
                  </label>
                  <label htmlFor="" className='w-full h-[7svh]'>
                    <h3 className='text-[calc(1px_+_1.1svh_+_1.1svw)] font-[600] uppercase '>password:</h3>
                    <input type="password" name="password" id="" className='border border-black bg-blue w-full h-full text-whites text-[calc(1px_+_1.1svh_+_1.1svw)] outline-none pa' onChange={handleAdminCredentialsInput} />
                  </label>
                  <div className='w-full h-[7svh] flex justify-center items-center'>
                    <h3 className='text-[calc(1px_+_1.1svh_+_1.1svw)] capitalize font-[500] bg-red w-[30%]  flex justify-center items-center rounded-xl hover:cursor-pointer text-whites hover:text-[calc(1px_+_1.2svh_+_1.2svw)]' onClick={hanleAdminCredentialsSubmit}>submit</h3>
                  </div>
                </form>
                <Link to={'/partners'}> <div className='text-[calc(1px_+_.8svh_+_.8svw)] hover:text-red hover:cursor-pointer text-blue'>click here to login as a client</div></Link>
              </div> : ''}
          </div>
        </div>
      </div>
    </>
  )
}

export default Home













