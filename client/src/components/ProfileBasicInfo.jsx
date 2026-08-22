import React from 'react'
import { User, Calendar } from 'lucide-react'

const ProfileBasicInfo = ({ userData, setUserData, isEdit }) => {
  return (
    <div>
      <div className='flex items-center gap-2.5 pb-2 border-b border-gray-100 mb-4'>
        <User size={18} className='text-primary' />
        <h3 className='font-bold text-gray-800 text-base uppercase tracking-wider'>Basic Information</h3>
      </div>

      <div className='grid sm:grid-cols-2 gap-5'>
        {/* Gender */}
        <div className='bg-slate-50/50 border border-slate-100 rounded-2xl p-4 transition-all hover:bg-slate-50'>
          <span className='text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5'>Gender</span>
          {isEdit ? (
            <select
              className='w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'
              onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}
              value={userData.gender}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Not Selected">Not Selected</option>
            </select>
          ) : (
            <p className='text-gray-700 font-medium text-sm'>{userData.gender || 'Not Selected'}</p>
          )}
        </div>

        {/* Birthday */}
        <div className='bg-slate-50/50 border border-slate-100 rounded-2xl p-4 transition-all hover:bg-slate-50'>
          <div className='flex items-center gap-1.5 mb-1.5'>
            <Calendar size={14} className='text-gray-400' />
            <span className='text-xs font-semibold text-gray-400 uppercase tracking-wider block'>Birthday</span>
          </div>
          {isEdit ? (
            <input
              className='w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'
              type="date"
              onChange={(e) => setUserData(prev => ({ ...prev, d_birth: e.target.value }))}
              value={userData.d_birth || ''}
            />
          ) : (
            <p className='text-gray-700 font-medium text-sm'>{userData.d_birth || 'Not Selected'}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileBasicInfo
