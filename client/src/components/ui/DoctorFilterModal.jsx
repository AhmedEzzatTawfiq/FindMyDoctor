import React from 'react'
import { assets } from '../../assets/assets'

const DoctorFilterModal = ({
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
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden lg:hidden flex justify-end">
      <div onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" />

      <div className="relative w-full max-w-sm bg-white h-full flex flex-col p-6 shadow-2xl z-10 overflow-y-auto">
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <h3 className="font-bold text-gray-800 text-lg">Filters</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <img src={assets.cross_icon} className="w-6" alt="Close" />
          </button>
        </div>

        <div className="flex flex-col gap-6 flex-1">
          {/* Name */}
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

          {/* Speciality */}
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
            onClick={onClose}
            className="flex-1 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
}

export default DoctorFilterModal
