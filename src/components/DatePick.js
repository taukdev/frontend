// import { CalendarIcon } from 'lucide-react';
// import React, { useEffect, useState } from 'react'
// import DatePicker from "react-datepicker";


// function DatePick() {
//   const [dateRange, setDateRange] = useState([null, null]);
//   const [startDate, endDate] = dateRange;
//   const [isOpen, setIsOpen] = useState(false);
//   const [openToDate, setOpenToDate] = useState(new Date());

//   useEffect(() => {
//     if (startDate) {
//       setOpenToDate(startDate);
//     }

//   }, [startDate]);
//   const handleApply = () => {
//     setIsOpen(false);
//   }
//   const handleCancel = () => {
//     setDateRange([null, null]);
//     setIsOpen(false);
//   };


//   const formatRange = () => {
//     if (!startDate || !endDate) return "";
//     const format = (d) =>
//       `${d.toLocaleDateString(undefined, {
//         month: "numeric",
//         day: "numeric",
//       })} ${d.toLocaleTimeString(undefined, {
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: true,
//       })}`;
//     return `${format(startDate)} - ${format(endDate)}`;
//   };


//   const handleIconClick = () => {
//     setIsOpen(!isOpen);
//   };
//   const handleDatePickerChange = (update) => {
//     setDateRange(update);
//     // Close the date picker after selecting both dates in a range
//     if (update[0] && update[1]) {
//       setIsOpen(false);
//     }
//   };
//   return (
//     <div className="flex items-center border rounded-lg px-3 py-2 bg-[#FCFCFC]">
//       <CalendarIcon
//         className="h-[16px] w-[16px] text-gray-500 cursor-pointer border border-gray-300 rounded-lg"
//         onClick={handleIconClick}
//       />

//       <DatePicker
//         selected={startDate}
//         onChange={(update) => setDateRange(update)}
//         startDate={startDate}
//         endDate={endDate}
//         selectsRange
//         openToDate={openToDate}
//         monthsShown={2}
//         popperPlacement="bottom-start"
//         dateFormat="MMM dd, yyyy"
//         open={isOpen}
//         onInputClick={handleIconClick}
//         className="hidden md:block w-40 focus:outline-none bg-[#FCFCFC] text-[#252F4A] font-normal text-[12px] leading-[12px]"

//       />
//     </div>

//     // <div className="relative w-fit">
//     //   <button
//     //     onClick={() => setIsOpen(!isOpen)}
//     //     className="flex items-center border rounded-lg px-3 py-2 bg-[#FCFCFC] text-sm"
//     //   >
//     //     📅 {startDate && endDate ? formatRange() : "Select Date Range"}
//     //   </button>

//     //   {isOpen && (
//     //     <div className="absolute z-50 mt-2 shadow-lg border border-gray-200 rounded-xl bg-white p-4">
//     //       <DatePicker
//     //         selected={startDate}
//     //         onChange={(update) => setDateRange(update)}
//     //         startDate={startDate}
//     //         endDate={endDate}
//     //         selectsRange
//     //         monthsShown={2}
//     //         inline
//     //         openToDate={openToDate}
//     //         calendarClassName="!rounded-xl md:flex md:flex-row gap-4"
//     //         dayClassName={(date) =>
//     //           startDate && endDate && date >= startDate && date <= endDate
//     //             ? "bg-blue-100 text-blue-800"
//     //             : undefined
//     //         }
//     //       />


//     //       <div className="flex justify-between items-center mt-3 px-1">
//     //         <span className="text-xs text-gray-700 font-medium">
//     //           {formatRange()}
//     //         </span>
//     //         <div className="flex gap-2">
//     //           <button
//     //             onClick={handleCancel}
//     //             className="text-sm px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100"
//     //           >
//     //             Cancel
//     //           </button>
//     //           <button
//     //             onClick={handleApply}
//     //             className="text-sm px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//     //           >
//     //             Apply
//     //           </button>
//     //         </div>
//     //       </div>
//     //     </div>
//     //   )}
//     // </div> 
//   )
// }

// export default DatePick

// import { CalendarIcon } from 'lucide-react';
// import React, { useEffect, useState } from 'react';
// import DatePicker from 'react-datepicker';
// // import 'react-datepicker/dist/react-datepicker.css';

// function DatePick() {
//   const [dateRange, setDateRange] = useState([null, null]);
//   const [startDate, endDate] = dateRange;
//   const [isOpen, setIsOpen] = useState(false);
//   const [openToDate, setOpenToDate] = useState(new Date());

//   useEffect(() => {
//     if (startDate) setOpenToDate(startDate);
//   }, [startDate]);

//   // Format: 3/15 08:00 PM - 4/18 04:00 AM
//   const formatRange = () => {
//     if (!startDate || !endDate) return '';
//     const format = (d) =>
//       `${d.getMonth() + 1}/${d.getDate()} ${d.toLocaleTimeString(undefined, {
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: true,
//       })}`;
//     return `${format(startDate)} - ${format(endDate)}`;
//   };

//   const handleCancel = () => {
//     setDateRange([null, null]);
//     setIsOpen(false);
//   };

//   const handleApply = () => {
//     setIsOpen(false);
//   };

//   return (
//     <div className="relative">
//       <div
//         onClick={() => setIsOpen(!isOpen)}
//         className="flex items-center border rounded-lg px-3 py-2 bg-[#FCFCFC] cursor-pointer"
//       >
//         <CalendarIcon className="h-[16px] w-[16px] text-gray-500 border border-gray-300 rounded-lg" />
//         <span className="ml-2 text-sm text-gray-700">
//           {startDate && endDate ? formatRange() : 'Select Date Range'}
//         </span>
//       </div>

//       {isOpen && (
//         <div className="absolute z-50 mt-2 -ml-96 shadow-lg  rounded-xl bg-white p-0 ">
//           <DatePicker
//             selected={startDate}
//             onChange={(update) => setDateRange(update)}
//             startDate={startDate}
//             endDate={endDate}
//             selectsRange
//             monthsShown={2}
//             inline
//             openToDate={startDate || new Date()}
//             highlightDates={startDate ? [startDate] : []}
//             calendarClassName="!border-none !shadow-none"
//             dayClassName={(date) =>
//               startDate && endDate && date >= startDate && date <= endDate
//                 ? 'bg-blue-100 text-blue-800 rounded-md'
//                 : undefined
//             }
//           />

//           {/* Footer */}
//           <div className="flex flex-col border-t border-gray-100 bg-white p-4">
//             <span className="text-[15px] text-gray-700 font-medium mb-3 text-center">
//               {formatRange()}
//             </span>
//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={handleCancel}
//                 className="text-[15px] px-4 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleApply}
//                 className="text-[15px] px-4 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//               >
//                 Apply
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default DatePick;



// import { CalendarIcon } from 'lucide-react';
// import React, { useEffect, useState } from 'react';
// import DatePicker from 'react-datepicker';
// // import 'react-datepicker/dist/react-datepicker.css';

// function DatePick() {
//   const [dateRange, setDateRange] = useState([null, null]);
//   const [startDate, endDate] = dateRange;
//   const [isOpen, setIsOpen] = useState(false);
//   const [openToDate, setOpenToDate] = useState(new Date());

//   useEffect(() => {
//     if (startDate) setOpenToDate(startDate);
//   }, [startDate]);

//   // Format: 3/15 08:00 PM - 4/18 04:00 AM
//   const formatDateOnly = () => {
//     if (!startDate || !endDate) return '';
//     const format = (d) =>
//       d.toLocaleDateString(undefined, {
//         day: 'numeric',
//         month: 'long',
//         year: 'numeric',
//       });
//     return `${format(startDate)} - ${format(endDate)}`;
//   };

//   const formatDateWithTime = () => {
//     if (!startDate || !endDate) return '';
//     const format = (d) =>
//       `${d.toLocaleDateString(undefined, {
//         day: 'numeric',
//         month: 'numeric',
//         // year: 'numeric',
//       })} ${d.toLocaleTimeString(undefined, {
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: true,
//       })}`;
//     return `${format(startDate)} - ${format(endDate)}`;
//   };

//   const handleCancel = () => {
//     setDateRange([null, null]);
//     setIsOpen(false);
//   };

//   const handleApply = () => {
//     setIsOpen(false);
//   };

//   return (
//     <div className="relative">
//       <div
//         onClick={() => setIsOpen(!isOpen)}
//         className="flex items-center border rounded-lg px-3 py-2 bg-[#FCFCFC] cursor-pointer"
//       >
//         <CalendarIcon className="h-[16px] w-[16px] text-gray-500 border border-gray-300 rounded-lg" />
//         <span className="ml-2 text-sm text-gray-700">
//           {startDate && endDate ? formatDateOnly() : 'Select Date Range'}
//         </span>
//       </div>

//       {isOpen && (
//         <div className="absolute z-50 mt-2 -ml-96 shadow-lg rounded-xl bg-white p-0">
//           <DatePicker
//             selected={startDate}
//             onChange={(update) => setDateRange(update)}
//             startDate={startDate}
//             endDate={endDate}
//             selectsRange
//             monthsShown={2}
//             inline
//             openToDate={startDate || new Date()}
//             highlightDates={startDate ? [startDate] : []}
//             calendarClassName="!border-none !shadow-none custom-datepicker"
//             dayClassName={(date) =>
//               startDate && endDate && date >= startDate && date <= endDate
//                 ? 'bg-blue-100 text-blue-800 rounded-md  flex gap-20'
//                 : undefined
//             }
//           />

//           {/* Footer only when both dates are selected */}

//           <div className="flex w-full flex-col border-t-2 border-gray-100 bg-white p-4">

//             <div className="flex items-center justify-end gap-4">

//               {startDate && endDate && (
//                 <span className="text-[14px] text-gray-600 font-medium text-center">
//                   {formatDateWithTime()}
//                 </span>
//               )}
//               <button
//                 onClick={handleCancel}
//                 className="text-[15px] px-4 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleApply}
//                 className="text-[15px] px-4 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//               >
//                 Apply
//               </button>
//             </div>
//           </div>


//         </div>
//       )}
//     </div>
//   );
// }

// export default DatePick;


import { CalendarIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Make sure this line is active in your project

function DatePick() {
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
