import React from 'react'
import { assets } from '../assets/assets'
import { DollarSign, Clock, MapPin } from 'lucide-react'

const DoctorCard = ({
  item,
  slotsData,
  cardSelection,
  bookingLoading,
  selectSlot,
  bookQuickAppointment,
  navigate,
  currencySymbol,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow duration-300 group">

      {/* Doctor info */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col sm:flex-row gap-5">

        <div className="w-full sm:w-32 shrink-0 flex flex-col items-center gap-2">
          <div className="w-28 h-28 rounded-2xl overflow-hidden bg-indigo-50 border border-gray-100 shadow-inner">
            <img
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              src={item.image}
              alt={item.name}
            />
          </div>
          {item.available ? (
            <div className="flex items-center gap-1.5 text-xs text-green-600 font-semibold bg-green-50 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
              <span>Available</span>
            </div>
          ) : (
            <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-0.5 rounded-full">Unavailable</span>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <h2
                onClick={() => navigate(`/appointment/${item._id}`)}
                className="text-lg font-bold text-gray-900 hover:text-primary cursor-pointer transition-colors"
              >
                {item.name}
              </h2>
              <img className="w-4 h-4" src={assets.verified_icon} alt="Verified" />
            </div>

            <p className="text-xs font-semibold text-primary mt-0.5 uppercase tracking-wider">
              {item.title} • {item.degree}
            </p>

            <p className="text-xs text-gray-500 font-medium mt-1">
              Speciality: <span className="text-gray-700 font-semibold">{item.speciality}</span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mt-4 text-xs text-gray-600 border-t pt-4">
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span>Fees: <span className="font-semibold text-gray-800">{currencySymbol}{item.fees}</span></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>Waiting time: <span className="font-semibold text-gray-800">15 mins</span></span>
              </div>
              <div className="flex items-center gap-1.5 sm:col-span-2">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="truncate">{item.address.line1}, {item.address.line2}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate(`/appointment/${item._id}`)}
            className="text-xs text-primary hover:text-indigo-700 font-bold flex items-center gap-1 mt-4 group/btn w-fit"
          >
            View Doctor Profile
            <span className="transition-transform group-hover/btn:translate-x-1">→</span>
          </button>
        </div>
      </div>

      {/* Right side */}
      <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-gray-100 bg-gray-50/50 p-5 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center justify-between border-b pb-2 mb-3">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Book Appointment</span>
            <span className="text-[10px] text-gray-400 font-medium">Quick reserve</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {slotsData.map((dayData, dayIdx) => (
              <div key={dayIdx} className="flex flex-col gap-1.5 text-center">
                <div className="bg-indigo-50/70 border border-indigo-100/50 rounded-lg py-1">
                  <p className="text-[10px] font-bold text-indigo-700 uppercase">{dayData.dateLabel}</p>
                  <p className="text-xs font-black text-indigo-900">{dayData.dateNum}</p>
                </div>

                <div className="flex flex-col gap-1">
                  {dayData.slots.length === 0 ? (
                    <div className="text-[9px] text-gray-400 py-3 font-medium">Fully booked</div>
                  ) : (
                    dayData.slots.map((slot, sIdx) => {
                      const isSelected = cardSelection &&
                        cardSelection.slotDate === slot.slotDate &&
                        cardSelection.slotTime === slot.slotTime

                      return (
                        <button
                          key={sIdx}
                          onClick={() => selectSlot(item._id, slot.slotDate, slot.slotTime, dayIdx)}
                          className={`py-1.5 px-1 rounded-md text-[10px] font-semibold border transition-all ${isSelected ? 'bg-primary border-primary text-white shadow-sm' : 'bg-white hover:bg-gray-100 border-gray-200/70 text-gray-600'}`}
                        >
                          {slot.time.toLowerCase()}
                        </button>
                      )
                    })
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100">
          {cardSelection ? (
            <button
              disabled={bookingLoading[item._id]}
              onClick={() => bookQuickAppointment(item._id)}
              className="w-full bg-primary text-white font-bold text-xs py-2.5 rounded-xl shadow hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {bookingLoading[item._id] && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              Book for {cardSelection.slotTime.toLowerCase()}
            </button>
          ) : (
            <div className="text-[10px] text-gray-400 text-center font-medium italic py-2">
              Select a time slot above to book instantly
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

export default DoctorCard
