import React, { useState } from 'react'

const Test = () => {
    const [select, UpdateSelect] = useState({})
    return (
        <div>
            <div>
                <select name="names" id="" onChange={function (e) {
                    e.preventDefault()
                    const { name, value } = e.target
                    UpdateSelect({...select,  [name]: value })
                }}>names
                    <option value="raymond" disabled selected>names</option>
                    <option value="raymond">raymond</option>
                    <option value="tofunmi">tofunmi</option>
                    <option value="bolaji">bolaji</option>
                </select>
            </div>
            <div>
                <select name="month" id="" onChange={function (e) {
                    e.preventDefault()

                    const { name, value } = e.target
                    UpdateSelect({...select,  [name]: value })
                }}>month
                    <option value="jaanuray" disabled selected>month</option>
                    <option value="jaanuray">jaanuray</option>
                    <option value="february">february</option>
                    <option value="march">march</option>
                </select>
            </div>
            <div onClick={function(){
                console.log(select)
            }}>submit</div>
        </div>
    )
}

export default Test