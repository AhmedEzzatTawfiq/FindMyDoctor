import React from 'react'
import { Camera, Mail, Edit2, Save, X } from 'lucide-react'

const ProfileSidebar = ({ userData, setUserData, isEdit, setIsEdit, image, setImage, updateUserData, getUserData }) => {
  return (
    <div className='flex flex-col items-center text-center md:items-start md:text-left shrink-0 md:w-64'>
      {/* Profile image */}
      <div className='relative w-32 h-32 rounded-full border-4 border-white shadow-lg bg-white overflow-hidden group mb-4'>
        {isEdit ? (
          <label htmlFor="image" className='cursor-pointer w-full h-full block relative'>
            <img
              className='w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-75'
              src={image ? URL.createObjectURL(image) : userData.image}
              alt="Avatar"
            />
            <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white'>
              <Camera size={20} />
            </div>
            <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' hidden />
          </label>
        ) : (
          <img className='w-full h-full object-cover' src={userData.image} alt="Avatar" />
        )}
      </div>

      {/* Name */}
      {isEdit ? (
        <input
          className='w-full text-center md:text-left bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xl font-bold text-gray-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'
          type="text"
          value={userData.name}
          onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Full Name"
        />
      ) : (
        <h2 className='text-2xl font-extrabold text-gray-800 tracking-tight'>{userData.name}</h2>
      )}

      <p className='text-gray-400 text-sm mt-1.5 mb-6 flex items-center gap-1.5 justify-center md:justify-start'>
        <Mail size={14} className='text-gray-400' />
        {userData.email}
      </p>

      <div className='w-full flex flex-col gap-2 mt-auto pt-4 border-t border-gray-100'>
        {isEdit ? (
          <div className='flex gap-2 w-full'>
            <button
              onClick={updateUserData}
              className='flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-[#4d5ce6] text-white font-semibold py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300'
            >
              <Save size={16} />
              Save
            </button>
            <button
              onClick={() => { getUserData(); setIsEdit(false); setImage(false) }}
              className='flex items-center justify-center bg-gray-100 text-gray-600 hover:bg-gray-200 font-semibold py-2.5 px-3.5 rounded-xl transition-all duration-200'
              title="Cancel changes"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className='w-full flex items-center justify-center gap-2 border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 shadow-xs'
          >
            <Edit2 size={16} />
            Edit Profile
          </button>
        )}
      </div>
    </div>
  )
}

export default ProfileSidebar
