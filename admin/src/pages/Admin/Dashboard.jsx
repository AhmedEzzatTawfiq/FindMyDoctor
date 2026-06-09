import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'

const Dashboard = () => {
  const { aToken, dashData, getDashData, cancelAppointment } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) getDashData()
  }, [aToken])

  const stats = [
    {
      label: 'Doctors',
      value: dashData?.doctors ?? '—',
      icon: assets.doctor_icon,
      color: 'from-indigo-500 to-indigo-400',
      bg: 'bg-indigo-50',
    },
    {
      label: 'Appointments',
      value: dashData?.appointments ?? '—',
      icon: assets.appointments_icon,
      color: 'from-purple-500 to-purple-400',
      bg: 'bg-purple-50',
    },
    {
      label: 'Patients',
      value: dashData?.patients ?? '—',
      icon: assets.patients_icon,
      color: 'from-pink-500 to-pink-400',
      bg: 'bg-pink-50',
    },
  ]

  return (
    <div className="m-5 w-full">
      {/* Page title */}
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Dashboard Overview</h2>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`flex items-center gap-4 ${s.bg} p-5 rounded-2xl shadow-sm border border-white`}
          >
            <div className={`w-14 h-14 rounded-xl bg-linear-to-br ${s.color} flex items-center justify-center shadow`}>
              <img src={s.icon} alt={s.label} className="w-7 h-7 brightness-[10]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
          <img src={assets.list_icon} alt="" className="w-5" />
          <h3 className="text-lg font-semibold text-gray-700">Recent Appointments</h3>
        </div>

        <div className="divide-y divide-gray-50">
          {dashData?.latestAppointments?.length > 0 ? (
            dashData.latestAppointments.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.docData?.image || assets.doctor_icon}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Dr. {item.docData?.name}</p>
                    <p className="text-xs text-gray-400">{item.slotDate} · {item.slotTime}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    item.canceled
                      ? 'bg-red-100 text-red-600'
                      : item.isCompleted
                      ? 'bg-green-100 text-green-600'
                      : 'bg-indigo-100 text-indigo-600'
                  }`}>
                    {item.canceled ? 'Cancelled' : item.isCompleted ? 'Completed' : 'Upcoming'}
                  </span>

                  {!item.canceled && !item.isCompleted && (
                    <button
                      onClick={() => cancelAppointment(item._id)}
                      className="p-1.5 hover:bg-red-50 rounded-full transition"
                      title="Cancel appointment"
                    >
                      <img src={assets.cancel_icon} alt="Cancel" className="w-5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 text-center text-gray-400 text-sm">
              No recent appointments
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard