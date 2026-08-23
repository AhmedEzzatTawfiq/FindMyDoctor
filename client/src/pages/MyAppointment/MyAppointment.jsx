import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import { toast } from "react-hot-toast"
import axios from "axios"
import { Calendar, Check } from 'lucide-react'

const MyAppointment = () => {
  const { backendUrl, token, getDoctors } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('-')
    return `${dateArray[0]} ${months[dateArray[1] - 1]} ${dateArray[2]}`
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        getAppointments()
        getDoctors()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
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
      toast.error(error.response?.data?.message || error.message)
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
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const getAppointments = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
      if (data.success) {
        setAppointments(data.appointments.reverse())
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
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
    <div className="min-h-screen pb-20">
      <div className="flex items-center justify-between border-b pb-4 mt-8">
        <h2 className="text-xl font-bold text-gray-800">My Appointments</h2>
        <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
          {appointments.length} Total Bookings
        </span>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4 mt-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col md:flex-row gap-5">
              <div className="w-24 h-24 rounded-xl bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-3 w-full">
                <div className="h-5 w-48 bg-gray-200 rounded" />
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-4 w-40 bg-gray-200 rounded" />
              </div>
              <div className="w-full md:w-36 h-10 bg-gray-200 rounded-xl" />
            </div>
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-20 border border-dashed rounded-2xl text-sm text-gray-400 font-semibold mt-6 flex flex-col items-center gap-3">
          <Calendar className="w-10 h-10 text-gray-300" />
          <span>You haven't booked any appointments yet.</span>
        </div>
      ) : (
        <div className="flex flex-col gap-5 mt-6">
          {appointments.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 flex flex-col md:flex-row gap-5 items-start md:items-center hover:shadow-sm transition-shadow duration-300"
            >

              {/* Doctor Avatar */}
              <div className="w-30 h-40 rounded-xl overflow-hidden bg-indigo-50 border border-gray-100 shrink-0 shadow-inner">
                <img className="w-full h-full object-cover" src={item.docData.image} alt={item.docData.name} />
              </div>

              {/* Booking & Doctor Info */}
              <div className="flex-1 text-xs text-gray-600 w-full">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <p className="text-sm font-bold text-gray-900">{item.docData.name}</p>
                  <span className="px-2 py-0.5 border border-gray-100 text-[10px] font-bold text-primary rounded-full bg-indigo-50/50 uppercase tracking-wider">
                    {item.docData.specialization}
                  </span>
                </div>

                <div>
                  <span className="font-bold text-gray-800">Clinic Address:</span>
                  <p className="mt-0.5 font-light">{item.docData.address.line1}, {item.docData.address.line2}</p>
                </div>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 pt-1">
                  <div>
                    <span className="font-bold text-gray-800">Date & Time:</span>
                    <p className="mt-0.5 font-medium text-gray-700 bg-gray-50 px-2 py-1 rounded border border-gray-100/50 w-fit">
                      {slotDateFormat(item.slotDate)} | {item.slotTime.toLowerCase()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking status label */}
              <div className="flex flex-col gap-2 shrink-0 w-full md:w-48 self-stretch justify-end border-t md:border-t-0 pt-4 md:pt-0">
                {item.canceled ? (
                  <div className="text-center py-2.5 px-4 border border-red-100 text-red-600 bg-red-50 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    Cancelled
                  </div>
                ) : item.payment ? (
                  /* paid */
                  <div className="flex flex-col items-center justify-center gap-2 py-3 px-4 bg-linear-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl">
                    <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center shadow-md shadow-green-200">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-center">
                      <p className="text-green-700 font-extrabold text-sm">Paid</p>
                      <p className="text-green-500 text-[10px] font-medium mt-0.5">Payment Confirmed</p>
                    </div>
                  </div>
                ) : (
                  /* Not paied and not canceled */
                  <>
                    <button
                      onClick={() => paymentGateway(item._id)}
                      className="w-full bg-primary hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-sm transition-colors"
                    >
                      Pay Online
                    </button>
                    <button
                      onClick={() => cancelAppointment(item._id)}
                      className="w-full bg-white hover:bg-red-50 border border-gray-200 text-gray-500 hover:text-red-600 font-bold text-xs py-2.5 rounded-xl transition-all"
                    >
                      Cancel Appointment
                    </button>
                  </>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyAppointment
