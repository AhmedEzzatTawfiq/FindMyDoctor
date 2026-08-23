import React, { useContext, useEffect, useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import RelatedDoctors from '../../components/ui/RelatedDoctors'
import DoctorInfoCard from '../../components/ui/DoctorInfoCard'
import BookingPanel from '../../components/ui/BookingPanel'
import { toast } from "react-hot-toast"
import axios from "axios"
import { AppContext } from '../../context/AppContext'

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const Appointment = () => {
  const { docId } = useParams()
  const { doctors, currencySymbol, backendUrl, token, getDoctors } = useContext(AppContext)
  const navigate = useNavigate()

  const docInfo = useMemo(() => {
    return doctors.find(doc => doc._id === docId) || null
  }, [doctors, docId])

  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)

  const getAvailableSlots = () => {
    if (!docInfo) return setDocSlots([])
    const today = new Date()
    const allSlots = []

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)
      const endTime = new Date(currentDate)
      endTime.setHours(21, 0, 0, 0)

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else {
        currentDate.setHours(10, 0)
      }

      const timeSlots = []
      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        const day = currentDate.getDay()
        const month = currentDate.getMonth() + 1
        const year = currentDate.getFullYear()
        const slotDate = `${day} - ${month} - ${year}`

        const isAvailable = !(docInfo.slots_booked?.[slotDate]?.includes(formattedTime))
        if (isAvailable) timeSlots.push({ datetime: new Date(currentDate), time: formattedTime, slotDate, slotTime: formattedTime })

        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }
      allSlots.push(timeSlots)
    }
    setDocSlots(allSlots)
  }

  const bookAppointment = async () => {
    if (!token) { toast.error('Login to book appointment'); return navigate('/login') }
    if (!slotTime) return toast.error('Please select a time slot')

    setBookingLoading(true)
    try {
      const date = docSlots[slotIndex][0].datetime
      const slotDate = `${date.getDate()} - ${date.getMonth() + 1} - ${date.getFullYear()}`
      console.log(date)
      console.log(date.getDate())
      const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { docId, slotDate, slotTime }, { headers: { token } })

      if (data.success) { toast.success(data.message); getDoctors(); return navigate('/my-appointments') }
      else toast.error(data.message)
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setBookingLoading(false)
    }
  }

  useEffect(() => { getAvailableSlots() }, [docInfo])

  if (!docInfo) {
    return (
      <div className="min-h-screen py-8 animate-pulse space-y-6">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-100 flex flex-col md:flex-row gap-6 w-full">
            <div className="w-48 h-48 bg-gray-200 rounded-2xl shrink-0" />
            <div className="flex-1 space-y-3 w-full">
              <div className="h-6 w-48 bg-gray-200 rounded" />
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-16 w-full bg-gray-200 rounded-xl" />
            </div>
          </div>
          <div className="w-full lg:w-96 bg-white p-6 rounded-2xl border border-gray-100 space-y-4">
            <div className="h-6 w-40 bg-gray-200 rounded" />
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[1, 2, 3, 4, 5, 6, 7].map(i => <div key={i} className="w-12 h-16 bg-gray-200 rounded-xl shrink-0" />)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-16">
      <div className="flex flex-col lg:flex-row gap-8 items-start mt-6">
        <div className="flex-1 flex flex-col gap-6 w-full">
          <DoctorInfoCard docInfo={docInfo} currencySymbol={currencySymbol} />
        </div>
        <BookingPanel
          docSlots={docSlots}
          slotIndex={slotIndex}
          setSlotIndex={setSlotIndex}
          slotTime={slotTime}
          setSlotTime={setSlotTime}
          bookAppointment={bookAppointment}
          bookingLoading={bookingLoading}
          daysOfWeek={daysOfWeek}
          months={months}
        />
      </div>
      {/* <RelatedDoctors docId={docId} speciality={docInfo.speciality} /> */}
    </div>
  )
}

export default Appointment
