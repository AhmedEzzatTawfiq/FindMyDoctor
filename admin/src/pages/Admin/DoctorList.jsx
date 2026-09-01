import React, { useContext, useEffect, useState, useMemo } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { Trash2, ChevronLeft, ChevronRight } from 'lucide-react'

const DoctorList = () => {
  const { doctors, getAllDoctors, aToken, changeAvailability, deleteDoctor, loadingDoctors } = useContext(AdminContext)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    if (aToken && doctors.length === 0) getAllDoctors()
  }, [aToken, doctors.length, getAllDoctors])

  const totalPages = Math.ceil(doctors.length / itemsPerPage)

  const paginatedDoctors = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return doctors.slice(start, start + itemsPerPage)
  }, [doctors, currentPage, itemsPerPage])

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="m-5 w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-700">All Doctors</h2>
        {doctors.length > 0 && (
          <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100">
            Total Doctors: {doctors.length}
          </span>
        )}
      </div>

      {loadingDoctors && doctors.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 animate-pulse">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
              <div className="h-44 bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                <div className="h-3 w-1/2 bg-gray-200 rounded" />
                <div className="h-3 w-2/3 bg-gray-200 rounded" />
                <div className="h-5 w-16 bg-gray-200 rounded-full mt-3" />
              </div>
            </div>
          ))}
        </div>
      ) : doctors.length === 0 ? (
        <div className="py-20 text-center text-gray-400 text-sm bg-white rounded-2xl shadow-sm border border-gray-100">
          No doctors found. Add a doctor to get started.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {paginatedDoctors.map((doc) => (
              <div
                key={doc._id}
                className="relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* Delete Doctor */}
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this doctor?')) {
                      deleteDoctor(doc._id)
                    }
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg shadow-sm backdrop-blur-sm transition-colors z-10 cursor-pointer"
                  title="Delete Doctor"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Photo */}
                <div className="bg-indigo-50 h-48 invert-0 group-hover:bg-linear-to-br group-hover:from-indigo-100 group-hover:to-purple-100 transition-all duration-500 flex items-center justify-center">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="object-cover h-full"
                  />
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="font-semibold text-gray-800 text-sm truncate">{doc.name}</p>
                  <p className="text-xs text-indigo-500 mt-0.5">{doc.specialization}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{doc.experience} experience</p>

                  {/* Availability */}
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
              <span className="text-xs font-medium text-gray-500">
                Showing <strong className="text-gray-800">{(currentPage - 1) * itemsPerPage + 1}</strong> – <strong className="text-gray-800">{Math.min(currentPage * itemsPerPage, doctors.length)}</strong> of <strong className="text-gray-800">{doctors.length}</strong> doctors
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currentPage === page
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default DoctorList