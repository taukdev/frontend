import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { ReactComponent as Eye } from "../Assets/Eye.svg";
import { ReactComponent as CalendarIcon } from "../Assets/calendar.svg";
import { ReactComponent as Search } from "../Assets/Search.svg";
import { ReactComponent as UpDown } from "../Assets/UpDown.svg";
import { GoArrowLeft } from "react-icons/go";

const LeadsTable = () => {
  const allLeads = Array.from({ length: 51 }, (_, i) => ({
    id: `S-${String(i + 1).padStart(3, "0")}`,
    firstName: `First${i + 1}`,
    lastName: `Last${i + 1}`,
    created: `2025-05-${String((i % 30) + 1).padStart(2, "0")}`,
    Product: `Premium Package`,
    Amount: `$2,450.00`,
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
    <div className="p-6 bg-gray-100 h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-start gap-2">
          {/* Left arrow only on small screens */}
          <button className="md:hidden text-gray-600 hover:text-black text-lg mt-1">
            {/* Replace this with your actual SVG icon if needed */}
            &larr;
          </button>

          {/* Heading and subheading stacked vertically */}
          <div className="flex flex-row gap-3">
            <GoArrowLeft className="mt-2" />
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-gray-900">Total Sales</h2>

              <p className="text-sm text-gray-500">
                Central Hub for Personal Customization
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center border rounded-lg px-3 py-2 md:gap-2">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MMMM, yyyy"
            showMonthYearPicker
            className="hidden md:block w-40 focus:outline-none"
          />
        </div>
      </div>

      <div className=" flex items-center justify-center  mt-4">
        <div className="bg-white w-full rounded-xl shadow-md overflow-x-auto">
          <div className="flex justify-between items-center m-4 mb-6">
            <div className="relative w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded pl-10 pr-3 py-2 w-full text-sm focus:outline-none"
              />
            </div>

            <div className="flex items-center border rounded-lg px-3 py-2">
              <CalendarIcon className="h-5 w-5 text-gray-500" />
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="MMMM, yyyy"
                showMonthYearPicker
                className="w-40 focus:outline-none"
              />
            </div>
          </div>

          <table className="w-full border-separate border-spacing-0">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-center border border-white-500">
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
                {["Order ID", "First Name", "Last Name", "Date", "Action"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-center font-medium text-gray-700 border border-white-500"
                    >
                      <div className="flex items-center justify-center gap-1">
                        {h}
                        {<UpDown className="h-4 w-4 text-gray-500" />}
                      </div>
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedLeads.map((row, i) => {
                const isSelected = selectedLeads.includes(row.id);
                const cellStyle = isSelected
                  ? "bg-[#F9FAFB]"
                  : "bg-white border border-gray-300";

                return (
                  <tr key={row.id}>
                    <td className={`p-3 text-black text-center ${cellStyle}`}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(row.id)}
                      />
                    </td>
                    <td className={`p-3 text-black text-center ${cellStyle}`}>
                      {row.id}
                    </td>
                    <td className={`p-3 text-black text-center ${cellStyle}`}>
                      {row.firstName}
                    </td>
                    <td className={`p-3 text-black text-center ${cellStyle}`}>
                      {row.lastName}
                    </td>
                    <td className={`p-3 text-black text-center ${cellStyle}`}>
                      {row.created}
                    </td>
                    <td className={`p-3 text-black text-center ${cellStyle}`}>
                      <button
                        onClick={() => {
                          setSelectedLead(row);
                          setIsModalOpen(true);
                        }}
                      >
                        <Eye className="h-6 w-6 text-blue-600 hover:text-blue-800 p-1 bg-[#32ADE60F] rounded-full" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md overflow-hidden p-4">
            <div className="bg-blue-50 flex justify-between items-center px-4 py-2 rounded-[10px]">
              <h2 className="text-lg font-semibold text-black">
                Total Sales ({selectedLead.id})
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <div className="divide-y divide-gray-200 px-6 py-4 text-sm text-gray-700 space-y-3">
              {[
                ["Sale Id", selectedLead.id],
                ["First Name", selectedLead.firstName],
                ["Last Name", selectedLead.lastName],
                ["Product", selectedLead.Product],
                ["Amount", selectedLead.Amount],
              ].map(([label, value]) => (
                <div key={label} className="flex">
                  <div className="w-1/3 text-gray-500 pr-4">{label}</div>
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
