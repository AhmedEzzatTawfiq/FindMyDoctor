import React from 'react'
import { assets } from '../../assets/assets'

const Appointment = () => {
  return (
    <div className='m-5'>
      <h3 className='text-lg font-semibold mb-4'>All Appointments</h3>
      <div className='bg-white flex flex-col gap-5 px-5 py-4 shadow'>
        <div className='flex gap-15 rounded'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date&Time</p>
        </div>
        <div className='flex items-center gap-15'>
          <p>1</p>
          <div>
            <img src="" alt="" />
            <p>Patient Name</p>
          </div>
          <p>17</p>
          <p>20/5</p>
          <img className='w-8' src={assets.cancel_icon} alt="" />
        </div>
        <div className='flex items-center gap-15'>
          <p>2</p>
          <div>
            <img src="" alt="" />
            <p>Patient Name</p>
          </div>
          <p>17</p>
          <p>20/5</p>
          <img className='w-8' src={assets.cancel_icon} alt="" />
        </div>
        <div className='flex items-center gap-15'>
          <p>3</p>
          <div>
            <img src="" alt="" />
            <p>Patient Name</p>
          </div>
          <p>17</p>
          <p>20/5</p>
          <img className='w-8' src={assets.cancel_icon} alt="" />
        </div>
      </div>
    </div>
  )
}

export default Appointment