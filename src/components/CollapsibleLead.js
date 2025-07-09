import React, { useState, useEffect } from "react";
import { ReactComponent as BlackLeft } from "../Assets/black-left.svg";
import { ReactComponent as BlackRight } from "../Assets/black-right.svg";
import { ReactComponent as Eye } from "../Assets/Eye.svg";
import { apiInstance } from "../api/config/axios";
import { CALLABLES } from "../api/constants";
import DatePick from "./DatePick";
import { useNavigate } from "react-router-dom";

function formatDateDMY(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date)) return '-';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

const LeadsTable = () => {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const navigate = useNavigate();

  const fetchLeads = async () => {
    try {
      setLoading(true);
      let url = CALLABLES.CALLABLES(page, perPage);
      const finalUrl = searchTerm ? `${url}&search=${encodeURIComponent(searchTerm)}` : url;
      try {
        const response = await apiInstance.get(finalUrl);
        const result = response.data;
        if (result.success) {
          setLeads(result.data || []);
          setTotalCount(result.pagination?.total || 0);
          setTotalPages(result.pagination?.totalPages || 1);
        } else {
          setLeads([]);
          setTotalCount(0);
          setTotalPages(1);
        }
      } catch (apiError) {
        setLeads([]);
        setTotalCount(0);
        setTotalPages(1);
      }
    } catch (err) {
      setLeads([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [page, perPage, searchTerm]);

  const toggleSelect = (id) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((leadId) => leadId !== id) : [...prev, id]
    );
  };

  return (
    <div className="xl:px-[40px] xl:py-[20px] p-5 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center">
        <div className="flex items-start gap-3">
          <button className="text-[#071437] text-[20px] font-semibold leading-none" onClick={() => navigate("/Lead")}>&larr;</button>
          <div>
            <h2 className="text-[#071437] text-[18px] font-semibold leading-[24px]">Callable Lead ID</h2>
            <p className="text-[#7E8299] text-[14px] font-normal leading-[20px]"></p>
          </div>
        </div>
        <div></div>
      </div>
      <div className="bg-white flex items-center justify-center rounded-2xl mt-5 relative">
        <div className="w-full border border-[#F1F1F4]">
          <div className="flex justify-between items-center p-[20px] border-[#F1F1F4] border-b">
            <div className="relative lg:w-72 md:w-40 w-full">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              </div>
              <input
                type="text"
                placeholder="Search leads"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="border rounded pl-7 pr-3 py-2 lg:w-full md:w-52 w-44 text-[11px] leading-[12px] font-normal focus:outline-none text-black"
              />
            </div>
            {/* <div className="absolute right-5">
              <DatePick onDateChange={(start, end) => {
                setStartDate(start);
                setEndDate(end);
                setPage(1);
              }} />
            </div> */}
          </div>
          <div className="w-full border border-[#F1F1F4] overflow-x-auto">
            <table className="w-full border-separate border-[#F1F1F4] border-spacing-0 mb-2">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-center border border-[#F1F1F4] bg-[#FCFCFC]">
                    <input
                      type="checkbox"
                      checked={leads.length > 0 && leads.every((lead) => selectedLeads.includes(lead._id))}
                      onChange={(e) => {
                        const ids = leads.map((lead) => lead._id);
                        setSelectedLeads((prev) =>
                          e.target.checked ? [...new Set([...prev, ...ids])] : prev.filter((id) => !ids.includes(id))
                        );
                      }}
                    />
                  </th>
                  {["List ID", "List Name", "Description", "Leads Count", "Active", "Last Call Date", "Action"].map((h) => (
                    <th key={h} className="px-[20px] text-left bg-[#FCFCFC] font-normal text-[#4B5675] border border-[#F1F1F4] text-[13px] leading-[14px]">
                      <div className="flex items-center gap-1">
                        {h}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="9" className="text-center py-4">Loading...</td></tr>
                ) : leads.length === 0 ? (
                  <tr><td colSpan="9" className="text-center py-4">No data found</td></tr>
                ) : (
                  leads.map((row) => {
                    const isSelected = selectedLeads.includes(row._id);
                    const cellStyle = isSelected ? "bg-[#F5F5F5] border-[#F1F1F4] border" : "bg-white border border-[#F1F1F4]";
                    return (
                      <tr key={row._id}>
                        <td className={`p-3 text-black text-center ${cellStyle}`}>
                          <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(row._id)} />
                        </td>
                        {/* <td className={`px-[20px] font-medium text-[14px] text-[#071437] ${cellStyle}`}>{row.leadNo}</td> */}
                        <td className={`px-[20px] font-medium text-[14px] text-[#071437] ${cellStyle}`}>{row.listId}</td>
                        <td className={`px-[20px] font-medium text-[14px] text-[#071437] ${cellStyle}`}>{row.listName}</td>
                        <td className={`px-[20px] font-medium text-[14px] text-[#071437] ${cellStyle}`}>{row.description}</td>
                        <td className={`px-[20px] font-medium text-[14px] text-[#071437] ${cellStyle}`}>{row.leadsCount}</td>
                        <td className={`px-[20px] font-medium text-[14px] text-[#071437] ${cellStyle}`}>{row.active === 'Y' ? 'Yes' : 'No'}</td>
                        <td className={`px-[20px] font-medium text-[14px] text-[#071437] ${cellStyle}`}>
                          {row.lastCallDate ? formatDateDMY(row.lastCallDate) : (row.createdAt ? formatDateDMY(row.createdAt) : 'No calls yet')}
                        </td>
                        <td className={`px-[20px] font-medium text-[14px] text-[#071437] ${cellStyle}`}>
                          <button onClick={() => { setSelectedLead(row); setIsModalOpen(true); }}>
                            <Eye className="h-[30px] w-[30px]" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="flex md:flex-row flex-col  items-center justify-between md:gap-4 gap-2 py-4 px-6 w-full">
            <div className="flex items-center gap-2">
              <label className="text-[13px] text-[#4B5675]">Show</label>
              <div className="relative border border-[#F1F1F4] rounded-[6px]">
                <select
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(+e.target.value);
                    setPage(1);
                  }}
                  className="appearance-none border-none bg-transparent pr-6 pl-2 py-1 text-[15px] font-medium text-[#252F4A] focus:outline-none"
                  style={{ minWidth: "40px" }}
                >
                  {[10, 25, 50, 100].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2">
                  <svg width="16" height="16" viewBox="0 0 20 20"><path d="M6 8l4 4 4-4" stroke="#4B5675" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              </div>
              <span className="text-[13px] text-[#4B5675]">per page</span>
            </div>
            <div className="flex items-center">
              <span className="text-[#4B5675] text-[13px] mr-1">{`${(page - 1) * perPage + 1}-${Math.min(page * perPage, totalCount)} of ${totalCount}`}</span>
              <BlackLeft
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={`w-5 h-5 cursor-pointer${page === 1 ? ' opacity-50 pointer-events-none' : ''}`}
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
                      className={`px-[12px] py-[8px] rounded-[6px] text-[14px] ${page === pageNum
                        ? "bg-[#F1F1F4] text-[#252F4A] font-semibold"
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
                className={`w-5 h-5 cursor-pointer${page === totalPages || totalPages === 0 ? ' opacity-50 pointer-events-none' : ''}`}
                disabled={page === totalPages || totalPages === 0}
              />
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-[26px] w-[646px] max-w-md overflow-hidden px-[22px] pt-[28px] pb-[40px]">
            <div className="bg-[linear-gradient(121.72deg,_rgba(0,174,239,0.06)_0%,_rgba(0,127,196,0.06)_100%)] flex justify-between items-center p-[20px] rounded-[12px]">
              <h2 className="text-[18px] font-medium text-[#071437]">Callable Lead ID ({selectedLead.leadNo || selectedLead.listId || '-'})</h2>
              <button onClick={() => setIsModalOpen(false)} className="cursor-pointer">Close</button>
            </div>
            <div className="divide-y divide-gray-200 px-[20px]">
              {[
                ["List ID", selectedLead.listId || '-'],
                ["List Name", selectedLead.listName || '-'],
                ["Description", selectedLead.description || 'No description available'],
                ["Leads Count", selectedLead.leadsCount ?? selectedLead.totalLeadCount ?? '-'],
                ["Active", (typeof selectedLead.active === 'boolean') ? (selectedLead.active ? 'Yes' : 'No') : (selectedLead.active === 'Y' ? 'Yes' : selectedLead.active === 'N' ? 'No' : (selectedLead.active ?? '-'))],
                ["Last Call Date", selectedLead.lastCallDate || selectedLead.createdAt || 'No calls yet'],
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

export default LeadsTable;
