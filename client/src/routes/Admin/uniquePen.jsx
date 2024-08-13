import React, { useEffect, useRef, useState } from 'react'
import styles from './../styles.module.css'
import { FaAlignJustify, FaUserFriends, FaPen, FaTimes } from 'react-icons/fa'
import { BsSearch, BsGraphUpArrow, BsArrowLeftCircleFill } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import {
    actOnSideNav, actOnuniquePenPageArrayList, actOnuniqueItemListing,
    actOnuniquePageListUpdate, actOnuniquePageListItemUpdate,
    actOnuniquePageListUpdateItemNewRecord,actOnFooterAnalysis
} from '../../redux/pageinterraction'
import { useLocation, Link, useParams, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { HideLoading, Loading } from 'react-loading-ui';



const UniquiePen = () => {
    const navigate = useNavigate()
    //---------------------VERIFY THE COOKIES OF THE UA ---------------------------------//
    const [verifications, setverification] = useState(false);
    const [userCredential, setUserCredentials] = useState(false);
    const [adminCredntials, setAdminCredentials] = useState({});
    useEffect(function () {
        const sendRequest = async function () {
            try {
                const getSessionToken = sessionStorage.getItem('session')
                const convertToken = JSON.parse(getSessionToken)
                const ds = { 'cookies': convertToken.cookies }
                const url = 'http://localhost:5002/login'
                const request = await axios.get(url, { headers: ds })
                const response = request.status
                if (response === 200) {
                    setverification(true)
                } else {
                    setverification(false)
                    setUserCredentials(false)
                }
            } catch (e) {
                // console.log({ e: e })
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
        sessionStorage.clear()
        Loading()
        const url = "http://localhost:5002/login"
        const sendRequest = await axios.post(url, adminCredntials)
        const responsestatus = sendRequest.status
        const responseData = sendRequest.data
        if (responsestatus === 200) {
            const convertToString = JSON.stringify(responseData)
            sessionStorage.setItem('session', convertToString)
            navigate('/admin')
            window.location.reload()
            Loading()
        }
    }

    const [filter, setFilter] = useState(true);
    const [filterQuery, setFilterQuery] = useState({})
    const location = useLocation()
    const dispatch = useDispatch()
    const triggerActionUrl = location.pathname
    const storeTriggerUrl = useRef(triggerActionUrl)

    const uniquePenArrayList = useSelector(function (state) {
        return state.page.uniquePenPageArrayList
    })
    const uniqueItemListing = useSelector(function (state) {
        return state.page.uniqueItemListing
    })
    const sideNavState = useSelector(function (state) {
        return state.page.sideNav
    })
    const createPenState = useSelector(function (state) {
        return state.page.createPen
    })
    const uniquePageListUpdateState = useSelector(function (state) {
        return state.page.uniquePageListUpdate
    })
    const uniquePageListItems = useSelector(function (state) {
        return state.page.uniquePageListUpdateItem
    })
    const uniquePageNewRecord = useSelector(function (state) {
        return state.page.uniquePageListUpdateItemNewRecord
    })
    const footerAnalysis = useSelector(function (state) {
        return state.page.footerAnalysis
    })
    const { id } = useParams()  
    useEffect(function () {
        const fetchUnique = async function () {
            try {
                const url = `http://localhost:5002/api/${id}`
                const fetch = await axios.get(url)
                const response = fetch.data
                dispatch(actOnFooterAnalysis(response[0]))
                // console.log(response[0])
                const ds = dispatch(actOnuniquePenPageArrayList([...uniquePenArrayList, response]))
                const dds = ds.payload[0]
                dispatch(actOnuniqueItemListing(dds))

                return function () {
                    const empty = []
                    dispatch(actOnuniqueItemListing(empty))
                    dispatch(actOnuniquePenPageArrayList(empty))
                }
            } catch (e) {
                console.log(e)
            }
        }
        fetchUnique()
    }, [])
    const clearList = () => {
        const empty = []
        dispatch(actOnuniqueItemListing(empty))
        dispatch(actOnuniquePenPageArrayList(empty))
    }
    const uniqueId = uniqueItemListing.map(function (details) {
        const { _id: id } = details
        const shortenId = id.slice(0, 5)
        return shortenId

    })

    const updateUniquePenListing = (uniqueListing) => {
        dispatch(actOnuniquePageListUpdate(!uniquePageListUpdateState))
        dispatch(actOnuniquePageListItemUpdate(uniqueListing))
    }
    const actOnUniqueItemListSubmit = async () => {
        const confirmMonthAndYear = confirm('are you sure month and year is ticked?');
        if (confirmMonthAndYear) {
            try {
                const url = `http://localhost:5002/api/update/${uniqueId.id}`
                const sendUpdatedRecord = await axios.post(url, uniquePageNewRecord);
                const reply = sendUpdatedRecord
                const receivedStatus = sendUpdatedRecord.status
                if (receivedStatus === 200) {
                    alert('updated successfully, close update page and referesh browser')
                }

            } catch (error) {
                console.log({ error: error.message })
            }
        }

    }
    let obj = {
        _id: uniquePageListItems._id,
        title: id
    }
    const actOnUniqueItemListInput = (e) => {
        e.preventDefault()
        const { name, value } = e.target
        dispatch(actOnuniquePageListUpdateItemNewRecord({ ...uniquePageNewRecord, [name]: value, ...obj }))

    }

    const handleFilterSubmit = async () => {
        const url = `http://localhost:5002/uniqueFilter/${id}`
        const sendFilter = await axios.post(url, filterQuery)
        const response = sendFilter
        if (response.data.length === 0) {
            alert('no data for the filtered date')
        } else {
            dispatch(actOnuniqueItemListing(response.data))
        }
    }
    const handleFilter = (e) => {
        const { name, value } = e.target
        setFilterQuery({ ...filterQuery, [name]: value })
    }

    return (
        <>
            <div className='lg:block md:block sm:hidden'>
                {verifications ? <div className='w-[100svw] h-[100svh] flex relative z-[999]'>
                    {filter ? "" :
                        <div className={`${filter ? "" : styles.filterUniquePen} ${filter ? "opacity-100" : 'opacity-100'} `}>
                            <div className='w-full h-[7svh] flex justify-end items-center'>
                                <FaTimes className='fill-red text-[calc(1px_+_2svw_+_2svh)] cursor-pointer' onClick={function () {
                                    setFilter(!filter)
                                }} />
                            </div>
                            <div className='w-full h-[5svh]'></div>
                            <form action="" className='space-y-5' onSubmit={handleFilterSubmit}>
                                <div className='flex justify-evenly'>
                                    <select name="month" id="" onChange={handleFilter}>
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
                                    <select name="year" id="" onChange={handleFilter}>
                                        <option value="2024" disabled selected>YEAR</option>
                                        <option value="2024">2024</option>
                                    </select>
                                </div>

                                <div className='w-full h-[8svh] flex justify-center items-center cursor-pointer' >
                                    <h3 className='w-[10svw] h-[70%]  bg-red rounded-lg text-whites text-2xl text-center capitalize flex justify-center items-center' onClick={handleFilterSubmit}>update</h3>
                                </div>
                            </form>
                        </div>
                    }
                    <div className={`${sideNavState ? styles.sideNav_small : styles.sideNav_small_2} transition-all duration-[.1s] z-[1]`}>
                        <div className='w-full h-[20%] flex flex-col items-center py-2 px-2'>
                            {sideNavState ? <FaAlignJustify className='fill-whites  text-[calc(1px_+_1.5svw_+_1.5svh)] cursor-pointer hover:text-[calc(1px_+_1.7svw_+_1.7svh)] transition-all duration-500' onClick={function () {
                                dispatch(actOnSideNav(!sideNavState))
                            }} /> : <BsArrowLeftCircleFill className='fill-whites  text-[calc(1px_+_1.5svw_+_1.5svh)] self-end ' onClick={function () {
                                dispatch(actOnSideNav(!sideNavState))
                            }} />}
                        </div>
                        <div className={`w-full h-[80%] flex flex-col items-center px-3 `}>
                            <Link to={'/partners'} className='w-full h-[15%]'>
                                {sideNavState ?
                                    <FaUserFriends className={`${sideNavState ? 'block hover:cursor-pointer w-full fill-[white]' : 'hidden'} transition-all duration-[.5s] text-[calc(1px_+_1.5svw_+_1.5svh)] hover:text-[calc(1px_+_1.7svw_+_1.7svh)]`} onClick={clearList} />
                                    :
                                    <div className={`${sideNavState ? '' : 'w-[20svh] rounded-lg h-[5svh] text-[calc(1px_+_1svw_+_1svh)] text-center  cursor-pointer capitalize font-[700] text-blue border-blue bg-whites'}  transition-all duration-[.5s]`}>partners</div>
                                }
                            </Link>
                            <Link to={`/Adminanalysis/${id}`} className='w-full h-[15%]'>
                                {sideNavState ?
                                    <BsGraphUpArrow className={`${sideNavState ? 'block hover:cursor-pointer w-full fill-[white]' : 'hidden'} transition-all duration-[.5s] text-[calc(1px_+_1.5svw_+_1.5svh)] hover:text-[calc(1px_+_1.7svw_+_1.7svh)]`} />
                                    :
                                    <div className={`${sideNavState ? '' : 'w-[20svh] rounded-lg h-[5svh] text-[calc(1px_+_1svw_+_1svh)] text-center  cursor-pointer capitalize font-[700] text-blue border-blue bg-whites'}  transition-all duration-[.5s]`}>analysis</div>
                                }
                            </Link>
                        </div>
                    </div>
                    <div className={`${sideNavState ? styles.sideNav_large_2 : styles.sideNav_large} transition-all duration-[.5s] ${createPenState ? 'opacity-100' : 'opacity-70'} z-[1]`}>
                        {uniquePageListUpdateState ? <div className={uniquePageListUpdateState ? styles.uniquePenListUpdate : ''}>
                            <div className='w-full h-[10%]  flex justify-center items-center'>
                                <h3 className='text-[calc(1px_+_2.5svw_+_2.5svh)] capitalize font-[700] text-center text-whites w-[85%]'> update record</h3>
                                <FaTimes className='text-[calc(1px_+_2.5svw_+_2.5svh)] fill-red w-[15%] cursor-pointer' onClick={function () { updateUniquePenListing() }} />
                            </div>
                            <div className='w-full h-[10%] flex px-5 justify-between'>
                                <h3 className='w-full full font-sans font-[600] text-[calc(1.5px_+_1svw_+_1.5svh)] capitalize text-whites flex justify-start '>old record</h3>
                                <h3 className='w-full full font-sans font-[600] text-[calc(1.5px_+_1svw_+_1.5svh)] capitalize text-whites flex justify-end '>new record</h3>
                            </div>
                            <div className='w-full h-[60%]  flex'>
                                <div className='w-[50%] h-full  flex'>
                                    <div className='w-[50%] h-full'>
                                        <h3 className='w-full h-[19.5%] border border-whites font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] capitalize text-whites flex items-center '>No of egg produced</h3>
                                        <h3 className='w-full h-[19.5%] border border-whites font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] capitalize text-whites flex items-center '>No of feed consumed</h3>
                                        <h3 className='w-full h-[19.5%] border border-whites font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] capitalize text-whites flex items-center '>No of motality</h3>
                                        <h3 className='w-full h-[19.5%] border border-whites font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] capitalize text-whites flex items-center '>date</h3>
                                        <h3 className='w-full h-[19.5%] border border-whites font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] capitalize text-whites flex items-center '>itemID</h3>
                                    </div>
                                    <div className='w-[50%] h-full'>
                                        <h3 className='w-full h-[19.5%] border border-whites font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] capitalize text-whites flex items-center '>{uniquePageListItems.noOfEgg}</h3>
                                        <h3 className='w-full h-[19.5%] border border-whites font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] capitalize text-whites flex items-center '>{uniquePageListItems.noOfFeed}</h3>
                                        <h3 className='w-full h-[19.5%] border border-whites font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] capitalize text-whites flex items-center '>{uniquePageListItems.motals}</h3>
                                        <h3 className='w-full h-[19.5%] border border-whites font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] capitalize text-whites flex items-center '>{uniquePageListItems.date}</h3>
                                        <h3 className='w-full h-[19.5%] border border-whites font-sans font-[600] text-[calc(1px_+_.9svw_+_.9svh)] capitalize text-whites flex items-center '>{uniquePageListItems._id}</h3>
                                    </div>
                                </div>
                                <div className='w-[50%] h-full flex'>
                                    <div className='w-[50%] h-full'>
                                        <h3 className='w-full h-[19.5%] border border-whites font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] capitalize text-whites flex items-center '>No of egg produced</h3>
                                        <h3 className='w-full h-[19.5%] border border-whites font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] capitalize text-whites flex items-center '>No of feed consumed</h3>
                                        <h3 className='w-full h-[19.5%] border border-whites font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] capitalize text-whites flex items-center '>No of motality</h3>
                                        <h3 className='w-full h-[19.5%] border border-whites font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] capitalize text-whites flex items-center '>date</h3>
                                        <h3 className='w-full h-[19.5%] border border-whites font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] capitalize text-whites flex items-center '>itemID</h3>
                                    </div>
                                    <div className='w-[50%] h-full '>
                                        <form action="" className='flex flex-col jusify-center w-full h-full' onSubmit={actOnUniqueItemListSubmit}>
                                            <label htmlFor="" className='w-full h-[19.5%]  border border-black font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] capitalize text-black'>
                                                <input type="number" name="noOfEgg" id="" onChange={actOnUniqueItemListInput} className='w-full h-full text-[calc(1px_+_1svw_+_1svh)]' />
                                            </label>
                                            <label htmlFor="" className='w-full h-[19.5%] border border-black font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] capitalize text-black'>
                                                <input type="number" name="noOfFeed" id="" onChange={actOnUniqueItemListInput} className='w-full h-full text-[calc(1px_+_1svw_+_1svh)]' />
                                            </label>
                                            <label htmlFor="" className='w-full h-[19.5%] border border-black font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] capitalize text-black'>
                                                <input type="number" name="motals" id="" onChange={actOnUniqueItemListInput} className='w-full h-full text-[calc(1px_+_1svw_+_1svh)]' />
                                            </label>
                                            <label htmlFor="" className='w-full h-[19.5%] border border-black font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] capitalize text-black'>
                                                <input type="date" name="date" id="" onChange={actOnUniqueItemListInput} className='w-full h-full text-[calc(1px_+_1svw_+_1svh)] uppercase' />
                                            </label>
                                            <label htmlFor="" className='w-full h-[19.5%]  font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] capitalize text-black '>
                                                {/* <input type="date" name="date" id="" onChange={actOnUniqueItemListInput} className='w-full h-full text-[calc(1px_+_1svw_+_1svh)] uppercase' /> */}
                                                <h3 className='w-full h-full border border-whites font-sans font-[600] text-[calc(1px_+_.9svw_+_.9svh)] capitalize text-whites flex justify-center items-center'>{uniquePageListItems._id}</h3>
                                            </label>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <form action="" className='space-y-5' onSubmit={actOnUniqueItemListSubmit}>
                                <div className='flex justify-evenly'>
                                    <select name="month" id="" onChange={actOnUniqueItemListInput}>
                                        <option value="JANUARY" disabled selected> MONTH</option>
                                        <option value="JANUARY" > JANUARY</option>
                                        <option value="FEBRUARY"> FEBRUARY</option>
                                        <option value="MARCH"> MARCH</option>
                                        <option value="APRIL"> APRIL</option>
                                        <option value="MAY"> MAY</option>
                                        <option value="JUNE"> JUNE</option>
                                        <option value="JULY"> JULY</option>
                                        <option value="AUGUST"> AUGUST</option>
                                        <option value="SEPTEMBER"> SEPTEMBER</option>
                                        <option value="OCTOBER"> OCTOBER</option>
                                        <option value="NOVEMBER"> NOVEMBER</option>
                                        <option value="DECEMBER"> DECEMBER</option>
                                    </select>
                                    <select name="year" id="" onChange={actOnUniqueItemListInput}>
                                        <option value="2024" disabled selected>YEAR</option>
                                        <option value="2024">2024</option>
                                    </select>
                                </div>
                            </form>
                            <div className='w-full h-[10%] flex justify-center items-center'>
                                <h3 className='bg-red h-[80%] w-[10%] flex justify-center items-center font-sans font-[600] text-[calc(1px_+_1.1svw_+_1.1svh)] capitalize text-whites rounded-xl cursor-pointer ' onClick={actOnUniqueItemListSubmit}>submit</h3>
                            </div>
                        </div> : ''}
                        <div className='h-[10svh] w-full flex justify-between px-5'>
                            <div className='w-[33%] h-full flex justify-start items-center'>
                                <Link to={'/admin'} className='w-[50%]'> <h3 className='w-full font-sans font-[600] text-[calc(1.5px_+_1svw_+_1.5svh)] text-center capitalize border border-blue text-red hover:bg-red hover:text-white hover:border-none transition-all duration-500'>animal care</h3></Link>
                            </div>

                            <div className='w-[60%] h-full flex justify-end items-center overflow-auto overflow-x-hidden'>
                                <h3 className='w-[50%] font-sans font-[600] text-[calc(1px_+_.6svw_+_.6svh)] text-center capitalize border border-blue text-red px-2'>ID: {uniqueId}...</h3>
                            </div>
                        </div>
                        <div className='w-full h-[5svh] flex'> </div>
                        <div className='w-full h-[5svh] flex justify-center items-center px-4 gap-3 '>
                            <div className='w-[90%] h-full flex justify-between items-center'>
                                <Link to={`/Adminanalysis/${id}`} className='w-[15%]'><h3 className='w-[100%] font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] text-center capitalize bg-red text-whites rounded-lg hover:cursor-pointer  hover:text-[calc(1px_+_1.1svw_+_1.1svh)] transition-all duration-500'> analysis</h3></Link>
                                <h3 className='w-[10%] font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] text-center capitalize bg-red text-whites rounded-lg '> {id}</h3>
                                <h3 className='w-[10%] font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] text-center capitalize bg-red text-whites rounded-lg hover:cursor-pointer hover:text-[calc(1px_+_1.1svw_+_1.1svh)] transition-all duration-500' onClick={function () { setFilter(!filter) }}>filter </h3>
                            </div>
                            <Link to={'/admin'} className='w-[10%] font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)]  self-end text-center capitalize bg-red text-whites rounded-lg hover:cursor-pointer hover:text-[calc(1px_+_1.1svw_+_1.1svh)] transition-all duration-500' onClick={clearList}> go back</Link>
                        </div>
                        <div className='w-full h-[1svh]'></div>
                        <div className='w-full h-[5svh] flex justify-center items-center px-4 gap-3 '>
                            <div className='w-[100%] h-full flex justify-evenly items-center gap-5'>
                                <h3 className='w-[19.5%] font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] text-center capitalize bg-blue text-whites rounded-lg'> No of egg produced</h3>
                                <h3 className='w-[19.5%] font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] text-center capitalize bg-blue text-whites rounded-lg'> No of feed consumed</h3>
                                <h3 className='w-[19.5%] font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] text-center capitalize bg-blue text-whites rounded-lg'> No of motality</h3>
                                <h3 className='w-[19.5%] font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] text-center capitalize bg-blue text-whites rounded-lg'> date</h3>
                                <h3 className='w-[19.5%] font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] text-center capitalize bg-blue text-whites rounded-lg'> update</h3>
                            </div>
                        </div>
                        <div className='w-full h-[1.5svh]'></div>
                        <div className='w-full h-[50svh]  space-y-5 overflow-scroll overflow-x-hidden'>
                            {uniqueItemListing.map(function (details) {
                                const { _id: id, noOfEgg, noOfFeed, motals, date, month } = details
                                return (
                                    <div key={id} className='flex relative'>
                                        <div className='w-[90%] h-[10svh] flex rounded-s-full shadow-md shadow-slate-500 relative hover:shadow-lg hover:shadow-slate-500 transition-all duration-500'>
                                            <div className='w-[25%] h-full border border-black flex items-center rounded-s-full'>
                                                <h3 className='w-[100%] h-[50%] font-sans font-[600] text-[calc(1.5px_+_1svw_+_1svh)] text-center capitalize'>{noOfEgg}</h3>
                                            </div>
                                            <div className='w-[25%] h-full border border-black flex items-center'>
                                                <h3 className='w-[100%] h-[50%] font-sans font-[600] text-[calc(1.5px_+_1svw_+_1svh)] text-center capitalize'>{noOfFeed}</h3>
                                            </div>
                                            <div className='w-[25%] h-full border border-black flex items-center'>
                                                <h3 className='w-[100%] h-[50%] font-sans font-[600] text-[calc(1.5px_+_1svw_+_1svh)] text-center capitalize'>{motals}</h3>
                                            </div>
                                            <div className='w-[25%] h-full  flex items-center '>
                                                <h3 className='w-[70%] h-[100%] flex items-center justify-center font-sans font-[600] text-[calc(1.5px_+_1svw_+_1svh)] border border-black text-center capitalize'>{date}</h3>
                                                <h3 className='w-[30%] h-[100%] flex items-center justify-center font-sans font-[600] text-[calc(1px_+_.8svw_+_.8svh)] border border-black text-center capitalize'>{month}</h3>
                                            </div>
                                        </div>
                                        <div className='w-[10%] h-[10svh] border border-black flex items-center rounded-e-full shadow-md shadow-slate-500 tansition-all duration-500 hover:bg-blue'>
                                            <FaPen className='w-[100%] h-[100%] p-[1rem] font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] text-center capitalize fill-[red] hover:fill-whites  cursor-pointer'
                                                onClick={function () { updateUniquePenListing(details) }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className='w-full h-[20svh] border border-black flex justify-center items-center gap-5'>
                            <div className='w-[32%] h-[80%] border border-black '>
                                <div className='font-sans font-[500] text-[calc(1.5px_+_1svw_+_1svh)] text-center text-blue capitalize'>no of egg today</div><hr className='border-2 border-blue'/>
                                <div className='font-sans font-[800] text-[calc(1.5px_+_2svw_+_2svh)] flex justify-center items-center  text-red capitalize'>{footerAnalysis.noOfEgg}</div>
                            </div>
                            <div className='w-[32%] h-[80%] border border-black '>
                                <div className='font-sans font-[500] text-[calc(1.5px_+_1svw_+_1svh)] text-center text-blue capitalize'>no of feed today</div><hr className='border-2 border-blue'/>
                                <div className='font-sans font-[800] text-[calc(1.5px_+_2svw_+_2svh)] flex justify-center items-center  text-red capitalize'>{footerAnalysis.noOfFeed}</div>
                            </div>
                            <div className='w-[32%] h-[80%] border border-black '>
                                <div className='font-sans font-[500] text-[calc(1.5px_+_1svw_+_1svh)] text-center text-blue capitalize'>no of motal(s) today</div><hr className='border-2 border-blue'/>
                                <div className='font-sans font-[800] text-[calc(1.5px_+_2svw_+_2svh)] flex justify-center items-center  text-red capitalize'>{footerAnalysis.motals}</div>
                            </div>
                        </div>
                    </div>
                </div> :
                    <div className='bg-whites h-[100svh] w-full'>
                        <div className='w-full h-[10svh] flex justify-start items-center'>
                            <Link to={'/'} className='w-[20%]'> <h3 className='w-full font-sans font-[600] text-[calc(1.5px_+_1svw_+_1.5svh)] text-center capitalize border border-blue text-red cursor-pointer'>animal care</h3></Link>

                            <h3 className='w-[80%] font-sans font-[600] text-[calc(1.5px_+_1svw_+_1.5svh)] text-center uppercase  text-red cursor-pointer'>farm 1 pen data record and statistics</h3>
                        </div>
                        <div className='w-full h-[90svh] bg-blue flex justify-center items-center'>
                            {userCredential ?
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

export default UniquiePen