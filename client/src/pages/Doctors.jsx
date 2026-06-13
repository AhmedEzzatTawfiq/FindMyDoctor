import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Star, Search, Frown, DollarSign, Clock, MapPin } from 'lucide-react'

const Doctors = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { doctors, backendUrl, token, getDoctors, currencySymbol } = useContext(AppContext)

  //filter States
  const [selectedSpeciality, setSelectedSpeciality] = useState(searchParams.get('speciality') || '')
  const [searchName, setSearchName] = useState(searchParams.get('name') || '')
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '')
  const [selectedGenders, setSelectedGenders] = useState([])
  const [selectedTitles, setSelectedTitles] = useState([])
  const [sortBy, setSortBy] = useState('best') // 'best' => default, 'price-low', 'price-high', 'experience'

  const [filteredDoctors, setFilteredDoctors] = useState([])
  const [showFilterModal, setShowFilterModal] = useState(false)

  // Booking states 
  const [selectedSlots, setSelectedSlots] = useState({})
  const [bookingLoading, setBookingLoading] = useState({})

  // Update states when query parameters change
  useEffect(() => {
    setSelectedSpeciality(searchParams.get('speciality') || '')
    setSelectedCity(searchParams.get('city') || '')
    setSearchName(searchParams.get('name') || '')
  }, [searchParams])

  // Get unique cities dynamically
  const availableCities = Array.from(
    new Set(
      doctors
        .map(doc => doc.address?.line2?.split(',').pop()?.trim())
        .filter(Boolean)
    )
  )

  // Filter & Sort Logic
  useEffect(() => {
    let result = [...doctors]

    // Speciality Filter
    if (selectedSpeciality) {
      result = result.filter(doc => doc.speciality.toLowerCase() === selectedSpeciality.toLowerCase())
    }

    // Name Search
    if (searchName) {
      result = result.filter(doc => doc.name.toLowerCase().includes(searchName.toLowerCase()))
    }

    //City Filter
    if (selectedCity) {
      result = result.filter(doc => doc.address?.line2?.toLowerCase().includes(selectedCity.toLowerCase()))
    }

    //gender Filter
    if (selectedGenders.length > 0) {
      result = result.filter(doc => selectedGenders.includes(doc.gender))
    }

    // title Filter
    if (selectedTitles.length > 0) {
      result = result.filter(doc => selectedTitles.includes(doc.title))
    }

    // Sorting
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

  // Gender filter toggle
  const toggleGender = (gender) => {
    setSelectedGenders(prev =>
      prev.includes(gender) ? prev.filter(g => g !== gender) : [...prev, gender]
    )
  }

  // Title filter toggle
  const toggleTitle = (title) => {
    setSelectedTitles(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    )
  }

  // Clear all filters
  const clearFilters = () => {
    setSelectedSpeciality('')
    setSearchName('')
    setSelectedCity('')
    setSelectedGenders([])
    setSelectedTitles([])
    setSortBy('best')
    setSearchParams({})
  }

  // Generate Slots for the next 3 days for a specific doctor
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
          daySlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
            slotDate,
            slotTime
          })
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
        slots: daySlots.slice(0, 4) // Show top 4 slots for card preview
      })
    }
    return slots
  }

  //handle quick slot selection
  const selectSlot = (docId, slotDate, slotTime, dayIndex) => {
    setSelectedSlots(prev => ({
      ...prev,
      [docId]: { slotDate, slotTime, dayIndex }
    }))
  }

  //direct book appointment
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
        // clear selected slot
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

  const specialities = [
    'General physician',
    'Gynecologist',
    'Dermatologist',
    'Pediatricians',
    'Neurologist',
    'Gastroenterologist'
  ]

  return (
    <div className="min-h-screen text-gray-800">
      <div className="flex flex-col lg:flex-row gap-8 mt-5">

        {/* Left Sidebar Filters*/}
        <div className="hidden lg:flex flex-col gap-6 w-72 shrink-0 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
          <div className="flex items-center justify-between border-b pb-4">
            <h3 className="font-bold text-gray-800 text-lg">Filters</h3>
            <button onClick={clearFilters} className="text-xs font-semibold text-primary hover:underline">Clear All</button>
          </div>

          {/* Search by Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Doctor Name</label>
            <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-primary/20">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="bg-transparent text-sm focus:outline-none w-full"
              />
            </div>
          </div>

          {/* Speciality List */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Speciality</label>
            <div className="flex flex-col gap-1.5">
              {specialities.map(sp => (
                <div
                  key={sp}
                  onClick={() => setSelectedSpeciality(selectedSpeciality === sp ? '' : sp)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium cursor-pointer border transition-all ${selectedSpeciality === sp ? 'bg-primary/10 border-primary text-primary' : 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100'}`}
                >
                  {sp}
                </div>
              ))}
            </div>
          </div>

          {/* City / Area Dropdown */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">City / District</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50 w-full"
            >
              <option value="">All Locations</option>
              {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Title Filters */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Doctor Title</label>
            <div className="flex flex-col gap-2">
              {['Professor', 'Lecturer', 'Consultant', 'Specialist'].map(t => (
                <label key={t} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:text-gray-900">
                  <input
                    type="checkbox"
                    checked={selectedTitles.includes(t)}
                    onChange={() => toggleTitle(t)}
                    className="w-4 h-4 rounded text-primary border-gray-300 focus:ring-primary"
                  />
                  <span>{t}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Gender Filters */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Gender</label>
            <div className="flex flex-col gap-2">
              {['Male', 'Female'].map(g => (
                <label key={g} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:text-gray-900">
                  <input
                    type="checkbox"
                    checked={selectedGenders.includes(g)}
                    onChange={() => toggleGender(g)}
                    className="w-4 h-4 rounded text-primary border-gray-300 focus:ring-primary"
                  />
                  <span>{g}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* right results area */}
        <div className="flex-1">

          {/* top bar sort and mobile filter triggers */}
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

          {/* Doctors List Cards Grid */}
          <div className="flex flex-col gap-6">
            {filteredDoctors.length === 0 ? (
              <div className="py-20 text-center text-gray-400 text-sm bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-3">
                <Frown className="w-12 h-12 text-gray-300 animate-bounce" />
                <p className="font-semibold text-gray-500">No doctors match your filters.</p>
                <button onClick={clearFilters} className="text-xs font-bold text-primary hover:underline">Reset all filters</button>
              </div>
            ) : (
              filteredDoctors.map((item, index) => {
                const slotsData = getDoctorSlots(item)
                const cardSelection = selectedSlots[item._id]

                return (
                  <div
                    key={item._id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow duration-300 group"
                  >

                    {/* Left Side: Doctor img and core details */}
                    <div className="flex-1 p-5 sm:p-6 flex flex-col sm:flex-row gap-5">

                      {/* photo section */}
                      <div className="w-full sm:w-32 shrink-0 flex flex-col items-center gap-2">
                        <div className="w-28 h-28 rounded-2xl overflow-hidden bg-indigo-50 border border-gray-100 shadow-inner">
                          <img
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            src={item.image}
                            alt={item.name}
                          />
                        </div>
                        {item.available ? (
                          <div className="flex items-center gap-1.5 text-xs text-green-600 font-semibold bg-green-50 px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                            <span>Available</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-0.5 rounded-full">Unavailable</span>
                        )}
                      </div>

                      {/* Doctor Info */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h2
                              onClick={() => navigate(`/appointment/${item._id}`)}
                              className="text-lg font-bold text-gray-900 hover:text-primary cursor-pointer transition-colors"
                            >
                              {item.name}
                            </h2>
                            <img className="w-4 h-4" src={assets.verified_icon} alt="Verified" />
                          </div>

                          <p className="text-xs font-semibold text-primary mt-0.5 uppercase tracking-wider">
                            {item.title} • {item.degree}
                          </p>

                          <p className="text-xs text-gray-500 font-medium mt-1">
                            Speciality: <span className="text-gray-700 font-semibold">{item.speciality}</span>
                          </p>

                          {/* static rating ui */}
                          {/* <div className="flex items-center gap-1.5 mt-2">
                            <div className="flex text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-current" />
                              ))}
                            </div>
                            <span className="text-xs font-bold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">4.8</span>
                            <span className="text-xs text-gray-400 font-light">(124 reviews)</span>
                          </div> */}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mt-4 text-xs text-gray-600 border-t pt-4">
                            <div className="flex items-center gap-1.5">
                              <DollarSign className="w-4 h-4 text-gray-400" />
                              <span>Fees: <span className="font-semibold text-gray-800">{currencySymbol}{item.fees}</span></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span>Waiting time: <span className="font-semibold text-gray-800">15 mins</span></span>
                            </div>
                            <div className="flex items-center gap-1.5 sm:col-span-2">
                              <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                              <span className="truncate">{item.address.line1}, {item.address.line2}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => navigate(`/appointment/${item._id}`)}
                          className="text-xs text-primary hover:text-indigo-700 font-bold flex items-center gap-1 mt-4 group/btn w-fit"
                        >
                          View Doctor Profile
                          <span className="transition-transform group-hover/btn:translate-x-1">→</span>
                        </button>
                      </div>

                    </div>

                    {/* right side: quick in-Card booking calendar */}
                    <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-gray-100 bg-gray-50/50 p-5 flex flex-col justify-between shrink-0">
                      <div>
                        <div className="flex items-center justify-between border-b pb-2 mb-3">
                          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Book Appointment</span>
                          <span className="text-[10px] text-gray-400 font-medium">Quick reserve</span>
                        </div>

                        {/* Calendar 3 columns slider */}
                        <div className="grid grid-cols-3 gap-2">
                          {slotsData.map((dayData, dayIdx) => (
                            <div key={dayIdx} className="flex flex-col gap-1.5 text-center">
                              <div className="bg-indigo-50/70 border border-indigo-100/50 rounded-lg py-1">
                                <p className="text-[10px] font-bold text-indigo-700 uppercase">{dayData.dateLabel}</p>
                                <p className="text-xs font-black text-indigo-900">{dayData.dateNum}</p>
                              </div>

                              {/* Slot buttons */}
                              <div className="flex flex-col gap-1">
                                {dayData.slots.length === 0 ? (
                                  <div className="text-[9px] text-gray-400 py-3 font-medium">Fully booked</div>
                                ) : (
                                  dayData.slots.map((slot, sIdx) => {
                                    const isSelected = cardSelection &&
                                      cardSelection.slotDate === slot.slotDate &&
                                      cardSelection.slotTime === slot.slotTime

                                    return (
                                      <button
                                        key={sIdx}
                                        onClick={() => selectSlot(item._id, slot.slotDate, slot.slotTime, dayIdx)}
                                        className={`py-1.5 px-1 rounded-md text-[10px] font-semibold border transition-all ${isSelected ? 'bg-primary border-primary text-white shadow-sm' : 'bg-white hover:bg-gray-100 border-gray-200/70 text-gray-600'}`}
                                      >
                                        {slot.time.toLowerCase()}
                                      </button>
                                    )
                                  })
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Confirmation CTA button */}
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        {cardSelection ? (
                          <button
                            disabled={bookingLoading[item._id]}
                            onClick={() => bookQuickAppointment(item._id)}
                            className="w-full bg-primary text-white font-bold text-xs py-2.5 rounded-xl shadow hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                          >
                            {bookingLoading[item._id] && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                            Book for {cardSelection.slotTime.toLowerCase()}
                          </button>
                        ) : (
                          <div className="text-[10px] text-gray-400 text-center font-medium italic py-2">
                            Select a time slot above to book instantly
                          </div>
                        )}
                      </div>

                    </div>

                  </div>
                )
              })
            )}
          </div>

        </div>

      </div>

      {/* Mobile filters slide-over / modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden flex justify-end">
          <div onClick={() => setShowFilterModal(false)} className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" />

          <div className="relative w-full max-w-sm bg-white h-full flex flex-col p-6 shadow-2xl z-10 overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <h3 className="font-bold text-gray-800 text-lg">Filters</h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <img src={assets.cross_icon} className="w-6" alt="Close" />
              </button>
            </div>

            <div className="flex flex-col gap-6 flex-1">
              {/* Doctor Name Search */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">Doctor Name</label>
                <input
                  type="text"
                  placeholder="Search doctor..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-primary/20 bg-gray-50 outline-none"
                />
              </div>

              {/* Speciality List */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">Speciality</label>
                <select
                  value={selectedSpeciality}
                  onChange={(e) => setSelectedSpeciality(e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50 w-full"
                >
                  <option value="">All Specialities</option>
                  {specialities.map(sp => <option key={sp} value={sp}>{sp}</option>)}
                </select>
              </div>

              {/* City Filter */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">City / District</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50 w-full"
                >
                  <option value="">All Locations</option>
                  {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Doctor Title */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">Doctor Title</label>
                <div className="flex flex-col gap-2.5">
                  {['Professor', 'Lecturer', 'Consultant', 'Specialist'].map(t => (
                    <label key={t} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTitles.includes(t)}
                        onChange={() => toggleTitle(t)}
                        className="w-4 h-4 rounded text-primary border-gray-300 focus:ring-primary"
                      />
                      <span>{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">Gender</label>
                <div className="flex flex-col gap-2.5">
                  {['Male', 'Female'].map(g => (
                    <label key={g} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedGenders.includes(g)}
                        onChange={() => toggleGender(g)}
                        className="w-4 h-4 rounded text-primary border-gray-300 focus:ring-primary"
                      />
                      <span>{g}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 border-t pt-4 mt-6">
              <button
                onClick={clearFilters}
                className="flex-1 py-2.5 border rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="flex-1 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Doctors