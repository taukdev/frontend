import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { ReactComponent as Eye } from "../Assets/Eye.svg";
import { ReactComponent as Search } from "../Assets/Search.svg";
import { ReactComponent as UpDown } from "../Assets/UpDown.svg";
import { ReactComponent as Cross } from "../Assets/cross.svg";
import { ReactComponent as BlackLeft } from "../Assets/black-left.svg";
import { ReactComponent as BlackRight } from "../Assets/black-right.svg";
import DatePick from "./DatePick";
import { apiInstance } from "../api/config/axios";
import { CALLABLE } from "../api/constants";

const LeadsTable = () => {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [perPage, setPerPage] = useState(2);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const totalPages = Math.ceil(totalCount / perPage);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      
      // Build the URL with pagination parameters
      let url = CALLABLE.CALLABLE(page, perPage);
      
      // Add search parameter if provided
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      
      console.log('Fetching callable leads with URL:', url); // Debug log
      
      try {
        const response = await apiInstance.get(url);
        console.log('API Response:', response.data); // Debug log

        const result = response.data;
        
        // Handle the response format from leads endpoint
        if (result.success) {
          setLeads(result.data || []);
          setTotalCount(result.totalCount || 0);
        } else {
          setLeads([]);
          setTotalCount(0);
        }
      } catch (apiError) {
        console.error("API Error:", apiError);
        if (apiError.response?.status === 404) {
          console.log("API endpoint not found, using mock data for development");
          // Use mock data for development
          const mockData = generateMockCallableLeads(page, perPage, searchTerm);
          setLeads(mockData.leads);
          setTotalCount(mockData.totalCount);
        } else {
          throw apiError;
        }
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
      setLeads([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Mock data generator for development
  const generateMockCallableLeads = (page, limit, search) => {
    const allMockLeads = [
      { id: 1, firstName: "John", lastName: "Doe", phoneNumber: "+1234567890", email: "john.doe@email.com", created: "2024-01-15", country: "USA", offerUrl: "https://example.com/offer1" },
      { id: 2, firstName: "Jane", lastName: "Smith", phoneNumber: "+1234567891", email: "jane.smith@email.com", created: "2024-01-16", country: "Canada", offerUrl: "https://example.com/offer2" },
      { id: 3, firstName: "Mike", lastName: "Johnson", phoneNumber: "+1234567892", email: "mike.johnson@email.com", created: "2024-01-17", country: "UK", offerUrl: "https://example.com/offer3" },
      { id: 4, firstName: "Sarah", lastName: "Williams", phoneNumber: "+1234567893", email: "sarah.williams@email.com", created: "2024-01-18", country: "Australia", offerUrl: "https://example.com/offer4" },
      { id: 5, firstName: "David", lastName: "Brown", phoneNumber: "+1234567894", email: "david.brown@email.com", created: "2024-01-19", country: "Germany", offerUrl: "https://example.com/offer5" },
      { id: 6, firstName: "Lisa", lastName: "Davis", phoneNumber: "+1234567895", email: "lisa.davis@email.com", created: "2024-01-20", country: "France", offerUrl: "https://example.com/offer6" },
      { id: 7, firstName: "Tom", lastName: "Wilson", phoneNumber: "+1234567896", email: "tom.wilson@email.com", created: "2024-01-21", country: "Spain", offerUrl: "https://example.com/offer7" },
      { id: 8, firstName: "Emma", lastName: "Taylor", phoneNumber: "+1234567897", email: "emma.taylor@email.com", created: "2024-01-22", country: "Italy", offerUrl: "https://example.com/offer8" },
    ];

    let filteredLeads = allMockLeads;
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredLeads = allMockLeads.filter(lead => 
        lead.firstName.toLowerCase().includes(searchLower) ||
        lead.lastName.toLowerCase().includes(searchLower) ||
        lead.email.toLowerCase().includes(searchLower) ||
        lead.phoneNumber.includes(search)
      );
    }

    const totalCount = filteredLeads.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedLeads = filteredLeads.slice(startIndex, endIndex);

    return {
      leads: paginatedLeads,
      totalCount: totalCount
    };
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
          <button className="text-[#071437] text-[20px] font-semibold leading-none">&larr;</button>
          <div>
            <h2 className="text-[#071437] text-[18px] font-semibold leading-[24px]">Callable Lead ID</h2>
            <p className="text-[#7E8299] text-[14px] font-normal leading-[20px]"></p>
          </div>
        </div>
        <div><DatePick /></div>
      </div>

      <div className="bg-white flex items-center justify-center rounded-2xl mt-5 relative z-10">
        <div className="w-full border border-[#F1F1F4] overflow-x-auto">
          <div className="flex justify-between items-center p-[20px] border-[#F1F1F4] border-b">
            <div className="relative lg:w-72 md:w-40 w-full">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search leads"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="border rounded pl-7 pr-3 py-2 w-full text-[11px] leading-[12px] font-normal focus:outline-none text-black"
              />
            </div>
            <div className="md:block hidden absolute z-50 right-5"><DatePick /></div>
          </div>

          <table className="w-full border-separate border-[#F1F1F4] border-spacing-0 mb-2">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-center border border-[#F1F1F4] bg-[#FCFCFC]">
                  <input
                    type="checkbox"
                    checked={leads.length > 0 && leads.every((lead) => selectedLeads.includes(lead.id))}
                    onChange={(e) => {
                      const ids = leads.map((lead) => lead.id);
                      setSelectedLeads((prev) =>
                        e.target.checked ? [...new Set([...prev, ...ids])] : prev.filter((id) => !ids.includes(id))
                      );
                    }}
                  />
                </th>
                {["Lead ID", "List Name", "Total Lead Count", "Created", "Action"].map((h) => (
                  <th key={h} className="px-[20px] text-left bg-[#FCFCFC] font-normal text-[#4B5675] border border-[#F1F1F4] text-[13px] leading-[14px]">
                    <div className="flex items-center gap-1">
                      {h}
                      <UpDown className="h-[14px] w-[14px]" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-4">Loading...</td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-4">No data found</td></tr>
              ) : (
                leads.map((row) => {
                  const isSelected = selectedLeads.includes(row.id);
                  const cellStyle = isSelected ? "bg-[#F5F5F5] border-[#F1F1F4] border" : "bg-white border border-[#F1F1F4]";
                  return (
                    <tr key={row.id}>
                      <td className={`p-3 text-black text-center ${cellStyle}`}>
                        <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(row.id)} />
                      </td>
                      <td className={`px-[20px] font-medium text-[14px] text-[#071437] ${cellStyle}`}>{row.listId}</td>
                      <td className={`px-[20px] font-medium text-[14px] text-[#071437] ${cellStyle}`}>{row.listName}</td>
                      <td className={`px-[20px] font-medium text-[14px] text-[#071437] ${cellStyle}`}>{row.totalLeadCount}</td>
                      <td className={`px-[20px] font-medium text-[14px] text-[#071437] ${cellStyle}`}>{row.createdAt}</td>
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

          <div className="flex justify-between items-center py-4 px-6">
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
                  {[2, 3, 4, 5, 10, 25, 50].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2">
                  <svg width="16" height="16" viewBox="0 0 20 20"><path d="M6 8l4 4 4-4" stroke="#4B5675" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              </div>
              <span className="text-[13px] text-[#4B5675]">per page</span>
            </div>

            <div className="hidden md:flex items-center">
              <span className="text-[#4B5675] text-[13px] mr-1">{`${(page - 1) * perPage + 1}-${Math.min(page * perPage, totalCount)} of ${totalCount}`}</span>
              <BlackLeft onClick={() => setPage((p) => Math.max(1, p - 1))} className="w-5 h-5 cursor-pointer" />
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
              <BlackRight onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="w-5 h-5 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-[26px] w-[646px] max-w-md overflow-hidden px-[22px] pt-[28px] pb-[40px]">
            <div className="bg-[linear-gradient(121.72deg,_rgba(0,174,239,0.06)_0%,_rgba(0,127,196,0.06)_100%)] flex justify-between items-center p-[20px] rounded-[12px]">
              <h2 className="text-[18px] font-medium text-[#071437]">Callable Lead ID ({selectedLead.id})</h2>
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
                      <a href={value} target="_blank" rel="noopener noreferrer" className="text-[#252F4A] underline block">{value}</a>
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
