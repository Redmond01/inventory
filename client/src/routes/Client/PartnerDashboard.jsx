// import 'dotenv/config'
import React, { useEffect, useRef } from 'react';
import styles from './../styles.module.css'
import { FaAlignJustify, FaTimes, FaUser, FaUserFriends } from 'react-icons/fa';
import { BsSearch, BsGraphUpArrow, BsArrowLeftCircleFill } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux'
import {
    actOnSideNav, actOnCreatePen,
    actOnPartnerPenListSearch,
    actOnPartnerPenListArray
} from '../../redux/pageinterraction'
import { useLocation, Link } from 'react-router-dom'
import axios from 'axios'
import { HideLoading, Loading } from 'react-loading-ui';




const PartnerDashboard = () => {
    const location = useLocation()
    const dispatch = useDispatch()
    const triggerActionUrl = location.pathname
    const storeTriggerUrl = useRef(triggerActionUrl)

    const pertnerPenListArrayState = useSelector(function (state) {
        return state.page.partnerPenListArray
    })
    const sideNavState = useSelector(function (state) {
        return state.page.sideNav
    })
    const createPenState = useSelector(function (state) {
        return state.page.createPen
    })
    const pertnerPenListSearchState = useSelector(function (state) {
        return state.page.partnerPenListSearch
    })



    const fetchListOfDataFromDb = async function () {
        try {
            const url = 'http://localhost:5002/create'
            const fetch = await axios.get(url)
            const response = fetch.data

            const ds = dispatch(actOnPartnerPenListArray([...pertnerPenListArrayState, ...response]))
        } catch (e) {
            console.log({ erro: e })
        }
    }

    useEffect(function () {
        fetchListOfDataFromDb()
        const currentUrlLocation = location.pathname
        if (currentUrlLocation !== storeTriggerUrl.current) {
            dispatch(actOnCreatePen(!createPenState))
            dispatch(actOnSideNav(!sideNavState))
        }
        return function () {
            const empty = []
            dispatch(actOnPartnerPenListArray(empty))
        }
    }, [])


    const handleAdminSearch = () => {
        const ss = pertnerPenListArrayState.filter(function (details) {
            const word = pertnerPenListSearchState.AdminSearch
            const configure = word.replace(/\s/g, '')
            return details.title === configure
        })
        dispatch(actOnPartnerPenListArray(ss))
    }
    const handleAdminInput = (e) => {
        const { name, value } = e.target
        dispatch(actOnPartnerPenListSearch({ ...pertnerPenListSearchState, [name]: value }))
    }

    const emptyArr = function () {
        const empty = []
        dispatch(actOnPartnerPenListArray(empty))
    }

    const pertnerRefresh = async (clear) => {
        Loading()
        clear = emptyArr
        try {
            clear()
            setTimeout(async function () {
                const url = 'http://localhost:5002/create'
                const fetch = await axios.get(url)
                const response = fetch.data
                // console.log(response, adminPenListArrayState)
                dispatch(actOnPartnerPenListArray(response))
                HideLoading()
            }, 1200)
        } catch (e) {
            console.log({ erro: e })
        }
    }

    return (
        <>
            <div className='lg:block md:block sm:hidden'>
                <div className='w-[100svw] h-[100svh] flex relative z-[999]'>
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
                                    <FaUserFriends className={`${sideNavState ? 'block hover:cursor-pointer w-full fill-[white]' : 'hidden'} transition-all duration-[.5s] text-[calc(1px_+_1.5svw_+_1.5svh)]`} />
                                    :
                                    <div className={`${sideNavState ? '' : 'w-[20svh] rounded-lg h-[5svh] text-[calc(1px_+_1svw_+_1svh)] text-center  cursor-pointer capitalize font-[700] text-blue border-blue bg-whites'}  transition-all duration-[.5s]`}>partners</div>
                                }
                            </Link>
                        </div>
                    </div>
                    <div className={`${sideNavState ? styles.sideNav_large_2 : styles.sideNav_large} transition-all duration-[.5s] ${createPenState ? 'opacity-100' : 'opacity-70'} z-[1]`}>
                        <div className='h-[10svh] w-full flex '>
                            <div className='w-[33%] h-full flex justify-start items-center'>
                                <Link to={'/'} className='w-[50%]'> <h3 className='w-full font-sans font-[600] text-[calc(1.5px_+_1svw_+_1.5svh)] text-center capitalize border border-blue text-red cursor-pointer'>animal care</h3></Link>
                            </div>
                            <div className='w-[33%] h-full flex justify-center items-center'>
                                <form action="" className='w-[90%] h-[50%]' onSubmit={handleAdminSearch}>
                                    <label htmlFor="">
                                        <input type="text" name="AdminSearch" id="" onChange={handleAdminInput} className='w-[100%] rounded-s-lg h-full border border-slate-400 outline-none' />
                                    </label>
                                </form>
                                <BsSearch onClick={handleAdminSearch} className='w-[10%] h-[50%] bg-red p-1 hover:cursor-pointer fill-whites rounded-e-lg text-[calc(1.5px_+_1svw_+_1.5svh)]' />
                            </div>
                            <div className='w-[33%] h-full flex justify-end items-center'>
                                <h3 className='w-[50%] font-sans font-[600] text-[calc(1.5px_+_1svw_+_1.5svh)] text-center capitalize border border-blue text-red '>partners</h3>
                            </div>
                        </div>
                        <div className='w-full h-[5svh] flex'>
                            <div className='w-[50%] h-full flex justify-start items-center px-4'>
                                <h3 className='w-[30%] font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] text-center capitalize border border-blue bg-blue text-whites rounded-lg hover:cursor-pointer hover:shadow-lg hover:shadow-slate-500 transition-all duration-[.7s]' onClick={pertnerRefresh}> refresh list</h3>
                            </div>
                        </div>
                        <div className='w-full h-[5svh] flex justify-center items-center px-4 gap-3 '>
                            <div className='w-[50%] h-full flex justify-start items-center px-4'>
                                <h3 className='w-[100%] font-sans font-[600] text-[calc(1px_+_1svw_+_1svh)] text-center capitalize bg-red text-whites rounded-lg hover:cursor-pointer'> click on each items to see all stats</h3>
                            </div>
                        </div>
                        <div className='w-full h-[2svh]'></div>

                        <div className='w-full h-[50svh]  space-y-5 overflow-scroll overflow-x-hidden'>
                            {pertnerPenListArrayState.map(function (details) {
                                const { _id: id, title } = details
                                return (
                                    <Link to={`/Clientlist/${title}`} className='w-full h-[10svh] flex rounded-full shadow-md shadow-slate-500 hover:shadow-xl' key={id}>
                                        <div className='w-[20%] h-full border border-black flex items-center rounded-s-full'>
                                            <h3 className='w-[100%] h-[50%] font-sans font-[600] text-[calc(1.5px_+_1svw_+_1svh)] text-center capitalize'>{details.title}</h3>
                                        </div>
                                        <div className='w-[20%] h-full border border-black flex items-center'>
                                            <h3 className='w-[100%] h-[50%] font-sans font-[600] text-[calc(1.5px_+_1svw_+_1svh)] text-center capitalize'>{details.noOfP}--</h3>
                                        </div>
                                        <div className='w-[20%] h-full border border-black flex items-center'>
                                            <h3 className='w-[100%] h-[50%] font-sans font-[600] text-[calc(1.5px_+_1svw_+_1svh)] text-center capitalize'>{details.noOfF}--</h3>
                                        </div>
                                        <div className='w-[20%] h-full border border-black flex items-center'>
                                            <h3 className='w-[100%] h-[50%] font-sans font-[600] text-[calc(1.5px_+_1svw_+_1svh)] text-center capitalize'>{details.noOfM}--</h3>
                                        </div>
                                        <div className='w-[20%] h-full border border-black flex items-center rounded-e-full'>
                                            <h3 className='w-[100%] h-[50%] font-sans font-[600] text-[calc(1.5px_+_1svw_+_1svh)] text-center capitalize'>crud</h3>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                        <div className='w-full h-[20svh] border border-black flex justify-center items-center gap-5'>
                            <div className='w-[32%] h-[80%] border border-black'></div>
                            <div className='w-[32%] h-[80%] border border-black'></div>
                            <div className='w-[32%] h-[80%] border border-black'></div>
                        </div>
                    </div>
                </div>
            </div>

        </>

    )
}

export default PartnerDashboard