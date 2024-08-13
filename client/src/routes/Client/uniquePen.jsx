import React, { useEffect, useRef, useState } from 'react'
import styles from './../styles.module.css'
import { FaAlignJustify, FaTrash, FaUserFriends, FaPen, FaTimes } from 'react-icons/fa'
import { BsSearch, BsGraphUpArrow, BsArrowLeftCircleFill } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import {
    actOnSideNav, actOnuniquePenPageArrayList, actOnuniqueItemListing,
    actOnuniquePageListUpdate, actOnuniquePageListItemUpdate,
    actOnuniquePageListUpdateItemNewRecord, actOnFooterAnalysis
} from '../../redux/pageinterraction'
import { useLocation, Link, useParams } from 'react-router-dom'
import axios from 'axios'


const UniquiePen = () => {
    const [filter, setFilter] = useState(true);
    const [filterQuery, setFilterQuery] = useState({})
    const location = useLocation()
    const dispatch = useDispatch()
    const triggerActionUrl = location.pathname
    const storeTriggerUrl = useRef(triggerActionUrl)

    //-------------------------------- DATA VARIABLES -------------------------------------//
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
    let firstItemDetailsEgg;
    useEffect(function () {
        // window.location.reload()
        const fetchUnique = async function () {
            try {
                const url = `http://localhost:5002/api/${id}`
                const fetch = await axios.get(url)
                const response = fetch.data
                dispatch(actOnFooterAnalysis(response[0]))
                const ds = dispatch(actOnuniquePenPageArrayList([...uniquePenArrayList, response]))
                const dds = ds.payload[0]
                const dss = dispatch(actOnuniqueItemListing(dds))
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


        const convertToArray = Object.values(id)
        // console.log(shortenId, convertToArray[0])
        return shortenId
    })
    const footerLabelsOfEggs = uniqueItemListing.map(function (details) {
        return details
    })
    const updateUniquePenListing = (uniqueListing) => {
        dispatch(actOnuniquePageListUpdate(!uniquePageListUpdateState))
        dispatch(actOnuniquePageListItemUpdate(uniqueListing))
    }
    const actOnUniqueItemListSubmit = async () => {
        try {
            const url = `http://localhost:5002/api/update/${uniqueId.id}`
            const sendUpdatedRecord = await axios.post(url, uniquePageNewRecord);
            const receivedStatus = sendUpdatedRecord.status
            if (receivedStatus === 200) {
                alert('updated successfully, close update page and referesh browser')
            }

        } catch (error) {
            console.log({ error: error.message })
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
                <div className='w-[100svw] h-[100svh] flex relative z-[999]'>
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
                                        <option value="DECEMBER"> OCTOBER</option>
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
                    <div className={`${sideNavState ? styles.sideNav_small : styles.sideNav_small_2} transition-all duration-[.5s] z-[1]`}>
                        <div className='w-full h-[20%] flex flex-col items-center py-2 px-2'>
                            {sideNavState ? <FaAlignJustify className='fill-whites  text-[calc(1px_+_1.5svw_+_1.5svh)]' onClick={function () {
                                dispatch(actOnSideNav(!sideNavState))
                            }} /> : <BsArrowLeftCircleFill className='fill-whites  text-[calc(1px_+_1.5svw_+_1.5svh)] self-end ' onClick={function () {
                                dispatch(actOnSideNav(!sideNavState))
                            }} />}
                        </div>
                        <div className={`w-full h-[80%] flex flex-col items-center px-3 `}>
                            <Link to={'/partners'} className='w-full h-[15%]'>
                                {sideNavState ?
                                    <FaUserFriends className={`${sideNavState ? 'block hover:cursor-pointer w-full fill-[white]' : 'hidden'} transition-all duration-[.5s] text-[calc(1px_+_1.5svw_+_1.5svh)]`} onClick={clearList} />
                                    :
                                    <div className={`${sideNavState ? '' : 'w-[20svh] rounded-lg h-[5svh] text-[calc(1px_+_1svw_+_1svh)] text-center  cursor-pointer capitalize font-[700] text-blue border-blue bg-whites'}  transition-all duration-[.5s]`} onClick={clearList}>partners</div>
                                }
                            </Link>
                            <Link to={`/Clientanalysis/${id}`} className='w-full h-[15%]'>
                                {sideNavState ?
                                    <BsGraphUpArrow className={`${sideNavState ? 'block hover:cursor-pointer w-full fill-[white]' : 'hidden'} transition-all duration-[.5s] text-[calc(1px_+_1.5svw_+_1.5svh)]`} />
                                    :
                                    <div className={`${sideNavState ? '' : 'w-[20svh] rounded-lg h-[5svh] text-[calc(1px_+_1svw_+_1svh)] text-center  cursor-pointer capitalize font-[700] text-blue border-blue bg-whites'}  transition-all duration-[.5s]`}>analysis</div>
                                }
                            </Link>
                        </div>
                    </div>
                    <div className={`${sideNavState ? styles.sideNav_large_2 : styles.sideNav_large} transition-all duration-[.5s] ${createPenState ? 'opacity-100' : 'opacity-70'} z-[1]`}>
                        {uniquePageListUpdateState ? <div className={uniquePageListUpdateState ? styles.uniquePenListUpdate : ''}>
                            <div className='w-full h-[20%]  flex justify-center items-center'>
                                <h3 className='text-[calc(1px_+_3svw_+_3svh)] capitalize font-[700] text-center text-whites w-[85%]'> update record</h3>
                                <FaTimes className='text-[calc(1px_+_3svw_+_3svh)] fill-red w-[15%] cursor-pointer' onClick={function () { updateUniquePenListing() }} />
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
                                        <form action="" className='flex flex-col gap-[2rem] jusify-center' onSubmit={actOnUniqueItemListSubmit}>
                                            <label htmlFor="" className='w-full h-[19.5%]  border border-whites font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] capitalize text-black'>
                                                <input type="number" name="noOfEgg" id="" onChange={actOnUniqueItemListInput} className='w-full ' />
                                            </label>
                                            <label htmlFor="" className='w-full h-[19.5%] border border-whites font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] capitalize text-black'>
                                                <input type="number" name="noOfFeed" id="" onChange={actOnUniqueItemListInput} className='w-full' />
                                            </label>
                                            <label htmlFor="" className='w-full h-[19.5%] border border-whites font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] capitalize text-black'>
                                                <input type="number" name="motals" id="" onChange={actOnUniqueItemListInput} className='w-full' />
                                            </label>
                                            <label htmlFor="" className='w-full h-[19.5%] border border-whites font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] capitalize text-black'>
                                                <input type="date" name="date" id="" onChange={actOnUniqueItemListInput} className='w-full uppercase' />
                                            </label>
                                            <h3 className='w-full h-[19.5%] border border-whites font-sans font-[600] text-[calc(1px_+_.9svw_+_.9svh)] capitalize text-whites flex items-start '>{uniquePageListItems._id}</h3>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className='w-full h-[10%] flex justify-center items-center'>
                                <h3 className='bg-red h-[80%] w-[10%] flex justify-center items-center font-sans font-[600] text-[calc(1px_+_1.5svw_+_1.5svh)] capitalize text-whites rounded-xl cursor-pointer ' onClick={actOnUniqueItemListSubmit}>submit</h3>

                            </div>
                        </div> : ''}

                        <div className='h-[10svh] w-full flex justify-between px-5'>
                            <div className='w-[33%] h-full flex justify-start items-center'>
                                <Link to={'/partners'} className='w-[50%]'> <h3 className='w-full font-sans font-[600] text-[calc(1.5px_+_1svw_+_1.5svh)] text-center capitalize border border-blue text-red '>animal care</h3></Link>
                            </div>

                            <div className='w-[60%] h-full flex justify-end items-center overflow-x-hidden overflow-auto'>
                                <h3 className='w-[50%] font-sans font-[600] text-[calc(1px_+_.6svw_+_.6svh)] text-center capitalize border border-blue text-red px-2'>ID: {uniqueId}...</h3>
                            </div>
                        </div>
                        <div className='w-full h-[5svh] flex'> </div>
                        <div className='w-full h-[5svh] flex justify-center items-center px-4 gap-3 '>
                            <div className='w-[90%] h-full flex justify-between items-center'>
                                <Link to={`/Clientanalysis/${id}`} className='w-[15%]'><h3 className='w-[100%] font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] text-center capitalize bg-red text-whites rounded-lg hover:cursor-pointer '> analysis</h3></Link>
                                <h3 className='w-[10%] font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] text-center capitalize bg-red text-whites rounded-lg hover:cursor-pointer'> {id}</h3>
                                <h3 className='w-[10%] font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] text-center capitalize bg-red text-whites rounded-lg hover:cursor-pointer' onClick={function () { setFilter(!filter) }}>filter </h3>
                            </div>
                            <Link to={'/partners'} className='w-[10%] font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)]  self-end text-center capitalize bg-red text-whites rounded-lg hover:cursor-pointer' onClick={clearList}> go back</Link>
                        </div>
                        <div className='w-full h-[1svh]'></div>
                        <div className='w-full h-[5svh] flex justify-center items-center px-4 gap-3 '>
                            <div className='w-[100%] h-full flex justify-evenly items-center gap-5'>
                                <h3 className='w-[19.5%] font-sans font-[600] text-[calc(1px_+_.9svw_+_.9svh)] text-center capitalize bg-blue text-whites rounded-lg hover:cursor-pointer'> No of egg produced</h3>
                                <h3 className='w-[19.5%] font-sans font-[600] text-[calc(1px_+_.9svw_+_.9svh)] text-center capitalize bg-blue text-whites rounded-lg hover:cursor-pointer'> No of feed consumed</h3>
                                <h3 className='w-[19.5%] font-sans font-[600] text-[calc(1px_+_.9svw_+_.9svh)] text-center capitalize bg-blue text-whites rounded-lg hover:cursor-pointer'> No of motality</h3>
                                <h3 className='w-[19.5%] font-sans font-[600] text-[calc(1px_+_.9svw_+_.9svh)] text-center capitalize bg-blue text-whites rounded-lg hover:cursor-pointer'> date</h3>
                            </div>
                        </div>
                        <div className='w-full h-[1.5svh]'></div>
                        <div className='w-full h-[50svh]  space-y-5 overflow-scroll overflow-x-hidden'>
                            {uniqueItemListing.map(function (details) {
                                const { _id: id, noOfEgg, noOfFeed, motals, date, month } = details
                                return (
                                    <div key={id} className='flex relative'>
                                        <div className='w-[100%] h-[10svh] flex rounded-s-full shadow-md shadow-slate-500 relative hover:shadow-lg hover:shadow-slate-500 transition-all duration-500'>
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
                                                <h3 className='w-[30%] h-[100%] flex items-center justify-center font-sans font-[600] text-[calc(1px_+_.8svw_+_.8svh)] border border-black text-center capitalize  rounded-e-full'>{month}</h3>
                                            </div>
                                        </div>
                                        {/* <div className='w-[10%] h-[10svh] border border-black flex items-center rounded-e-full shadow-md shadow-slate-500 tansition-all duration-500 hover:bg-blue'>
                                            <FaPen className='w-[100%] h-[100%] p-[1rem] font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] text-center capitalize fill-[red] hover:fill-whites  cursor-pointer'
                                                onClick={function () { updateUniquePenListing(details) }}
                                            />
                                        </div> */}
                                    </div>
                                )
                            })}
                        </div>
                        <div className='w-full h-[20svh] border border-black flex justify-center items-center gap-5'>
                            <div className='w-[32%] h-[80%] border border-black '>
                                <div className='font-sans font-[600] text-[calc(1.5px_+_1svw_+_1svh)] text-center text-blue capitalize'>no of egg today</div><hr className='border-2 border-blue'/>
                                <div className='font-sans font-[600] text-[calc(1.5px_+_2svw_+_2svh)] flex justify-center items-center  text-red capitalize'>{footerAnalysis.noOfEgg}</div>
                            </div>
                            <div className='w-[32%] h-[80%] border border-black '>
                                <div className='font-sans font-[600] text-[calc(1.5px_+_1svw_+_1svh)] text-center text-blue capitalize'>no of feed today</div><hr className='border-2 border-blue'/>
                                <div className='font-sans font-[600] text-[calc(1.5px_+_2svw_+_2svh)] flex justify-center items-center  text-red capitalize'>{footerAnalysis.noOfFeed}</div>
                            </div>
                            <div className='w-[32%] h-[80%] border border-black '>
                                <div className='font-sans font-[600] text-[calc(1.5px_+_1svw_+_1svh)] text-center text-blue capitalize'>no of motal(s) today</div><hr className='border-2 border-blue'/>
                                <div className='font-sans font-[600] text-[calc(1.5px_+_2svw_+_2svh)] flex justify-center items-center  text-red capitalize'>{footerAnalysis.motals}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default UniquiePen