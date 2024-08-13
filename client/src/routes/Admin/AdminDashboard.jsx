import React, { useEffect, useRef, useState } from 'react'
import styles from './../styles.module.css'
import { FaAlignJustify, FaTimes, FaUser, FaUserFriends, FaTrash } from 'react-icons/fa'
import { BsSearch, BsGraphUpArrow, BsArrowLeftCircleFill } from 'react-icons/bs'
import {
    actOnSideNav, actOnCreatePen,
    actOnAdminPenListSearch, actOnAdminPenListArray,
    actOnUpdateAdminList, actOnUpdatePen
} from '../../redux/pageinterraction'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { HideLoading, Loading } from 'react-loading-ui';

const AdminDashboard = () => {
    const navigate = useNavigate()

    //---------------------VERIFY THE COOKIES OF THE UA ---------------------------------//
    const [verification, setverification] = useState(false);
    const [userCredentials, setUserCredentials] = useState(false);
    const [adminCredntials, setAdminCredentials] = useState({});


    useEffect(function () {
        const sendRequest = async function () {
            try {
                const getSessionToken = sessionStorage.getItem('session')
                const convertToken = JSON.parse(getSessionToken)
                const ds = { 'cookies': convertToken.cookies }
                const url = 'http://localhost:5002/login';
                const request = await axios.get(url, { headers: ds })
                const response = request.status
                // console.log(response)
                if (response === 200) {
                    setverification(true)
                    HideLoading()
                } else {
                    setverification(false)
                    setUserCredentials(false)
                }
            } catch (e) {
                console.log({ e: e })
                if (e) {
                    setUserCredentials(true)
                }
            }

        }
        sendRequest()
    }, [])

    const handleAdminCredentialsInput = (e) => {
        const { name, value } = e.target
        setAdminCredentials({ ...adminCredntials, [name]: value })
    }
    const hanleAdminCredentialsSubmit = async () => {
        // sessionStorage.clear()
        Loading()
        const url = "http://localhost:5002/login"
        const sendRequest = await axios.post(url, adminCredntials)
        const responsestatus = sendRequest.status
        const responseData = sendRequest.data
        console.log(responsestatus)
        if (responsestatus === 200) {
            const convertToString = JSON.stringify(responseData)
            sessionStorage.setItem('session', convertToString)
            navigate('/admin')
            window.location.reload()
            HideLoading()
        }else{
            alert('your credentials are not valid.')
        }
    }

    //-------------------------- OUTSIDE COOKIES CODE---------------------------//
    const location = useLocation()
    const dispatch = useDispatch()
    const triggerActionUrl = location.pathname
    const storeTriggerUrl = useRef(triggerActionUrl)

    //------------ALL PAGE STATE-----------------------//

    const sideNavState = useSelector(function (state) {
        return state.page.sideNav
    })
    const createPenState = useSelector(function (state) {
        return state.page.createPen
    })
    const updatePenState = useSelector(function (state) {
        return state.page.updatePen
    })
    const responsecheckState = useSelector(function (state) {
        return state.page.responseCheck
    })
    const adminPenListSearchState = useSelector(function (state) {
        return state.page.adminPenListSearch
    })
    const adminPenListArrayState = useSelector(function (state) {
        return state.page.adminPenListArray
    })
    const updateAdminListState = useSelector(function (state) {
        return state.page.updateAdminList
    })


    //----------------FUNCTION TO SEARCH ALL LIST ------------------------//
    const fetchListOfDataFromDb = async function () {
        try {
            const url = 'http://localhost:5002/create'
            const fetch = await axios.get(url)
            const response = fetch.data
            const ds = dispatch(actOnAdminPenListArray([...adminPenListArrayState, ...response]))
        } catch (e) {
            console.log({ erro: e })
        }
    }
    //----------------USEEFFECT SEARCH ALL LIST ------------------------//

    useEffect(function () {
        fetchListOfDataFromDb()
        const currentUrlLocation = location.pathname
        if (currentUrlLocation !== storeTriggerUrl.current) {
            dispatch(actOnCreatePen(!createPenState))
            dispatch(actOnSideNav(!sideNavState))
        }
        return function () {
            const empty = []
            dispatch(actOnAdminPenListArray(empty))
            dispatch(actOnAdminPenListSearch(empty))
            dispatch(actOnUpdateAdminList({}))
        }
    }, [])
    //----------------ADMIN PAGE SEARCH BUTTON  ------------------------//

    const handleAdminSearch = () => {
        const ss = adminPenListArrayState.filter(function (details) {
            const word = adminPenListSearchState.AdminSearch
            const configures = word.replace(/\s/g, '')
            return details.title === configures
        })
        dispatch(actOnAdminPenListArray(ss))
    }

    //----------------ADMIN PAGE SEARCH INPUT  ------------------------//

    const handleAdminInput = (e) => {
        const { name, value } = e.target
        dispatch(actOnAdminPenListSearch({ ...adminPenListSearchState, [name]: value }))
    }

    //----------------CREATE PEN BUTTON ------------------------//

    const handleAdminCreatePen = async () => {

        const url = 'http://localhost:5002/create'
        try {
            const sendRequest = await axios.post(url, updateAdminListState)
            const response = sendRequest.status
            console.log(response)
            if (response === 200) {
                alert('succefully created')
            } else if (response !== 200) {
                alert('error!! pen might be available in the list already')
            }
        } catch (e) {
            console.log({ error: e })
            alert('error!! pen might be available in the list already.  USE THE REFRESH BUTTON')
        }

        dispatch(actOnCreatePen(!createPenState))
    }
    //----------------CREATE PEN USER INPUT ------------------------//

    const handleAdminCreatePenChanges = (e) => {
        const { name, value } = e.target
        dispatch(actOnUpdateAdminList({ ...updateAdminListState, [name]: value }))

    }

    //----------------UPDATE PEN BUTTON ------------------------//

    const handleAdminUpdatePen = async (e) => {
        const uniqueId = updateAdminListState.id
        dispatch(actOnUpdatePen(!updatePenState))
        const url = `http://localhost:5002/api/${uniqueId}`
        try {
            const sendRequest = await axios.post(url, updateAdminListState)
            const response = sendRequest.status
            if (response === 200) {
                alert('succefully updated')
            } else {
                alert('error!!')
            }
        } catch (e) {
            console.log({ error: e })
            if (e) {
                alert('error in your data upload, check and re-upload')
            }
        }
    }
    //----------------UPDATE PEN USER INPUT ------------------------//

    const handleAdminUpdatePenChanges = (e) => {
        const { name, value } = e.target
        dispatch(actOnUpdateAdminList({ ...updateAdminListState, [name]: value }))

    }


    //----------------EMPTY ALL PEN LIST FUNCTION ------------------------//
    const emptyArr = function () {
        const empty = []
        dispatch(actOnAdminPenListArray(empty))
    }

    //----------------REFERESH ALL PEN LIST FUNCTION ------------------------//

    const adminRefresh = async (clear) => {
        clear = emptyArr
        Loading()
        try {
            clear()
            setTimeout(async function () {
                const url = 'http://localhost:5002/create'
                const fetch = await axios.get(url)
                const response = fetch.data
                // console.log(response, adminPenListArrayState)
                dispatch(actOnAdminPenListArray(response))
                Loading()
            }, 1200)
            // console.log(5)
        } catch (e) {
            console.log({ erro: e })
        }
    }
    //----------------DELETE PEN FROM DATABSE ------------------------//


    return (
        <>
            <div className='lg:block md:block sm:hidden'>
                {verification ? <div className='w-[100svw] h-[100svh] flex relative z-[999]'>
                    {createPenState ? "" :
                        <div className={`${createPenState ? "" : styles.createPen} ${createPenState ? "opacity-100" : 'opacity-100'} `}>
                            <div className='w-full h-[7svh] flex justify-end items-center'>
                                <FaTimes className='fill-red text-[calc(1px_+_2svw_+_2svh)] cursor-pointer' onClick={function () {
                                    dispatch(actOnCreatePen(!createPenState))
                                }} />
                            </div>
                            <div className='w-full h-[5svh]'></div>
                            <form action="" className='space-y-5' onSubmit={handleAdminCreatePen}>
                                <label htmlFor="">
                                    <h3 className='font-[700] text-xl text-whites capitalize'>enter the pen name/number here:</h3>
                                    <input type="text" name="name" id="" onChange={handleAdminCreatePenChanges} className='w-[100%] h-[8svh] outline-none px-4 text-[calc(1px_+_2svw_+_2svh)] capitalize' />
                                </label>
                                <label htmlFor="">
                                    <h3 className='font-[700] text-xl text-whites capitalize'>enter the pen description here:</h3>
                                    <input type="text" name="desc" id="" onChange={handleAdminCreatePenChanges} className='w-[100%] h-[8svh] outline-none px-4 text-[calc(1px_+_2svw_+_2svh)] capitalize' />
                                </label>
                                <div className='w-full h-[8svh] flex justify-center items-center cursor-pointer' >
                                    <h3 className='w-[10svw] h-[7svh] bg-red rounded-lg text-whites text-2xl text-center capitalize flex justify-center items-center' onClick={handleAdminCreatePen}>submit</h3>
                                </div>
                            </form>
                        </div>
                    }
                    {updatePenState ? "" :
                        <div className={`${updatePenState ? "" : styles.updatetePen} ${updatePenState ? "opacity-100" : 'opacity-100'} `}>
                            <div className='w-full h-[7svh] flex justify-end items-center'>
                                <FaTimes className='fill-red text-[calc(1px_+_2svw_+_2svh)] cursor-pointer' onClick={function () {
                                    dispatch(actOnUpdatePen(!updatePenState))
                                }} />
                            </div>
                            <div className='w-full h-[5svh]'></div>
                            <form action="" className='space-y-5' onSubmit={handleAdminUpdatePen}>
                                <label htmlFor="">
                                    <h3 className='font-[700] text-xl text-whites capitalize'>enter the pen name/number here:</h3>
                                    <input type="text" name="id" id="" onChange={handleAdminUpdatePenChanges} className='w-[100%] h-[4svh] outline-none px-4 text-[calc(1px_+_1svw_+_1svh)] capitalize' />
                                </label>
                                <label htmlFor="">
                                    <h3 className='font-[700] text-xl text-whites capitalize'>egg production today:</h3>
                                    <input type="number" name="egg" id="" onChange={handleAdminUpdatePenChanges} className='w-[100%] h-[4svh] outline-none px-4 text-[calc(1px_+_1vw_+_1vh)] capitalize' />
                                </label>
                                <label htmlFor="">
                                    <h3 className='font-[700] text-xl text-whites capitalize'>feed consumptionn today:</h3>
                                    <input type="number" name="feed" id="" onChange={handleAdminUpdatePenChanges} className='w-[100%] h-[4svh] outline-none px-4 text-[calc(1px_+_1svw_+_1svh)] capitalize' />
                                </label>
                                <label htmlFor="">
                                    <h3 className='font-[700] text-xl text-whites capitalize'>No of motality today:</h3>
                                    <input type="number" name="motal" id="" onChange={handleAdminUpdatePenChanges} className='w-[100%] h-[4svh] outline-none px-4 text-[calc(1px_+1svw_+1svh)] capitalize' />
                                </label>
                                <label htmlFor="">
                                    <h3 className='font-[700] text-xl text-whites capitalize'>Date:</h3>
                                    <input type="date" name="date" id="" onChange={handleAdminUpdatePenChanges} className='w-[100%] h-[4svh] outline-none px-4 text-[calc(1px_+_1svw_+_1svh)] uppercase' />
                                </label>
                                <div className='flex justify-evenly'>
                                    <select name="month" id="" onChange={handleAdminUpdatePenChanges}>
                                        <option value="JANUARY" disabled selected> MONTH</option>
                                        <option value="JAN" > JANUARY</option>
                                        <option value="FEB"> FEBRUARY</option>
                                        <option value="MAR"> MARCH</option>
                                        <option value="APRL"> APRIL</option>
                                        <option value="MAY"> MAY</option>
                                        <option value="JUN"> JUNE</option>
                                        <option value="JUL"> JULY</option>
                                        <option value="AUG"> AUGUST</option>
                                        <option value="SEPT"> SEPTEMBER</option>
                                        <option value="OCT"> OCTOBER</option>
                                        <option value="NOV"> NOVEMBER</option>
                                        <option value="DEC"> DECEMBER</option>
                                    </select>
                                    <select name="year" id="" onChange={handleAdminUpdatePenChanges}>
                                        <option value="2024" disabled selected>YEAR</option>
                                        <option value="2024">2024</option>
                                    </select>
                                </div>

                                <div className='w-full h-[8svh] flex justify-center items-center cursor-pointer' >
                                    <h3 className='w-[10svw] h-[70%]  bg-red rounded-lg text-whites text-2xl text-center capitalize flex justify-center items-center' onClick={handleAdminUpdatePen}>update</h3>
                                </div>
                            </form>
                        </div>
                    }

                    <div className={`${sideNavState ? styles.sideNav_small : styles.sideNav_small_2} transition-all duration-[.5s] z-[1]`}>
                        <div className='w-full h-[20%] flex flex-col items-center py-2 px-2'>
                            {sideNavState ? <FaAlignJustify className='fill-whites  text-[calc(1px_+_1.5svw_+_1.5svh)] cursor-pointer hover:text-[calc(1px_+_1.7svw_+_1.7svh)] transition-all duration-500 ' onClick={function () {
                                dispatch(actOnSideNav(!sideNavState))
                            }} /> : <BsArrowLeftCircleFill className='fill-whites  text-[calc(1px_+_1.5svw_+_1.5svh)] self-end ' onClick={function () {
                                dispatch(actOnSideNav(!sideNavState))
                            }} />}
                        </div>
                        <div className={`w-full h-[80%] flex flex-col items-end px-3 `}>
                            <Link to={'/admin'} className='w-full h-[15%]'>
                                {sideNavState ?
                                    <FaUser className={`${sideNavState ? 'block hover:cursor-pointer hover: w-full fill-[white]' : 'hidden'} transition-all duration-[.5s] text-[calc(1px_+_1.5svw_+_1.5svh)] hover:text-[calc(1px_+_1.7svw_+_1.7svh)] `} />
                                    :
                                    <div className={`${sideNavState ? '' : 'w-[20svh] rounded-lg h-[5svh] text-[calc(1px_+_1svw_+_1svh)] text-center  cursor-pointer capitalize font-[700] text-blue border-blue bg-whites'}  transition-all duration-[.5s]`}>admin</div>
                                }
                            </Link>
                            <Link to={'/partners'} className='w-full h-[15%]'>
                                {sideNavState ?
                                    <FaUserFriends className={`${sideNavState ? 'block hover:cursor-pointer w-full fill-[white]' : 'hidden'} transition-all duration-[.5s] text-[calc(1px_+_1.5svw_+_1.5svh)] hover:text-[calc(1px_+_1.7svw_+_1.7svh)] `} />
                                    :
                                    <div className={`${sideNavState ? '' : 'w-[20svh] rounded-lg h-[5svh] text-[calc(1px_+_1svw_+_1svh)] text-center  cursor-pointer capitalize font-[700] text-blue border-blue bg-whites'}  transition-all duration-[.5s]`}>partners</div>
                                }
                            </Link>
                            {/* <Link to={'/analysis'} className='w-full h-[15%]'>
                                {sideNavState ?
                                    <BsGraphUpArrow className={`${sideNavState ? 'block hover:cursor-pointer w-full fill-[white]' : 'hidden'} transition-all duration-[.5s] text-[calc(1px_+_1.5svw_+_1.5svh)] hover:text-[calc(1px_+_1.7svw_+_1.7svh)] `} />
                                    :
                                    <div className={`${sideNavState ? '' : 'w-[20svh] rounded-lg h-[5svh] text-[calc(1px_+_1svw_+_1svh)] text-center  cursor-pointer capitalize font-[700] text-blue border-blue bg-whites'}  transition-all duration-[.5s]`}>analysis</div>
                                }
                            </Link> */}
                        </div>
                    </div>
                    <div className={`${sideNavState ? styles.sideNav_large_2 : styles.sideNav_large} transition-all duration-[.5s] ${createPenState ? 'opacity-100' : 'opacity-70'} z-[1]`}>
                        <div className='h-[10svh] w-full flex '>
                            <div className='w-[33%] h-full flex justify-start items-center'>
                                <Link to={'/'} className='w-[50%]'> <h3 className='w-full font-sans font-[600] text-[calc(1.5px_+_1svw_+_1.5svh)] text-center capitalize border border-blue text-red cursor-pointer hover:text-white hover:bg-red hover:border-none'>animal care</h3></Link>
                            </div>
                            <div className='w-[33%] h-full flex justify-center items-center'>
                                <form action="" className='w-[90%] h-[50%]' onSubmit={handleAdminSearch}>
                                    <label htmlFor="">
                                        <input type="text" name="AdminSearch" id="" onChange={handleAdminInput} className='w-[100%] rounded-s-lg h-full border border-slate-400 outline-none' />
                                    </label>
                                </form>
                                <BsSearch onClick={handleAdminSearch} className='w-[10%] h-[50%] p-[.4rem] bg-red fill-whites rounded-e-lg text-[calc(1.5px_+_1svw_+_1.5svh)] hover:cursor-pointer hover:p-[.3rem] transition-all duration-500' />
                            </div>
                            <div className='w-[33%] h-full flex justify-end items-center'>
                                <h3 className='w-[50%] font-sans font-[600] text-[calc(1.5px_+_1svw_+_1.5svh)] text-center capitalize border border-blue text-red '>admin</h3>
                            </div>
                        </div>
                        <div className='w-full h-[5svh] flex justify-evenly items-center'>
                            <div className='w-[33%] h-full flex justify-start items-center px-4  '>
                                <h3 className='w-[50%] font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] text-center capitalize border border-blue bg-blue text-whites rounded-lg cursor-pointer hover:shadow-lg hover:shadow-slate-500 transition-all duration-[.7s]' onClick={adminRefresh}>referesh list</h3>
                            </div>
                            <div className='w-[33%] h-full flex justify-end items-center px-4'>
                                <h3 className={`w-[90%] font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] text-center capitalize  text-whites bg-red hover:shadow-lg hover:shadow-slate-500 transition-all duration-[.7s] rounded-lg hover:cursor-pointer ${createPenState ? 'opacity-100' : 'opacity-10'}`} onClick={function () {
                                    dispatch(actOnCreatePen(!createPenState))
                                }}>create pen</h3>
                            </div>
                            <div className='w-[33%] h-full flex justify-end items-center px-4'>
                                <h3 className={`w-[50%] font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] text-center capitalize  text-whites bg-blue hover:shadow-lg hover:shadow-slate-500 transition-all duration-[.7s] rounded-lg hover:cursor-pointer ${createPenState ? 'opacity-100' : 'opacity-10'}`} onClick={function () {
                                    dispatch(actOnUpdatePen(!updatePenState))
                                }}>update pen</h3>
                            </div>
                        </div>
                        <div className='w-full h-[5svh] flex justify-end items-center px-4 gap-3 '>
                        </div>

                        <div className='w-full h-[50svh] space-y-5 overflow-scroll overflow-x-hidden'>
                            {adminPenListArrayState.map(function (details) {
                                const { _id: id, title } = details
                                return (
                                    <div className='flex' key={id}>
                                        <Link to={`/Adminlist/${title}`} className='w-[90%] h-[10svh]  flex rounded-s-full shadow-md shadow-slate-500 hover:shadow-xl transition-all duration-500'>
                                            <div className='w-[25%] h-full border border-black flex items-center rounded-s-full'>
                                                <h3 className='w-[100%] h-[50%] font-sans font-[600] text-[calc(1.5px_+_1svw_+_1svh)] text-center capitalize'>{details.title}</h3>
                                            </div>
                                            <div className='w-[25%] h-full border border-black flex items-center'>
                                                <h3 className='w-[100%] h-[50%] font-sans font-[600] text-[calc(1.5px_+_1svw_+_1svh)] text-center capitalize'>{details.noOfP}--</h3>
                                            </div>
                                            <div className='w-[25%] h-full border border-black flex items-center'>
                                                <h3 className='w-[100%] h-[50%] font-sans font-[600] text-[calc(1.5px_+_1svw_+_1svh)] text-center capitalize'>{details.noOfF}--</h3>
                                            </div>
                                            <div className='w-[25%] h-full border border-black flex items-center'>
                                                <h3 className='w-[100%] h-[50%] font-sans font-[600] text-[calc(1.5px_+_1svw_+_1svh)] text-center capitalize'>{details.noOfM}--</h3>
                                            </div>
                                        </Link>
                                        <div className='w-[10%] h-[10svh] p-3 border border-black flex items-center rounded-e-full shadow-md shadow-slate-500 cursor-pointer hover:bg-black transition-all duration-500'>
                                            <FaTrash className='w-[100%] h-[90%]  font-sans font-[600] text-[calc(1.5px_+_1svw_+_1svh)] text-center capitalize fill-[red] cursor-pointer ' onClick={async function () {
                                                const details = {
                                                    name: title,
                                                    id: id
                                                }
                                                try {
                                                    const confirmDelete = confirm('are you sure you want to delete, all data will be gone if deleted')
                                                    if (confirmDelete) {
                                                        const url = `http://localhost:5002/api/del/${details.id}`
                                                        const sendRequest = await axios.post(url, details)
                                                        const response = sendRequest.status
                                                        if (response === 200) {
                                                            alert('deleted')
                                                        } else {
                                                            alert('error')
                                                        }
                                                    } else {

                                                    }

                                                } catch (e) {
                                                    console.log({ error: e })
                                                }
                                                console.log(details)
                                            }} />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className='w-full h-[10svh]'></div>
                        <div className='w-full h-[20svh] border border-black flex justify-center items-center gap-5'>
                            <div className='w-[32%] h-[80%] border border-black'></div>
                            <div className='w-[32%] h-[80%] border border-black'></div>
                            <div className='w-[32%] h-[80%] border border-black'></div>
                        </div>
                    </div>
                </div> :
                    <div className='bg-whites h-[100svh] w-full'>
                        <div className='w-full h-[10svh] flex justify-start items-center'>
                            <Link to={'/'} className='w-[20%]'> <h3 className='w-full font-sans font-[600] text-[calc(1.5px_+_1svw_+_1.5svh)] text-center capitalize border border-blue text-red cursor-pointer'>animal care</h3></Link>
                            <h3 className='w-[80%] font-sans font-[600] text-[calc(1.5px_+_1svw_+_1.5svh)] text-center uppercase  text-red cursor-pointer'>farm 1 pen data record and statistics</h3>
                        </div>
                        <div className='w-full h-[90svh] bg-blue flex justify-center items-center'>
                            {userCredentials ?
                                <div className='w-[30%] h-[80%] bg-whites rounded-2xl'>
                                    <h3 className='w-full h-[10svh]  text-blue text-[calc(1px_+_1.2svw_+_1.2svh)] font-[600] uppercase flex justify-center items-center '>
                                        provide authorization
                                    </h3>
                                    <form action="" className='py-8 h-[70%] flex flex-col items-start justify-start gap-[3rem]' onSubmit={hanleAdminCredentialsSubmit}>
                                        <label htmlFor="" className='w-full h-[7svh]'>
                                            <h3 className='text-[calc(1px_+_1.1svh_+_1.1svw)] uppercase'>username:</h3>
                                            <input type="text" name="username" id="" className='border border-black bg-blue w-full h-full text-whites text-[calc(1px_+_1.1svh_+_1.1svw)] outline-none' onChange={handleAdminCredentialsInput} />
                                        </label>
                                        <label htmlFor="" className='w-full h-[7svh]'>
                                            <h3 className='text-[calc(1px_+_1.1svh_+_1.1svw)] uppercase'>password:</h3>
                                            <input type="text" name="password" id="" className='border border-black bg-blue w-full h-full text-whites text-[calc(1px_+_1.1svh_+_1.1svw)] outline-none' onChange={handleAdminCredentialsInput} />
                                        </label>
                                        <div className='w-full h-[7svh] flex justify-center items-center'>
                                            <h3 className='text-[calc(1px_+_1.1svh_+_1.1svw)] capitalize font-[500] bg-red w-[30%]  flex justify-center items-center rounded-xl hover:cursor-pointer text-whites hover:text-[calc(1px_+_1.2svh_+_1.2svw)]' onClick={hanleAdminCredentialsSubmit}>submit</h3>
                                        </div>
                                    </form>
                                    <Link to={'/partners'}> <div className='text-[calc(1px_+_.8svh_+_.8svw)] hover:text-red hover:cursor-pointer text-blue'>click here to login as a client</div></Link>
                                </div> : ''}
                        </div>
                    </div>}
            </div>
        </>
    )

}
export default AdminDashboard