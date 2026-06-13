import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import { AppContext } from '../context/AppContext'
import { toast } from "react-hot-toast"
import axios from "axios"
import { Star } from 'lucide-react'

const Appointment = () => {
  const { docId } = useParams()
  const { doctors, currencySymbol, backendUrl, token, getDoctors } = useContext(AppContext)
  const navigate = useNavigate()

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)

  const fetchDocInfo = async () => {
    const docInfo = doctors.find(doc => doc._id === docId)
    setDocInfo(docInfo)
  }

  const getAvailableSlots = async () => {
    if (!docInfo) return
    setDocSlots([])

    let today = new Date()

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      let endTime = new Date(currentDate)
      endTime.setHours(21, 0, 0, 0)

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      let timeSlots = []

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

        let day = currentDate.getDay()
        let month = currentDate.getMonth() + 1
        let year = currentDate.getFullYear()

        const slotDate = `${day} - ${month} - ${year}`
        const slotTime = formattedTime

        const isSlotAvailable = docInfo.slots_booked && docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true

        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
            slotDate,
            slotTime
          })
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }

      setDocSlots(prev => ([...prev, timeSlots]))
    }
  }

  const bookAppointment = async () => {
    if (!token) {
      toast.error('Login to book appointment')
      return navigate('/login')
    }

    if (!slotTime) {
      return toast.error('Please select a time slot')
    }

    setBookingLoading(true)
    try {
      const date = docSlots[slotIndex][0].datetime

      let day = date.getDay()
      let month = date.getMonth() + 1
      let year = date.getFullYear()

      const slotDate = `${day} - ${month} - ${year}`

      const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { docId, slotDate, slotTime }, { headers: { token } })

      if (data.success) {
        toast.success(data.message)
        getDoctors()
        return navigate('/my-appointments')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setBookingLoading(false)
    }
  }

  useEffect(() => {
    fetchDocInfo()
  }, [doctors, docId])

  useEffect(() => {
    getAvailableSlots()
  }, [docInfo])

  return docInfo && (
    <div className="min-h-screen pb-16">

      {/* ---------- Two Column Desktop Layout ----------- */}
      <div className="flex flex-col lg:flex-row gap-8 items-start mt-6">

        {/* Left Column: Doctor Card Details */}
        <div className="flex-1 flex flex-col gap-6 w-full">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start">

            {/* Large Image */}
            <div className="w-full md:w-56 shrink-0 bg-indigo-50 border border-gray-100 rounded-2xl overflow-hidden shadow-inner self-center md:self-start">
              <img className="w-full h-full object-cover" src={docInfo.image} alt={docInfo.name} />
            </div>

            {/* Doctor Text details */}
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{docInfo.name}</h1>
                <img className="w-6 h-6 shrink-0" src={assets.verified_icon} alt="Verified" />
              </div>

              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-sm font-semibold text-primary uppercase tracking-wide">
                  {docInfo.title} • {docInfo.degree}
                </span>
                <span className="py-0.5 px-2.5 border border-gray-200 text-xs font-semibold text-gray-500 rounded-full bg-gray-50">
                  {docInfo.experience} Experience
                </span>
              </div>

              {/* Reviews rating line */}
              {/* <div className="flex items-center gap-2 mt-3 text-sm">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="font-bold text-gray-700 bg-amber-50 px-2 py-0.5 rounded">4.8</span>
                <span className="text-gray-400">(124 verified reviews)</span>
              </div> */}

              {/* About description */}
              <div className="mt-6 border-t pt-5">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5 uppercase tracking-wider mb-2">
                  About Doctor <img className="w-4 h-4" src={assets.info_icon} alt="Info" />
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed font-light">{docInfo.about}</p>
              </div>

              {/* Speciality & Clinic address block */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 border-t pt-5 text-sm text-gray-600">
                <div>
                  <p className="font-bold text-gray-700">Speciality</p>
                  <p className="font-light mt-0.5">{docInfo.speciality}</p>
                </div>
                <div>
                  <p className="font-bold text-gray-700">Consultation Fees</p>
                  <p className="font-semibold text-primary mt-0.5 text-base">{currencySymbol}{docInfo.fees}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="font-bold text-gray-700">Clinic Address</p>
                  <p className="font-light mt-0.5 leading-relaxed">{docInfo.address.line1}, {docInfo.address.line2}</p>
                </div>
              </div>

            </div>
          </div>

          {/* Static reviews layout to make page look rich and premium */}
          {/* <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>Patient Reviews</span>
              <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded border">Verified</span>
            </h3>

            <div className="flex flex-col gap-6">
              {[
                { name: 'Sarah M.', date: 'Yesterday', comment: 'Dr. was extremely thorough and answered all my questions patiently. Very highly recommended.' },
                { name: 'John D.', date: '3 days ago', comment: 'Great clinic experience. Very clean environment and friendly reception staff. Dr. was professional.' }
              ].map((rev, rIdx) => (
                <div key={rIdx} className="border-b last:border-0 pb-5 last:pb-0 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-800">{rev.name}</span>
                    <span className="text-gray-400 font-light">{rev.date}</span>
                  </div>
                  <div className="flex text-amber-400 text-xs">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed font-light">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div> */}
        </div>

        {/* Right Column: Sticky Booking Widget */}
        <div className="w-full lg:w-96 shrink-0 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 lg:sticky lg:top-5">
          <div className="border-b pb-4 mb-4">
            <h3 className="font-bold text-gray-800 text-lg uppercase tracking-wide">Select Booking Date</h3>
            <p className="text-xs text-gray-400 mt-1 font-light">Available timeslots for next 7 days</p>
          </div>

          {/* Day Date selectors list */}
          <div className="flex gap-2.5 overflow-x-scroll no-scrollbar py-2">
            {docSlots.length > 0 && docSlots.map((item, index) => {
              const dayObj = item[0]?.datetime
              const weekday = dayObj ? daysOfWeek[dayObj.getDay()] : ''
              const dayNum = dayObj ? dayObj.getDate() : ''
              const monthName = dayObj ? months[dayObj.getMonth()] : ''

              return (
                <div
                  key={index}
                  onClick={() => { setSlotIndex(index); setSlotTime('') }}
                  className={`text-center p-3.5 min-w-16 rounded-2xl cursor-pointer border transition-all flex flex-col items-center justify-center ${slotIndex === index ? 'bg-primary border-primary text-white shadow-md hover:scale-100' : 'bg-gray-50 hover:bg-gray-100 border-gray-100 text-gray-600 hover:scale-102'}`}
                >
                  <p className="text-[10px] font-bold uppercase">{index === 0 ? 'Today' : weekday}</p>
                  <p className="text-base font-black my-0.5">{dayNum}</p>
                  <p className="text-[9px] font-medium">{monthName}</p>
                </div>
              )
            })}
          </div>

          {/* Time slot pills */}
          <div className="mt-6">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Available Slots</h4>

            {docSlots.length > 0 && docSlots[slotIndex].length === 0 ? (
              <div className="text-center py-10 border border-dashed rounded-2xl text-xs text-gray-400 font-medium">
                No slots available on this day.
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
                {docSlots.length > 0 && docSlots[slotIndex].map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSlotTime(item.time)}
                    className={`py-2 px-1 rounded-xl text-xs font-semibold border transition-all ${item.time === slotTime ? 'bg-primary border-primary text-white shadow-sm hover:scale-100' : 'bg-white hover:bg-gray-100 border-gray-200/70 text-gray-600 hover:scale-102'}`}
                  >
                    {item.time.toLowerCase()}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Book Action CTA */}
          <div className="mt-8 pt-4 border-t">
            {slotTime && (
              <div className="flex justify-between items-center text-xs mb-3 text-gray-500">
                <span>Selected Time:</span>
                <span className="font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded">
                  {docSlots[slotIndex][0] && daysOfWeek[docSlots[slotIndex][0].datetime.getDay()]} {docSlots[slotIndex][0] && docSlots[slotIndex][0].datetime.getDate()} @ {slotTime.toLowerCase()}
                </span>
              </div>
            )}
            <button
              onClick={bookAppointment}
              disabled={bookingLoading || !slotTime}
              className="w-full bg-primary hover:bg-indigo-700 text-white font-bold text-sm py-3.5 rounded-2xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {bookingLoading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {bookingLoading ? 'Booking Appointment...' : 'Confirm Appointment'}
            </button>
          </div>

        </div>

      </div>

      {/* Listing Related Doctors bottom block */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />

    </div>
  )
}

export default Appointment
