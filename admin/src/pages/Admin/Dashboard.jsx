import React from 'react'
import { assets } from '../../assets/assets'
const Dashboard = () => {
  return (
    <div className='m-5'>
      <div className='grid sm:grid-cols-3 grid-cols-2 gap-4 my-6'>
        <div className='flex items-center gap-2 bg-white p-4 rounded-xl shadow'>
          <img className='w-14' src={assets.doctor_icon} alt="" />
          <div>
            <p></p>
            <p className='text-sm text-gray-400'>Doctors</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white p-4 rounded-xl shadow'>
          <img className='w-14' src={assets.appointments_icon} alt="" />
          <div>
            <p>25000</p>
            <p className='text-sm text-gray-400'>Appointments</p>
          </div>
        </div>
        <div className='flex items-center justify-between bg-white p-4 rounded-xl shadow'>
          <img className='w-14' src={assets.patients_icon} alt="" />
          <div>
            <p>1000</p>
            <p className='text-sm text-gray-400'>Patients</p>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-4 bg-white shadow-md p-4 rounded-2xl mt-12'>

        <div>
          <div className='flex items-center gap-2 border-b-2 pb-4'>
            <img src={assets.list_icon} alt="" />
            <p className='text-lg font-medium'> Recent Appointments</p>
          </div>
          <div className='flex justify-between'>
            <div className='flex mt-3 gap-3 items-center'>
              <div>
                <img className='rounded-full w-16' src={assets.doctor_icon} alt="" />
              </div>
              <div className=''>
                <h3>Dr.Omar</h3>
                <p className='text-gray-400'>Booking on</p>
              </div>
            </div>
            <img src={assets.cancel_icon} alt="" />
          </div>

        </div>
      </div>
    </div>
  )
}

export default Dashboard