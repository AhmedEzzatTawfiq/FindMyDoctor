import React from 'react'

const BookingPanel = ({
  docSlots,
  slotIndex,
  setSlotIndex,
  slotTime,
  setSlotTime,
  bookAppointment,
  bookingLoading,
  daysOfWeek,
  months,
}) => {
  return (
    <div className="w-full lg:w-96 shrink-0 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 lg:sticky lg:top-5">
      <div className="border-b pb-4 mb-4">
        <h3 className="font-bold text-gray-800 text-lg uppercase tracking-wide">Select Booking Date</h3>
        <p className="text-xs text-gray-400 mt-1 font-light">Available timeslots for next 7 days</p>
      </div>

      <div className="flex gap-2.5 overflow-x-scroll no-scrollbar py-2">
        {docSlots.length > 0 && docSlots.map((item, index) => {
          const dayObj = item[0]?.datetime
          const weekday = dayObj ? daysOfWeek[dayObj.getDay()] : ''
          const dayNum = dayObj ? dayObj.getDate() : ''
          const monthName = dayObj ? months[dayObj.getMonth()] : ''

          return (
            <div
              key={index}
              onClick={() => { setSlotIndex(index); setSlotTime('') }}
              className={`text-center p-3.5 min-w-16 rounded-2xl cursor-pointer border transition-all flex flex-col items-center justify-center ${slotIndex === index ? 'bg-primary border-primary text-white shadow-md hover:scale-100' : 'bg-gray-50 hover:bg-gray-100 border-gray-100 text-gray-600 hover:scale-102'}`}
            >
              <p className="text-[10px] font-bold uppercase">{index === 0 ? 'Today' : weekday}</p>
              <p className="text-base font-black my-0.5">{dayNum}</p>
              <p className="text-[9px] font-medium">{monthName}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-6">
        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Available Slots</h4>

        {docSlots.length > 0 && docSlots[slotIndex].length === 0 ? (
          <div className="text-center py-10 border border-dashed rounded-2xl text-xs text-gray-400 font-medium">
            No slots available on this day.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
            {docSlots.length > 0 && docSlots[slotIndex].map((item, index) => (
              <button
                key={index}
                onClick={() => setSlotTime(item.time)}
                className={`py-2 px-1 rounded-xl text-xs font-semibold border transition-all ${item.time === slotTime ? 'bg-primary border-primary text-white shadow-sm hover:scale-100' : 'bg-white hover:bg-gray-100 border-gray-200/70 text-gray-600 hover:scale-102'}`}
              >
                {item.time.toLowerCase()}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 pt-4 border-t">
        {slotTime && (
          <div className="flex justify-between items-center text-xs mb-3 text-gray-500">
            <span>Selected Time:</span>
            <span className="font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded">
              {docSlots[slotIndex][0] && daysOfWeek[docSlots[slotIndex][0].datetime.getDay()]} {docSlots[slotIndex][0] && docSlots[slotIndex][0].datetime.getDate()} @ {slotTime.toLowerCase()}
            </span>
          </div>
        )}
        <button
          onClick={bookAppointment}
          disabled={bookingLoading || !slotTime}
          className="w-full bg-primary hover:bg-indigo-700 text-white font-bold text-sm py-3.5 rounded-2xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {bookingLoading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {bookingLoading ? 'Booking Appointment...' : 'Confirm Appointment'}
        </button>
      </div>
    </div>
  )
}

export default BookingPanel
