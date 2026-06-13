import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { User, Trash2 } from 'lucide-react'

const Appointment = () => {
  const { aToken, appointments, getAllAppointments, deleteAppointment } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) getAllAppointments()
  }, [aToken])

  const calculateAge = (dob) => {
    if (!dob) return '—'
    const today = new Date()
    const birthDate = new Date(dob)
    return today.getFullYear() - birthDate.getFullYear()
  }

  return (
    <div className="m-5 w-full">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">All Appointments</h2>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Table header */}
        <div className="hidden sm:grid grid-cols-[40px_2fr_80px_2fr_1fr_80px_80px] gap-2 px-6 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Doctor</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        <div className="divide-y divide-gray-50">
          {appointments.length > 0 ? appointments.map((item, index) => (
            <div
              key={item._id}
              className="flex flex-col sm:grid sm:grid-cols-[40px_2fr_80px_2fr_1fr_80px_80px] gap-2 items-center px-6 py-3 hover:bg-gray-50 transition text-sm"
            >
              <p className="text-gray-400 font-medium">{index + 1}</p>

              {/* Patient */}
              <div className="flex items-center gap-2">
                {item.userData?.image ? (
                  <img
                    src={item.userData.image}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                    <User className="w-4 h-4 text-gray-400" />
                  </div>
                )}
                <p className="font-medium text-gray-700">{item.userData?.name || '—'}</p>
              </div>

              <p className="text-gray-500">{calculateAge(item.userData?.d_birth)}</p>

              {/* Doctor */}
              <div className="flex items-center gap-2">
                {item.docData?.image ? (
                  <img
                    src={item.docData.image}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                    <User className="w-4 h-4 text-gray-400" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-700">{item.docData?.name || '—'}</p>
                  <p className="text-xs text-gray-400">{item.docData?.specialization}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-700">{item.slotDate}</p>
                <p className="text-xs text-gray-400">{item.slotTime}</p>
              </div>

              <p className="text-gray-700 font-medium">{item.amount} EGP</p>

              {/* Status / Action */}
              <div>
                {item.canceled ? (
                  <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-600 font-medium mr-2">Cancelled</span>
                ) : item.isCompleted ? (
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600 font-medium mr-2">Done</span>
                ) : null}
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this appointment?')) {
                      deleteAppointment(item._id)
                    }
                  }}
                  className="p-1.5 hover:bg-red-50 rounded-full transition"
                  title="Delete Appointment"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </div>
            </div>
          )) : (
            <div className="py-16 text-center text-gray-400 text-sm">
              No appointments found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Appointment