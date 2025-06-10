import React, { useEffect, useState } from "react";
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

const SalesTable = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchSales = async () => {
    let url = `http://192.168.1.80:5000/api/sales/filtered-sales?page=${page}&limit=${perPage}`;
    if (searchTerm) url += `&search=${searchTerm}`;
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      url += `&date=${formattedDate}`;
    }

    try {
      const res = await fetch(url);
      const result = await res.json();
      setData(result?.sales || []);
      setTotalCount(result?.totalCount || 0);
      setTotalPages(Math.ceil(result?.totalCount / perPage));
    } catch (error) {
      console.error("Error fetching sales:", error);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [page, searchTerm, selectedDate, perPage]);

  return (
    <div className="px-[40px] py-[20px] bg-gray-100">
      {/* Filters */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-start gap-2">
          {/* Left arrow only on small screens */}
          <button className="md:hidden text-gray-600 hover:text-black text-lg mt-1">
            {/* Replace this with your actual SVG icon if needed */}
            &larr;
          </button>

          {/* Heading and subheading stacked vertically */}
          <div className="flex flex-row gap-3">
            <BackArrow className="w-[24px] h-[24px] mr-[5px]" />
            <div className="flex flex-col">
              <h2 className="text-[20px] leading-[20px] font-semibold text-[#071437] mb-[6px]">Total Sales</h2>

              <p className="text-[14px] leading-[14px] text-[#4B5675] font-normal">
                Central Hub for Personal Customization
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center border border-[#DBDFE9] rounded-[6px] px-[10px] py-[8px]  md:gap-2">
          <CalendarIcon className="h-[16px] w-[16px] text-gray-500" />
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MMMM, yyyy"
            showMonthYearPicker
            className="md:block focus:outline-none w-40 bg-[#F5F5F5] text-[#252F4A] font-normal text-[12px] leading-[12px]"
          />
        </div>
      </div>


      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl">
        <div className="flex justify-between items-center p-[20px] border-[#F1F1F4]">
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded pl-10 pr-3 py-2 w-full text-[11px] leading-[12px] font-normal focus:outline-none text-black"
            />

          </div>

          <div className="flex items-center border rounded-lg px-3 py-2 bg-[#FCFCFC]">
            <CalendarIcon className="h-[16px] w-[16px] text-gray-500 cursor-pointer mr-[9px]" />
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="MMMM, yyyy"
              showMonthYearPicker
              className="hidden md:block w-40 focus:outline-none bg-[#FCFCFC] text-[#252F4A] font-normal text-[12px] leading-[12px]"
            />
          </div>
        </div>
        <table className="w-full text-sm text-left border border-gray-200 rounded-xl">
          <thead>
            <tr className="bg-white border text-[#4B5675]">
              <th className="p-3 border font-normal"><input type="checkbox" /></th>
              <th className="p-3 border font-normal">order ID <UpDown className="inline w-4 h-4 ml-1" /></th>
              <th className="p-3 border font-normal">Frist Name <UpDown className="inline w-4 h-4 ml-1" /> </th>
              <th className="p-3 border font-normal">Last name <UpDown className="inline w-4 h-4 ml-1" /> </th>
              {/* <th className="p-3 border font-normal">Order ID</th> */}
              <th className="p-3 border font-normal">Date <UpDown className="inline w-4 h-4 ml-1" /></th>
              <th className="p-3 border font-normal">Action<UpDown className="inline w-4 h-4 ml-1" /></th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-6">No data found</td></tr>
            ) : data.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50 border-t">
                <td className="p-3 border"><input type="checkbox" /></td>
                <td className="p-3 border">{item.salesNo}</td>
                <td className="p-3 border">{item["Customer First Name"]} {item["Customer Last Name"]}</td>
                <td className="p-3 border">{item["Customer First Name"]} {item["Customer Last Name"]}</td>
                {/* <td className="p-3 border">{item["Order ID Number2"]}</td> */}
                <td className="p-3 border">{new Date(item.Timestamp).toLocaleDateString()}</td>
                <td className="p-3 border cursor-pointer">
                  <Eye
                    className="h-5 w-5 text-blue-600"
                    onClick={() => {
                      setSelectedLead({
                        id: item.salesNo,
                        firstName: item["Customer First Name"],
                        lastName: item["Customer Last Name"],
                        Product: item.Product,
                        Amount: item.Amount,
                        Offer_url: item.Offer_url
                      });
                      setIsModalOpen(true);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex justify-between items-center m-4">
          <div className="flex items-center gap-2">
            <label className="text-[13px] leading-[14px] font-normal text-[#4B5675]">Show</label>
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(+e.target.value);
                setPage(1);
              }}
              className="border border-[#DBDFE9] rounded-[6px] px-[10px] py-[8px] text-[11px] leading-[12px] font-normal bg-[#FCFCFC]"
            >
              {[2, 3, 4, 5, 10, 25, 50].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <span className="text-[13px] leading-[14px] font-normal text-[#4B5675]">per page</span>
          </div>
          {/* Custom Pagination */}
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-[#4B5675] text-[13px] leading-[14px] font-normal">
              {(page - 1) * perPage + 1}-{Math.min(page * perPage, totalCount)} of {totalCount}
            </span>
            <BlackLeft
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="w-6 h-6 hover:text-black cursor-pointer"
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
                    className={`px-[12px] py-[8px] rounded-[6px] text-[14px] ${page === pageNum ? "bg-[#F1F1F4] text-[#252F4A] font-semibold" : "text-[#4B5675] hover:bg-[#F1F1F4] font-normal"}`}
                  >
                    {pageNum}
                  </button>
                );
              });
            })()}
            <BlackRight
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="w-6 h-6 hover:text-black cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-[26px] w-[646px] max-w-md overflow-hidden px-[22px] pt-[28px] pb-[40px]">
            <div className="bg-[linear-gradient(121.72deg,_rgba(0,174,239,0.06)_0%,_rgba(0,127,196,0.06)_100%)] flex justify-between items-center p-[20px] rounded-[12px]">
              <h2 className="text-[18px] leading-[20px] font-medium text-[#071437]">
                Total Sales ({selectedLead.id})
              </h2>
              <Cross onClick={() => setIsModalOpen(false)} className="cursor-pointer" />
            </div>
            <div className="divide-y divide-gray-200 px-[20px]">
              {[
                ["Sale Id", selectedLead.id],
                ["First Name", selectedLead.firstName],
                ["Last Name", selectedLead.lastName],
                ["Product", selectedLead.Product],
                ["Amount", selectedLead.Amount],
              ].map(([label, value]) => (
                <div key={label} className="flex align-center py-[15px]">
                  <div className="w-1/3 text-gray-500 pr-4">{label}</div>
                  <div className="w-2/3 border-gray-200 pl-4 overflow-x-auto max-w-full whitespace-nowrap">
                    <div className="font-medium text-left">{value}</div>
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

export default SalesTable;