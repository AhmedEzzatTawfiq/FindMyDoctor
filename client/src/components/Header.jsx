import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import { ClipboardList, MapPin, Search } from 'lucide-react'

const Header = () => {
    const navigate = useNavigate()
    const { doctors } = useContext(AppContext)

    const [speciality, setSpeciality] = useState('')
    const [city, setCity] = useState('')
    const [searchName, setSearchName] = useState('')

    // Extract unique cities/districts from doctors' addresses dynamically
    const availableCities = Array.from(
        new Set(
            doctors
                .map(doc => doc.address?.line2?.split(',').pop()?.trim())
                .filter(Boolean)
        )
    )

    const handleSearch = (e) => {
        e.preventDefault()
        let queryParams = new URLSearchParams()
        if (speciality) queryParams.append('speciality', speciality)
        if (city) queryParams.append('city', city)
        if (searchName) queryParams.append('name', searchName)

        navigate(`/doctors?${queryParams.toString()}`)
    }

    return (
        <div className='relative flex flex-col items-center justify-center bg-linear-to-br from-blue-600 via-indigo-600 to-indigo-800 rounded-3xl px-6 md:px-12 py-16 md:py-24 text-white shadow-2xl overflow-hidden mb-16'>

            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

            <div className='max-w-4xl text-center z-10 flex flex-col items-center gap-6'>
                <h1 className='text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-sm'>
                    Find & Book the <span className="text-blue-200">Best Doctors</span>
                </h1>
                <p className='text-base md:text-lg text-indigo-100 max-w-2xl font-light'>
                    Search from trusted medical professionals, select your preferred branch, and book appointments instantly.
                </p>

                {/* Unified Search Panel */}
                <form
                    onSubmit={handleSearch}
                    className='w-full mt-8 bg-white/10 backdrop-blur-xl p-4 sm:p-5 rounded-2xl md:rounded-full border border-white/20 shadow-lg flex flex-col md:flex-row items-center gap-4 sm:gap-3'
                >
                    {/* Speciality Dropdown */}
                    <div className='flex items-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-3 rounded-xl md:rounded-full w-full md:w-1/3 transition-all duration-300'>
                        <ClipboardList className="w-5 h-5 text-indigo-200 shrink-0" />
                        <select
                            value={speciality}
                            onChange={(e) => setSpeciality(e.target.value)}
                            className='bg-transparent text-white font-medium text-sm focus:outline-none w-full appearance-none cursor-pointer placeholder-indigo-200 [&>option]:text-gray-800'
                        >
                            <option value="">Choose Speciality</option>
                            <option value="General physician">General physician</option>
                            <option value="Gynecologist">Gynecologist</option>
                            <option value="Dermatologist">Dermatologist</option>
                            <option value="Pediatricians">Pediatricians</option>
                            <option value="Neurologist">Neurologist</option>
                            <option value="Gastroenterologist">Gastroenterologist</option>
                        </select>
                    </div>

                    {/* City/Location Dropdown */}
                    <div className='flex items-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-3 rounded-xl md:rounded-full w-full md:w-1/3 transition-all duration-300'>
                        <MapPin className="w-5 h-5 text-indigo-200 shrink-0" />
                        <select
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className='bg-transparent text-white font-medium text-sm focus:outline-none w-full appearance-none cursor-pointer placeholder-indigo-200 [&>option]:text-gray-800'
                        >
                            <option value="">Choose City / Area</option>
                            {availableCities.length > 0 ? (
                                availableCities.map(c => <option key={c} value={c}>{c}</option>)
                            ) : (
                                <>
                                    <option value="London">London</option>
                                    <option value="Cairo">Cairo</option>
                                    <option value="Alexandria">Alexandria</option>
                                    <option value="Giza">Giza</option>
                                </>
                            )}
                        </select>
                    </div>

                    {/* Doctor Name Input */}
                    <div className='flex items-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-3 rounded-xl md:rounded-full w-full md:w-1/3 transition-all duration-300'>
                        <Search className="w-5 h-5 text-indigo-200 shrink-0" />
                        <input
                            type="text"
                            placeholder="Search doctor name..."
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            className='bg-transparent text-white text-sm focus:outline-none w-full placeholder-indigo-200 font-medium'
                        />
                    </div>

                    {/* Search CTA */}
                    <button
                        type="submit"
                        className='bg-white text-indigo-700 hover:bg-indigo-50 font-semibold px-8 py-3 rounded-xl md:rounded-full shrink-0 flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md w-full md:w-auto'
                    >
                        Search
                    </button>
                </form>

                {/* Micro-profile avatars info */}
                <div className='flex items-center gap-3 mt-6 text-sm font-light text-indigo-200'>
                    <img className='w-24' src={assets.group_profiles} alt="" />
                    <p>Over <span className="text-white font-medium">10,000+</span> patients booked their doctor appointments this week.</p>
                </div>
            </div>
        </div>
    )
}

export default Header
