import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { ReactComponent as Eye } from "../Assets/Eye.svg";
import { ReactComponent as CalendarIcon } from "../Assets/calendar.svg";
import { ReactComponent as Search } from "../Assets/Search.svg";
import { ReactComponent as UpDown } from "../Assets/UpDown.svg";

const LeadsTable = () => {
  const allLeads = Array.from({ length: 51 }, (_, i) => ({
    id: `L-${String(i + 1).padStart(3, "0")}`,
    firstName: `First${i + 1}`,
    lastName: `Last${i + 1}`,
    created: `2025-05-${String((i % 30) + 1).padStart(2, "0")}`,
    phoneNumber: `(555) 123-45${String(i + 1).padStart(2, "0")}`,
    email: `User${i + 1}@Email.com`,
    country: "USA",
    offerUrl: `http://example.com/Offer/${i + 1}`,
  }));

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [perPage, setPerPage] = useState(2);
  const [page, setPage] = useState(1);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleIconClick = () => {
    setIsOpen(!isOpen);
  };

  const filteredLeads = allLeads.filter((lead) => {
    const search = searchTerm.toLowerCase();
    return (
      lead.firstName.toLowerCase().includes(search) ||
      lead.lastName.toLowerCase().includes(search) ||
      lead.id.toLowerCase().includes(search)
    );
  });

  const total = filteredLeads.length;
  const totalPages = Math.ceil(total / perPage);
  const startIndex = (page - 1) * perPage;
  const endIndex = Math.min(startIndex + perPage, total);
  const paginatedLeads = filteredLeads.slice(startIndex, endIndex);

  const toggleSelect = (id) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((leadId) => leadId !== id) : [...prev, id]
    );
  };

  return (
    <div className="md:px-[40px] bg-gray-100 h-screen">
      <div className="flex justify-between items-center py-[20px]">
        <div className="flex items-start gap-2">
          {/* Left arrow only on small screens */}
          <button className="md:hidden text-gray-600 hover:text-black text-lg mt-1">
            {/* Replace this with your actual SVG icon if needed */}
            &larr;
          </button>

          {/* Heading and subheading stacked vertically */}
          <div>
            <h2 className="md:text-xl  text-[20px] leading-[20px] font-semibold text-[#071437] mb-[3px]">
              Lead ID
            </h2>
            <p className="text-[14px] leading-[14px] text-[#4B5675] font-normal">
              Central Hub for Personal Customization
            </p>
          </div>
        </div>

        <div className="flex items-center border border-[#DBDFE9] rounded-[6px] px-[10px] py-[8px]  md:gap-2">
          <CalendarIcon className="h-[16px] w-[16px] text-gray-500" />
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MMMM, yyyy"
            showMonthYearPicker
            className=" md:block focus:outline-none w-40 bg-[#F5F5F5] text-[#252F4A] font-normal text-[12px] leading-[12px]"
          />  
        </div>
      </div>

      <div className="bg-white flex items-center justify-center rounded-xl">
        <div className=" w-full rounded-[18px] border border-[#F1F1F4] overflow-x-auto">
          <div className="flex justify-between items-center p-[26px] border-[#F1F1F4] border-b">
            <div className="relative w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded pl-10 pr-3 py-2 w-full text-[11px] leading-[12px] font-normal focus:outline-none text-[#FCFCFC] "
              />
            </div>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-[#FCFCFC]">
              <CalendarIcon
                className="h-[16px] w-[16px] text-gray-500 cursor-pointer mr-[9px]"
                onClick={handleIconClick}
              />
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="MMMM, yyyy"
                showMonthYearPicker
                className="hidden md:block w-40 focus:outline-none bg-[#FCFCFC] text-[#252F4A] font-normal text-[12px] leading-[12px]"
              />
            </div>
          </div>

          <table className="w-full border-separate border-[#F1F1F4] border-spacing-0">
            <thead className="bg-gray-100">   
              <tr>
                <th className="px-4 py-3 text-center border border-[#F1F1F4] bg-[#FCFCFC] ">
                  <input
                    type="checkbox"
                    disabled={false}
                    checked={paginatedLeads.every((lead) =>
                      selectedLeads.includes(lead.id)
                      
                    )}
                    onChange={(e) => {
                      const ids = paginatedLeads.map((lead) => lead.id);
                      setSelectedLeads((prev) =>
                        e.target.checked
                          ? [...new Set([...prev, ...ids])]
                          : prev.filter((id) => !ids.includes(id))
                      );
                    }}
                  />
                </th>
                {[
                  "Lead ID",
                  "First Name",
                  "Last Name",
                  "Created",
                  "Action",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-[20px] text-left bg-[#FCFCFC] font-normal text-[#4B5675] border border-[#F1F1F4] text-[13px] leading-[14px]"
                  >
                    <div className="flex items-center gap-1">
                      {h}
                      {<UpDown className="h-[14px] w-[14px]" />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedLeads.map((row, i) => {
                const isSelected = selectedLeads.includes(row.id);
                const cellStyle = isSelected
                  ? "bg-[#F5F5F5] border-[#F1F1F4]"
                  : "bg-white border border-[#F1F1F4]";

                return (
                  <tr key={row.id}>
                    <td className={`p-3 text-black text-center ${cellStyle}`}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(row.id)}
                      />
                    </td>
                    <td className={`px-[20px] font-medium text-[14px] leading-[14px]  text-[#071437] text-left ${cellStyle}`}>
                      {row.id}
                    </td>
                    <td className={`px-[20px] font-medium text-[14px] leading-[14px]  text-[#071437] text-left ${cellStyle}`}>
                      {row.firstName}
                    </td>
                    <td className={`px-[20px] font-medium text-[14px] leading-[14px]  text-[#071437] text-left ${cellStyle}`}>
                      {row.lastName}
                    </td>
                    <td className={`px-[20px] font-medium text-[14px] leading-[14px]  text-[#071437] text-left ${cellStyle}`}>
                      {row.created}
                    </td>
                    <td className={`px-[20px] font-medium text-[14px] leading-[14px]  text-[#071437] text-left ${cellStyle}`}>
                      <button
                        onClick={() => {
                          setSelectedLead(row);
                          setIsModalOpen(true);
                        }}
                      >
                        <Eye className="h-[30px] w-[30px]" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="mt-4 flex justify-between items-center m-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Show</label>
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(+e.target.value);
                  setPage(1);
                }}
                className="border rounded px-2 py-1 text-sm"
              >
                {[2, 3, 4, 5, 10, 25, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-600">per page</span>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1 text-gray-700 hover:text-black disabled:text-gray-300"
                disabled={page === 1}
              >
                &larr;
              </button>
              {(() => {
                const maxVisible = 5;
                let start = Math.max(1, page - Math.floor(maxVisible / 2));
                let end = start + maxVisible - 1;

                if (end > totalPages) {
                  end = totalPages;
                  start = Math.max(1, end - maxVisible + 1);
                }

                return Array.from({ length: end - start + 1 }, (_, idx) => {
                  const pageNum = start + idx;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-2 py-1 rounded text-sm ${
                        page === pageNum
                          ? "bg-gray-200 text-black font-semibold w-[25px] h-[25px] flex justify-center items-center"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                });
              })()}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-1 text-gray-700 hover:text-black disabled:text-gray-300"
                disabled={page === totalPages}
              >
                &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071437] bg-opacity-50 ">
          <div className="bg-white rounded-[26px] w-[646px] max-w-md overflow-hidden px-[22px] pt-[28px] pb-[40px]">
            <div className="bg-[linear-gradient(121.72deg,_rgba(0,174,239,0.06)_0%,_rgba(0,127,196,0.06)_100%)] flex justify-between items-center p-[20px] rounded-[12px]">
              <h2 className="text-[18px] leading-[20px] font-medium text-[#071437]">
                Lead ID ({selectedLead.id})
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.8995 4.56747C18.3229 4.14422 19.0094 4.14414 19.4327 4.56747C19.856 4.9908 19.8559 5.67729 19.4327 6.10067L13.5333 12.0001L19.4327 17.8995C19.8559 18.3229 19.856 19.0094 19.4327 19.4327C19.0094 19.856 18.3229 19.8559 17.8995 19.4327L12.0001 13.5333L6.10067 19.4327C5.67729 19.8559 4.9908 19.856 4.56747 19.4327C4.14414 19.0094 4.14422 18.3229 4.56747 17.8995L10.4669 12.0001L4.56747 6.10067C4.14422 5.67729 4.14414 4.9908 4.56747 4.56747C4.9908 4.14414 5.67729 4.14422 6.10067 4.56747L12.0001 10.4669L17.8995 4.56747Z" fill="#071437"/>
              </svg>
              </button>
            </div>
            <div className="divide-y divide-gray-200 px-[20px] space-y-3">
              {[
                ["Id", selectedLead.id],
                ["First Name", selectedLead.firstName],
                ["Last Name", selectedLead.lastName],
                ["Phone Number", selectedLead.phoneNumber],
                ["Email Address", selectedLead.email],
                ["Created", selectedLead.created],
                ["Country", selectedLead.country],
                ["Offer_url", selectedLead.offerUrl],
              ].map(([label, value]) => (
                <div key={label} className="flex align-center py-[10px]">
                  <div className="w-1/3 text-[#252F4A] text-[14px] leading-[14px] font-meduim">{label}</div>
                  <div className="w-2/3 border-gray-200 pl-4 overflow-x-auto max-w-full whitespace-nowrap">
                    {label === "Offer_url" ? (
                      <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline block"
                      >
                        {value}
                      </a>
                    ) : (
                      <div className="font-medium text-left">{value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsTable;
