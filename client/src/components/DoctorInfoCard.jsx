import React from 'react'
import { assets } from '../assets/assets'

const DoctorInfoCard = ({ docInfo, currencySymbol }) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start">

      <div className="w-full md:w-56 shrink-0 bg-indigo-50 border border-gray-100 rounded-2xl overflow-hidden shadow-inner self-center md:self-start">
        <img className="w-full h-full object-cover" src={docInfo.image} alt={docInfo.name} />
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{docInfo.name}</h1>
          <img className="w-6 h-6 shrink-0" src={assets.verified_icon} alt="Verified" />
        </div>

        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className="text-sm font-semibold text-primary uppercase tracking-wide">
            {docInfo.title} • {docInfo.degree}
          </span>
          <span className="py-0.5 px-2.5 border border-gray-200 text-xs font-semibold text-gray-500 rounded-full bg-gray-50">
            {docInfo.experience} Experience
          </span>
        </div>

        <div className="mt-6 border-t pt-5">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5 uppercase tracking-wider mb-2">
            About Doctor <img className="w-4 h-4" src={assets.info_icon} alt="Info" />
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed font-light">{docInfo.about}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 border-t pt-5 text-sm text-gray-600">
          <div>
            <p className="font-bold text-gray-700">Speciality</p>
            <p className="font-light mt-0.5">{docInfo.speciality}</p>
          </div>
          <div>
            <p className="font-bold text-gray-700">Consultation Fees</p>
            <p className="font-semibold text-primary mt-0.5 text-base">{currencySymbol}{docInfo.fees}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="font-bold text-gray-700">Clinic Address</p>
            <p className="font-light mt-0.5 leading-relaxed">{docInfo.address.line1}, {docInfo.address.line2}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorInfoCard
