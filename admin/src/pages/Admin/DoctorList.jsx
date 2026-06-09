import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorList = () => {
  const { doctors, getAllDoctors, aToken, changeAvailability } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) getAllDoctors()
  }, [aToken])

  return (
    <div className="m-5 w-full">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">All Doctors</h2>

      {doctors.length === 0 ? (
        <div className="py-20 text-center text-gray-400 text-sm bg-white rounded-2xl shadow-sm border border-gray-100">
          No doctors found. Add a doctor to get started.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {doctors.map((doc) => (
            <div
              key={doc._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Photo */}
              <div className="bg-indigo-50 group-hover:bg-linear-to-br group-hover:from-indigo-100 group-hover:to-purple-100 transition-all duration-500 flex items-center justify-center h-36">
                <img
                  src={doc.image}
                  alt={doc.name}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="font-semibold text-gray-800 text-sm truncate">{doc.name}</p>
                <p className="text-xs text-indigo-500 mt-0.5">{doc.specialization}</p>
                <p className="text-xs text-gray-400 mt-0.5">{doc.experience} experience</p>

                {/* Availability toggle */}
                <label className="mt-3 flex items-center gap-2 cursor-pointer group/toggle">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={doc.available}
                      onChange={() => changeAvailability(doc._id)}
                    />
                    <div className={`w-9 h-5 rounded-full transition-colors ${doc.available ? 'bg-indigo-500' : 'bg-gray-300'}`} />
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${doc.available ? 'translate-x-4' : ''}`} />
                  </div>
                  <span className={`text-xs font-medium ${doc.available ? 'text-indigo-600' : 'text-gray-400'}`}>
                    {doc.available ? 'Available' : 'Unavailable'}
                  </span>
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DoctorList