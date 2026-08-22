import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Frown } from 'lucide-react'
import DoctorFilters from '../components/DoctorFilters'
import DoctorFilterModal from '../components/DoctorFilterModal'
import DoctorCard from '../components/DoctorCard'

const specialities = [
  'General physician',
  'Gynecologist',
  'Dermatologist',
  'Pediatricians',
  'Neurologist',
  'Gastroenterologist'
]

const Doctors = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { doctors, backendUrl, token, getDoctors, currencySymbol } = useContext(AppContext)

  // Filter states
  const [selectedSpeciality, setSelectedSpeciality] = useState(searchParams.get('speciality') || '')
  const [searchName, setSearchName] = useState(searchParams.get('name') || '')
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '')
  const [selectedGenders, setSelectedGenders] = useState([])
  const [selectedTitles, setSelectedTitles] = useState([])
  const [sortBy, setSortBy] = useState('best')
  const [filteredDoctors, setFilteredDoctors] = useState([])
  const [showFilterModal, setShowFilterModal] = useState(false)

  // Booking states
  const [selectedSlots, setSelectedSlots] = useState({})
  const [bookingLoading, setBookingLoading] = useState({})

  useEffect(() => {
    setSelectedSpeciality(searchParams.get('speciality') || '')
    setSelectedCity(searchParams.get('city') || '')
    setSearchName(searchParams.get('name') || '')
  }, [searchParams])

  const availableCities = Array.from(
    new Set(
      doctors
        .map(doc => doc.address?.line2?.split(',').pop()?.trim())
        .filter(Boolean)
    )
  )

  // Filter + Sort
  useEffect(() => {
    let result = [...doctors]

    if (selectedSpeciality) {
      result = result.filter(doc => doc.speciality.toLowerCase() === selectedSpeciality.toLowerCase())
    }

    if (searchName) {
      result = result.filter(doc => doc.name.toLowerCase().includes(searchName.toLowerCase()))
    }

    if (selectedCity) {
      result = result.filter(doc => doc.address?.line2?.toLowerCase().includes(selectedCity.toLowerCase()))
    }

    if (selectedGenders.length > 0) {
      result = result.filter(doc => selectedGenders.includes(doc.gender))
    }

    if (selectedTitles.length > 0) {
      result = result.filter(doc => selectedTitles.includes(doc.title))
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.fees - b.fees)
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.fees - a.fees)
    } else if (sortBy === 'experience') {
      result.sort((a, b) => {
        const expA = parseInt(a.experience) || 0
        const expB = parseInt(b.experience) || 0
        return expB - expA
      })
    }

    setFilteredDoctors(result)
  }, [doctors, selectedSpeciality, searchName, selectedCity, selectedGenders, selectedTitles, sortBy])

  const toggleGender = (gender) => {
    setSelectedGenders(prev =>
      prev.includes(gender) ? prev.filter(g => g !== gender) : [...prev, gender]
    )
  }

  const toggleTitle = (title) => {
    setSelectedTitles(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    )
  }

  const clearFilters = () => {
    setSelectedSpeciality('')
    setSearchName('')
    setSelectedCity('')
    setSelectedGenders([])
    setSelectedTitles([])
    setSortBy('best')
    setSearchParams({})
  }

  // Generate available slots 
  const getDoctorSlots = (doc) => {
    let today = new Date()
    let slots = []

    for (let i = 0; i < 3; i++) {
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      let endTime = new Date(currentDate)
      endTime.setHours(21, 0, 0, 0)

      if (i === 0) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      let daySlots = []

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

        let day = currentDate.getDay()
        let month = currentDate.getMonth() + 1
        let year = currentDate.getFullYear()

        const slotDate = `${day} - ${month} - ${year}`
        const slotTime = formattedTime

        const isBooked = doc.slots_booked && doc.slots_booked[slotDate] && doc.slots_booked[slotDate].includes(slotTime)

        if (!isBooked) {
          daySlots.push({ datetime: new Date(currentDate), time: formattedTime, slotDate, slotTime })
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }

      let dateLabel = ''
      if (i === 0) dateLabel = 'Today'
      else if (i === 1) dateLabel = 'Tomorrow'
      else dateLabel = new Date(today.getTime() + i * 24 * 60 * 60 * 1000).toLocaleDateString([], { weekday: 'short' })

      const targetDate = new Date(today.getTime() + i * 24 * 60 * 60 * 1000)

      slots.push({
        dateLabel,
        dateNum: targetDate.getDate(),
        slots: daySlots.slice(0, 4) // Show top 4 slots per day on the card
      })
    }

    return slots
  }

  // Handle quick slot selection on a doctor card
  const selectSlot = (docId, slotDate, slotTime, dayIndex) => {
    setSelectedSlots(prev => ({
      ...prev,
      [docId]: { slotDate, slotTime, dayIndex }
    }))
  }

  const bookQuickAppointment = async (docId) => {
    if (!token) {
      toast.error('Login is required to book an appointment')
      return navigate('/login')
    }

    const booking = selectedSlots[docId]
    if (!booking) return toast.error('Please select a time slot first')

    setBookingLoading(prev => ({ ...prev, [docId]: true }))

    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/book-appointment',
        { docId, slotDate: booking.slotDate, slotTime: booking.slotTime },
        { headers: { token } }
      )

      if (data.success) {
        toast.success(data.message)
        getDoctors()
        setSelectedSlots(prev => {
          const copy = { ...prev }
          delete copy[docId]
          return copy
        })
        navigate('/my-appointments')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setBookingLoading(prev => ({ ...prev, [docId]: false }))
    }
  }

  const filterProps = {
    searchName, setSearchName,
    selectedSpeciality, setSelectedSpeciality,
    selectedCity, setSelectedCity,
    selectedTitles, toggleTitle,
    selectedGenders, toggleGender,
    availableCities, specialities,
    clearFilters,
  }

  return (
    <div className="min-h-screen text-gray-800">
      <div className="flex flex-col lg:flex-row gap-8 mt-5">

        {/* Desktop Sidebar Filters */}
        <DoctorFilters {...filterProps} />

        <div className="flex-1">

          {/* mobile filter */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-4 mb-6">
            <div className="text-sm text-gray-500 font-medium">
              <span className="text-gray-800 font-bold text-lg mr-1">{filteredDoctors.length}</span> doctors available
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowFilterModal(true)}
                className="lg:hidden flex items-center gap-1.5 border border-gray-200 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100"
              >
                Filters
              </button>

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-400 font-medium hidden sm:inline">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50 text-gray-700 cursor-pointer"
                >
                  <option value="best">Best Match</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="experience">Experience</option>
                </select>
              </div>
            </div>
          </div>

          {/* Doctor Cards List */}
          <div className="flex flex-col gap-6">
            {filteredDoctors.length === 0 ? (
              <div className="py-20 text-center text-gray-400 text-sm bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-3">
                <Frown className="w-12 h-12 text-gray-300 animate-bounce" />
                <p className="font-semibold text-gray-500">No doctors match your filters.</p>
                <button onClick={clearFilters} className="text-xs font-bold text-primary hover:underline">Reset all filters</button>
              </div>
            ) : (
              filteredDoctors.map((item) => (
                <DoctorCard
                  key={item._id}
                  item={item}
                  slotsData={getDoctorSlots(item)}
                  cardSelection={selectedSlots[item._id]}
                  bookingLoading={bookingLoading}
                  selectSlot={selectSlot}
                  bookQuickAppointment={bookQuickAppointment}
                  navigate={navigate}
                  currencySymbol={currencySymbol}
                />
              ))
            )}
          </div>

        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showFilterModal && (
        <DoctorFilterModal {...filterProps} onClose={() => setShowFilterModal(false)} />
      )}

    </div>
  )
}

export default Doctors