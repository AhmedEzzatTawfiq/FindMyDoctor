import React from 'react'
import { Search } from 'lucide-react'

const DoctorFilters = ({
  searchName,
  setSearchName,
  selectedSpeciality,
  setSelectedSpeciality,
  selectedCity,
  setSelectedCity,
  selectedTitles,
  toggleTitle,
  selectedGenders,
  toggleGender,
  availableCities,
  specialities,
  clearFilters,
}) => {
  return (
    <div className="hidden lg:flex flex-col gap-6 w-72 shrink-0 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
      <div className="flex items-center justify-between border-b pb-4">
        <h3 className="font-bold text-gray-800 text-lg">Filters</h3>
        <button onClick={clearFilters} className="text-xs font-semibold text-primary hover:underline">Clear All</button>
      </div>

      {/* Name Search */}
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

      {/* Speciality */}
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

      {/* City */}
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

      {/* Title */}
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

      {/* Gender */}
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
  )
}

export default DoctorFilters
