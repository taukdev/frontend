import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { ReactComponent as Eye } from "../Assets/Eye.svg";
import { ReactComponent as CalendarIcon } from "../Assets/calendar.svg";
import { ReactComponent as Search } from "../Assets/Search.svg";
import { ReactComponent as UpDown } from "../Assets/UpDown.svg";
import { ReactComponent as BackArrow } from "../Assets/BackArrow.svg";
import { ReactComponent as Cross } from "../Assets/cross.svg";
import { ReactComponent as BlackLeft } from "../Assets/black-left.svg";
import { ReactComponent as BlackRight } from "../Assets/black-right.svg";
import DatePick from "./DatePick";

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
    <div className="xl:px-[40px] xl:py-[20px] p-5 bg-gray-100 h-screen">
      <div className="flex justify-between items-center">
        <div className="flex items-start gap-3">
          {/* Back Arrow Button */}
          <button className="text-[#071437] text-[20px] font-semibold leading-none ">
            &larr;
          </button>

          {/* Heading and Subheading */}
          <div>
            <h2 className="text-[#071437] text-[18px] font-semibold leading-[24px]">
              Callable Lead ID
            </h2>
            <p className="text-[#7E8299] text-[14px] font-normal leading-[20px]">
              Central Hub for Personal Customization
            </p>
          </div>
        </div>


        <div >
          {/* <CalendarIcon className="h-[16px] w-[16px] text-gray-500" />
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MMMM, yyyy"
            showMonthYearPicker
            className=" md:block focus:outline-none w-40 bg-[#F5F5F5] text-[#252F4A] font-normal text-[12px] leading-[12px]"
          /> */}
          <DatePick />
        </div>
      </div>
      <div className="bg-white flex items-center justify-center rounded-2xl mt-5">
        <div className=" w-full border border-[#F1F1F4] overflow-x-auto">
          <div className="flex justify-between items-center p-[20px] border-[#F1F1F4] border-b">
            <div className="relative lg:w-72 md:w-56 w-full">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search leads"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded pl-7 pr-3 py-2 w-full text-[11px] leading-[12px] font-normal focus:outline-none text-black "
              />
            </div>
            <div className=" md:block hidden relative">
              {/* <CalendarIcon
                className="h-[16px] w-[16px] text-gray-500 cursor-pointer mr-[9px]"
                onClick={handleIconClick}
              />
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="MMMM, yyyy"
                showMonthYearPicker
                className="hidden md:block w-40 focus:outline-none bg-[#FCFCFC] text-[#252F4A] font-normal text-[12px] leading-[12px]"
              /> */}
              <DatePick />
            </div>
          </div>

          <table className="w-full border-separate border-[#F1F1F4] border-spacing-0  mb-2">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-center border border-[#F1F1F4] bg-[#FCFCFC]">
                  <input
                    type="checkbox"
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
                  ? "bg-[#F5F5F5] border-[#F1F1F4] border"
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
                    <td className={`px-[20px] font-medium text-[14px] leading-[14px] text-[#071437] text-left ${cellStyle}`}>
                      {row.id}
                    </td>
                    <td className={`px-[20px] font-medium text-[14px] leading-[14px] text-[#071437] text-left ${cellStyle}`}>
                      {row.firstName}
                    </td>
                    <td className={`px-[20px] font-medium text-[14px] leading-[14px] text-[#071437] text-left ${cellStyle}`}>
                      {row.lastName}
                    </td>
                    <td className={`px-[20px] font-medium text-[14px] leading-[14px] text-[#071437] text-left ${cellStyle}`}>
                      {row.created}
                    </td>
                    <td className={`px-[20px] font-medium text-[14px] leading-[14px] text-[#071437] text-left ${cellStyle}`}>
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

          <div className=" flex justify-between items-center py-4 px-6">
            <div className="flex items-center gap-2">
              <label className="text-[13px] leading-[14px] font-normal text-[#4B5675]">
                Show
              </label>
              <div className="relative border border-[#F1F1F4] rounded-[6px]">
                <select
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(+e.target.value);
                    setPage(1);
                  }}
                  className="appearance-none border-none bg-transparent pr-6 pl-2 py-1 text-[15px] font-medium text-[#252F4A] focus:ring-0 focus:outline-none"
                  style={{ minWidth: "40px" }}
                >
                  {[2, 3, 4, 5, 10, 25, 50].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2">
                  {/* Down arrow SVG */}
                  <svg width="16" height="16" fill="none" viewBox="0 0 20 20">
                    <path d="M6 8l4 4 4-4" stroke="#4B5675" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
              <span className="text-[13px] leading-[14px] font-normal text-[#4B5675]">
                per page
              </span>
            </div>
            <div className="hidden md:flex items-center">
              <span className="text-[#4B5675] text-[13px] mr-1 leading-[14px] font-normal">
                1-10 of 52
              </span>
              <BlackLeft
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="w-5 h-5 hover:text-[black] disabled:text-gray-300 cursor-pointer"
                disabled={page === 1}
              />
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
                      className={`px-[12px] py-[8px] rounded-[6px] text-[#4B5675] font-normal text-[14px] leading-[14px] ${page === pageNum
                        ? "bg-[#F1F1F4] rounded-[6px] text-[#252F4A] px-[12px] py-[8px] font-semibold flex justify-center items-center"
                        : "text-[#4B5675] hover:bg-[#F1F1F4] font-normal"
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                });
              })()}

              <BlackRight
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="w-5 h-5 text-[13px] text-[#4B5675] hover:text-[#4B5675] disabled:text-gray-300 cursor-pointer"
                disabled={page === totalPages}
              />
            </div>
          </div>

        </div>
      </div>

      {isModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-[26px] w-[646px] max-w-md overflow-hidden px-[22px] pt-[28px] pb-[40px]">
            <div className="bg-[linear-gradient(121.72deg,_rgba(0,174,239,0.06)_0%,_rgba(0,127,196,0.06)_100%)] flex justify-between items-center p-[20px] rounded-[12px]">
              <h2 className="text-[18px] leading-[20px] font-medium text-[#071437]">
                Callable Lead ID ({selectedLead.id})
              </h2>
              <Cross onClick={() => setIsModalOpen(false)} className="cursor-pointer" />
            </div>
            <div className="divide-y divide-gray-200 px-[20px]">
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
                <div key={label} className="flex align-center py-[15px]">
                  <div className="w-1/3 text-gray-500 pr-4">{label}</div>
                  <div className="w-2/3 border-gray-200 pl-4 overflow-x-auto max-w-full whitespace-nowrap">
                    {label === "Offer_url" ? (
                      <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#252F4A] underline block"
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
