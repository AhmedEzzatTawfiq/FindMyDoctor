import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import RelatedDoctors from '../components/RelatedDoctors'
import DoctorInfoCard from '../components/DoctorInfoCard'
import BookingPanel from '../components/BookingPanel'
import { AppContext } from '../context/AppContext'
import { toast } from "react-hot-toast"
import axios from "axios"

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const Appointment = () => {
  const { docId } = useParams()
  const { doctors, currencySymbol, backendUrl, token, getDoctors } = useContext(AppContext)
  const navigate = useNavigate()

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)

  const fetchDocInfo = () => {
    const found = doctors.find(doc => doc._id === docId)
    setDocInfo(found)
  }

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
      const slotDate = `${date.getDay()} - ${date.getMonth() + 1} - ${date.getFullYear()}`
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

  useEffect(() => { fetchDocInfo() }, [doctors, docId])
  useEffect(() => { getAvailableSlots() }, [docInfo])

  return docInfo && (
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
      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  )
}

export default Appointment
