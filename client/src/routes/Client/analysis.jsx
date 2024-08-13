import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { actOnuniqueItemListing } from '../../redux/pageinterraction';
import { Chart as ChartJS } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';



const Analysis = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const analysis = useSelector(function (state) {
    return state.page.uniqueAnanlysis
  })

  const uniqueItemListing = useSelector(function (state) {
    return state.page.uniqueItemListing
  })

  const limit30 = uniqueItemListing.slice(0, 30)
  const month = uniqueItemListing[0].month
  return (
    <div>
      <div className='lg:block md:hidden sm:hidden'>
        <div className='w-full h-[100svh] bg-whites'>
          <div className='w-full h-[10svh] flex justify-start items-center'>
            <Link to={'/'} className='w-[15%]'> <h3 className='w-full font-sans font-[600] text-[calc(1.5px_+_1svw_+_1.5svh)] text-center capitalize border border-blue text-red cursor-pointer'>animal care</h3></Link>
            <h3 className='w-[75%] font-sans font-[600] text-[calc(1.5px_+_1svw_+_1.5svh)] text-center uppercase  text-red cursor-pointer'>graphical statistics of pen {id} in the month of {month}</h3>
           <Link to={`/Clientlist/${id}`} className='w-[15%]'><h3 className='w-full font-sans font-[600] text-[calc(1.5px_+_1svw_+_1.5svh)] text-center uppercase  text-whites cursor-pointer rounded-full hover:text-red hover:bg-blue bg-red'>go back</h3></Link>
          </div>
          <div className='w-full h-[90svh] bg-slate-200'>
            <Bar
              data={{
                labels: limit30.map(function (details) {
                  return details.date
                }),
                datasets: [
                  {
                    label: 'eggs',
                    data: limit30.map(function (details) {
                      return details.noOfEgg
                    }),
                    backgroundColor: "#005af4"
                  },
                  {
                    label: 'feed',
                    data: limit30.map(function (details) {
                      return details.noOfFeed
                    }),
                    backgroundColor: "#f4dc00"
                  },
                  {
                    label: 'motal',
                    data: limit30.map(function (details) {
                      return details.motals
                    }),
                    backgroundColor: "#e32328"
                  },
                ]
              }}
              options={{
                maintainAspectRatio:false,
                responsive:true
              }}
              />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analysis