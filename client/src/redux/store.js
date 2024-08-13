import {configureStore} from '@reduxjs/toolkit'
import pageinterraction from './pageinterraction'
const allSlices ={
    page:pageinterraction
}
const store = configureStore({
    reducer:allSlices
})

export default store