import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { User, Trash2, Calendar, Clock } from 'lucide-react'

const Appointment = () => {
  const { aToken, appointments, getAllAppointments, deleteAppointment, loadingAppointments } = useContext(AdminContext)

  useEffect(() => {
    if (aToken && appointments.length === 0) getAllAppointments()
  }, [aToken, appointments.length, getAllAppointments])


  return (
    <div className="m-3 sm:m-5 w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-700">All Appointments</h2>
        <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
          {appointments.length} Bookings
        </span>
      </div>

      {loadingAppointments && appointments.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200" />
                <div className="h-4 w-28 bg-gray-200 rounded" />
              </div>
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-4 w-16 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <div className="py-16 text-center text-gray-400 text-sm bg-white rounded-2xl shadow-sm border border-gray-100">
          No appointments found
        </div>
      ) : (
        <>
          {/* Desktop Table View (sm and above) */}
          <div className="hidden sm:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-5 gap-2 px-6 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
              <p>#  Patient</p>
              <p>Doctor</p>
              <p>Date & Time</p>
              <p>Fees</p>
              <p className="text-right">Action</p>
            </div>

            <div className=''>
              {appointments.map((item, index) => (
                <div
                  key={item._id}
                  className="grid grid-cols-5 gap-2 items-center px-6 py-3.5 hover:bg-gray-50/80 transition text-sm"
                >
                  <div className='flex gap-2 items-center'>
                    <p className="text-gray-400 font-bold text-xs">{index + 1}</p>
                  <div className="flex items-center gap-2.5">
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
                    <p className="font-semibold text-gray-800 text-xs">{item.userData?.name || '—'}</p>
                  </div>
                  </div>


                  <div className="flex items-center gap-2.5">
                    {item.docData?.image ? (
                      <img
                        src={item.docData.image}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100">
                        <User className="w-4 h-4 text-indigo-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-800 text-xs">{item.docData?.name || '—'}</p>
                      <p className="text-[10px] text-gray-400">{item.docData?.specialization}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-700 text-xs font-medium">{item.slotDate}</p>
                    <p className="text-[10px] text-gray-400">{item.slotTime}</p>
                  </div>

                  <p className="text-gray-800 font-bold text-xs">{item.amount} EGP</p>

                  <div className="flex justify-end">
                    {item.canceled ? (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-semibold">Cancelled</span>
                    ) : item.isCompleted ? (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-100 text-green-600 font-semibold">Done</span>
                    ) : (
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this appointment?')) {
                            deleteAppointment(item._id)
                          }
                        }}
                        className="p-1.5 hover:bg-red-50 rounded-full transition text-red-500"
                        title="Delete Appointment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile cards view for sm screens */}
          <div className="flex flex-col gap-3 sm:hidden">
            {appointments.map((item, index) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400">#{index + 1}</span>
                    <div className="flex items-center gap-1 text-xs font-medium text-gray-700 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                      <Calendar className="w-3 h-3 text-indigo-500" />
                      <span>{item.slotDate}</span>
                      <span className="text-gray-300">|</span>
                      <Clock className="w-3 h-3 text-indigo-500" />
                      <span>{item.slotTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.canceled ? (
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 font-bold border border-red-100">Cancelled</span>
                    ) : item.isCompleted ? (
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-green-50 text-green-600 font-bold border border-green-100">Done</span>
                    ) : (
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this appointment?')) {
                            deleteAppointment(item._id)
                          }
                        }}
                        className="p-1.5 hover:bg-red-50 text-red-500 rounded-full transition"
                        title="Delete Appointment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex flex-col gap-1.5 p-2.5 rounded-xl bg-gray-50/80 border border-gray-100">
                    <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Patient</span>
                    <div className="flex items-center gap-2">
                      {item.userData?.image ? (
                        <img src={item.userData.image} alt="" className="w-7 h-7 rounded-full object-cover border border-gray-200 shrink-0" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                          <User className="w-3.5 h-3.5 text-gray-500" />
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <p className="font-semibold text-gray-800 truncate">{item.userData?.name || '—'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 p-2.5 rounded-xl bg-indigo-50/40 border border-indigo-100/60">
                    <span className="text-[10px] font-bold uppercase text-indigo-400 tracking-wider">Doctor</span>
                    <div className="flex items-center gap-2">
                      {item.docData?.image ? (
                        <img src={item.docData.image} alt="" className="w-7 h-7 rounded-full object-cover border border-gray-200 shrink-0" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                          <User className="w-3.5 h-3.5 text-indigo-500" />
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <p className="font-semibold text-gray-800 truncate">{item.docData?.name || '—'}</p>
                        <p className="text-[10px] text-indigo-500 truncate">{item.docData?.specialization}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-gray-50 text-xs">
                  <span className="text-gray-500 font-medium">Fee</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
                    {item.amount} EGP
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Appointment
