import { CalendarIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function DatePick({ onDateChange }) {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [isOpen, setIsOpen] = useState(false);
  const [openToDate, setOpenToDate] = useState(new Date());

  useEffect(() => {
    if (startDate) setOpenToDate(startDate);
  }, [startDate]);

  const formatDateOnly = () => {
    if (!startDate || !endDate) return '';
    const format = (d) =>
      d.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    return `${format(startDate)} - ${format(endDate)}`;
  };

  const formatDateWithTime = () => {
    if (!startDate || !endDate) return '';
    const format = (d) =>
      `${d.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'numeric',
      })} ${d.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })}`;
    return `${format(startDate)} - ${format(endDate)}`;
  };

  const handleCancel = () => {
    setDateRange([null, null]);
    setIsOpen(false);
  };

  const handleApply = () => {
    if (startDate && endDate && onDateChange) {
      onDateChange(startDate, endDate);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative w-fit">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center border rounded-lg px-3 py-2 bg-[#FCFCFC] cursor-pointer"
      >
        <CalendarIcon className="h-[16px] w-[16px] text-gray-500 border border-gray-300 rounded-lg" />
        <span className="ml-2 text-sm text-gray-700">
          {startDate && endDate ? formatDateOnly() : 'Select Date Range'}
        </span>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 -ml-[500px] shadow-lg rounded-xl bg-white p-0">
          <DatePicker
            selected={startDate}
            onChange={(update) => setDateRange(update)}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            monthsShown={2}
            inline
            openToDate={openToDate}
            highlightDates={startDate ? [startDate] : []}
            calendarClassName="!border-none !shadow-none  custom-datepicker"
            dayClassName={(date) =>
              startDate && endDate && date >= startDate && date <= endDate
                ? 'bg-blue-100 text-blue-800 rounded-md'
                : undefined
            }
          />

          <div className="flex flex-col border-t border-gray-100 bg-white p-4">
            <div className="flex items-center justify-end gap-4">
              {startDate && endDate && (
                <span className="text-sm text-gray-600 font-medium text-center">
                  {formatDateWithTime()}
                </span>
              )}
              <button
                onClick={handleCancel}
                className="text-sm px-4 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="text-sm px-4 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DatePick;
