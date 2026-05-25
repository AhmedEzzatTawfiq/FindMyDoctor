import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from "react-hot-toast";
import axios from "axios";

const MyAppointment = () => {

  const { backendUrl, token, getDoctors } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('-')
    return `${dateArray[0]} - ${months[dateArray[1] - 1]} - ${dateArray[2]}`
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        getAppointments()
        console.log(appointmentId)
        getDoctors()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const paymentGateway = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/payment-gateway', { appointmentId }, { headers: { token } })
      if (data.success) {
        window.location.href = data.paymentUrl
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const verifyPayment = async (success, orderId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/verify-payment', { success, orderId }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        getAppointments()
        window.history.replaceState(null, '', window.location.pathname);
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const getAppointments = async () => {
    try {

      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
      if (data.success) {
        setAppointments(data.appointments.reverse())
        console.log(data.appointments)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) {
      const urlParams = new URLSearchParams(window.location.search);
      const success = urlParams.get("success");
      const orderId = urlParams.get("order");

      if (success && orderId) {
        verifyPayment(success, orderId);
      } else {
        getAppointments()
      }
    }
  }, [token])


  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>
      <div>
        {appointments.slice(0, 3).map((item, index) => (
          <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
            <div>
              <img className='w-32 bg-indigo-50' src={item.docData.image} alt="" />
            </div>
            <div className='flex-1 text-sm text-zinc-600'>
              <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
              <p>{item.docData.speciality}</p>
              <p className='text-zinc-700 font-medium mt-1'>Address:</p>
              <p className='text-xs'>{item.docData.address.line1}</p>
              <p className='text-xs'>{item.docData.address.line2}</p>
              <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time:</span> {slotDateFormat(item.slotDate)} | {slotDateFormat(item.slotTime)}</p>
            </div>
            <div></div>
            <div className='flex flex-col gap-2 justify-end'>
              {!item.canceled && item.payment && <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500 bg-green-50' disabled>Paid</button>}
              {!item.canceled && !item.payment && <button onClick={() => { paymentGateway(item._id) }} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>Pay Online</button>}
              {!item.canceled && <button onClick={() => { cancelAppointment(item._id) }} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel appointment</button>}
              {item.canceled && <p className='text-sm text-red-600 font-medium text-center sm:min-w-48 py-2 border border-red-200 rounded'>Appointment Cancelled !!</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAppointment
