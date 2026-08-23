import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { Stethoscope, CalendarCheck, Users, List, Trash2, User } from 'lucide-react'

const Dashboard = () => {
  const { aToken, dashData, getDashData, deleteAppointment, loadingDash } = useContext(AdminContext)

  useEffect(() => {
    if (aToken && !dashData) getDashData()
  }, [aToken, dashData, getDashData])

  if (!dashData && loadingDash) {
    return (
      <div className="m-5 w-full animate-pulse">
        <div className="h-8 w-56 bg-gray-200 rounded-lg mb-6" />
        
        {/* Stats cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-14 h-14 rounded-xl bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-7 w-16 bg-gray-200 rounded" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Recent appointments skeleton */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-200 rounded" />
            <div className="h-5 w-44 bg-gray-200 rounded" />
          </div>
          <div className="divide-y divide-gray-100 p-4 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="h-6 w-20 bg-gray-200 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const stats = [
    {
      label: 'Doctors',
      value: dashData?.doctors ?? '—',
      icon: <Stethoscope className="w-8 h-8 text-white" />,
      color: 'from-indigo-500 to-indigo-400',
      bg: 'bg-indigo-50',
    },
    {
      label: 'Appointments',
      value: dashData?.appointments ?? '—',
      icon: <CalendarCheck className="w-8 h-8 text-white" />,
      color: 'from-purple-500 to-purple-400',
      bg: 'bg-purple-50',
    },
    {
      label: 'Patients',
      value: dashData?.patients ?? '—',
      icon: <Users className="w-8 h-8 text-white" />,
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
              {s.icon}
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
          <List className="w-5 h-5 text-gray-500" />
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
                  {item.docData?.image ? (
                    <img
                      src={item.docData.image}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
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

                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this appointment?')) {
                        deleteAppointment(item._id)
                      }
                    }}
                    className="p-1.5 hover:bg-red-50 rounded-full transition"
                    title="Delete appointment"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
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