import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { ReactComponent as Eye } from "../Assets/Eye.svg";
import { ReactComponent as Search } from "../Assets/Search.svg";
import { ReactComponent as UpDown } from "../Assets/UpDown.svg";
import { ReactComponent as Cross } from "../Assets/cross.svg";
import { ReactComponent as BlackLeft } from "../Assets/black-left.svg";
import { ReactComponent as BlackRight } from "../Assets/black-right.svg";
import { apiInstance } from "../api/config/axios";
import { LEAD } from "../api/constants";
import DatePick from "./DatePick";

function formatDateDMY(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date)) return "-";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

const LeadsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sortField, setSortField] = useState("listId");
  const [sortOption, setSortOption] = useState(1);

  const getDefaultDates = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 4);
    return [startDate, endDate];
  };

  useEffect(() => {
    const defaultDates = getDefaultDates();
    setDateRange(defaultDates);
  }, []);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Add handler for date range change
  const handleDateRangeChange = (startDate, endDate) => {
    setDateRange([startDate, endDate]);
    setPage(1); // Reset to first page when date range changes
    fetchLeads(1, perPage, startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0], sortField, sortOption, debouncedSearchTerm);
  };

  const fetchLeads = async (
    page,
    limit,
    startDate,
    endDate,
    sortFieldParam,
    sortOptionParam,
    searchTermParam
  ) => {
    try {
      setLoading(true);
      const startDateParam =
        startDate || (dateRange[0] ? dateRange[0].toISOString().split('T')[0] : null);
      const endDateParam =
        endDate || (dateRange[1] ? dateRange[1].toISOString().split('T')[0] : null);

      const url = LEAD.GET_LEAD(
        startDateParam,
        endDateParam,
        page,
        limit,
        sortOptionParam || sortOption,
        sortFieldParam || sortField,
        searchTermParam || ""
      );

      const response = await apiInstance.get(url);
      let leads = response.data?.data || [];
      
      // Get pagination data from API response
      const pagination = response.data?.pagination || {};
      const total = pagination.total || 0;
      const totalPages = pagination.totalPages || 1;

      setData(leads);
      setTotalCount(total);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOption((prev) => (prev === 1 ? -1 : 1));
    } else {
      setSortField(field);
      setSortOption(1);
    }
    setPage(1); // Reset to first page on sort
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page when search changes
  };

  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      fetchLeads(page, perPage, dateRange[0].toISOString().split('T')[0], dateRange[1].toISOString().split('T')[0], sortField, sortOption, debouncedSearchTerm);
    }
  }, [page, perPage, debouncedSearchTerm, sortField, sortOption, dateRange]);

  const toggleSelect = (id) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((leadId) => leadId !== id) : [...prev, id]
    );
  };

  return (
    <div className="xl:px-[40px] xl:py-[20px] p-5 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center">
        <div className="flex items-start gap-2">
          <div>
            <h2 className="md:text-xl text-[20px] gap-2 flex items-center leading-[20px] font-semibold text-[#071437] mb-[3px]">
              <button className="md:hidden text-gray-600 hover:text-black text-lg">
                &larr;
              </button>
              Lead ID
            </h2>
            <p className="text-[14px] leading-[14px] text-[#4B5675] font-normal"></p>
          </div>
        </div>
        <div>{/* <DatePick onDateChange={handleDateRangeChange} /> */}</div>
      </div>

      <div className="bg-white flex items-center justify-center rounded-2xl">
        <div className="w-full border border-[#F1F1F4]">
          <div className="flex justify-between items-center p-[20px] border-[#F1F1F4] border-b">
            <div className="relative lg:w-72 md:w-40 w-full">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search leads"
                value={searchTerm}
                onChange={handleSearchChange}
                className="border rounded pl-7 pr-3 py-2 lg:w-full md:w-52 w-44 text-[11px] leading-[12px] font-normal focus:outline-none text-black "
              />
              {searchTerm !== debouncedSearchTerm && (
                <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                </div>
              )}
            </div>
            <div className="absolute right-5">
              <DatePick onDateChange={handleDateRangeChange} />
            </div>
          </div>

          <div className="w-full border border-[#F1F1F4] overflow-x-auto">
            <table className="w-full border-separate border-[#F1F1F4] border-spacing-0 mb-2">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-center border border-[#F1F1F4] bg-[#FCFCFC]">
                    <input
                      type="checkbox"
                      checked={
                        data.length > 0 &&
                        data.every((lead) => selectedLeads.includes(lead._id))
                      }
                      onChange={(e) => {
                        const ids = data.map((lead) => lead._id);
                        setSelectedLeads((prev) =>
                          e.target.checked
                            ? [...new Set([...prev, ...ids])]
                            : prev.filter((id) => !ids.includes(id))
                        );
                      }}
                    />
                  </th>
                  {[
                    "List ID",
                    "List Name",
                    "Total Lead Count",
                    "Action",
                  ].map((h) => {
                    const fieldMap = {
                      "List ID": "listId",
                      "List Name": "listName",
                      "Total Lead Count": "totalLeadCount",
                    };
                    const field = fieldMap[h];
                    return (
                      <th
                        key={h}
                        className="px-[20px] text-left bg-[#FCFCFC] font-normal text-[#4B5675] border border-[#F1F1F4] text-[13px] leading-[14px] cursor-pointer"
                        onClick={
                          h !== "Action" ? () => handleSort(field) : undefined
                        }
                      >
                        <div className="flex items-center gap-1">
                          {h}
                          {h !== "Action" && (
                            <UpDown
                              className={`h-[14px] w-[14px] ${sortField === field ? "text-blue-500" : ""
                                }`}
                            />
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No data found
                    </td>
                  </tr>
                ) : (
                  data.map((row) => {
                    const isSelected = selectedLeads.includes(row._id);
                    const cellStyle = isSelected
                      ? "bg-[#F5F5F5] border-gray-100 border"
                      : "bg-white border border-gray-100";

                    return (
                      <tr key={row._id}>
                        <td
                          className={`p-3 text-black text-center ${cellStyle}`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(row._id)}
                          />
                        </td>
                        <td
                          className={`px-[20px] font-medium text-[14px] leading-[14px] text-[#071437] text-left ${cellStyle}`}
                        >
                          {row.listId}
                        </td>
                        <td
                          className={`px-[20px] font-medium text-[14px] leading-[14px] text-[#071437] text-left ${cellStyle}`}
                        >
                          {row.listName}
                        </td>
                        <td
                          className={`px-[20px] font-medium text-[14px] leading-[14px] text-[#071437] text-left ${cellStyle}`}
                        >
                          {row.totalLeadCount}
                        </td>
                        <td
                          className={`px-[20px] font-medium text-[14px] leading-[14px] text-[#071437] text-left ${cellStyle}`}
                        >
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
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex md:flex-row flex-col  items-center justify-between gap-4 py-4 px-6 w-full">
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
                  {[10, 25, 50, 100].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2">
                  <svg width="16" height="16" fill="none" viewBox="0 0 20 20">
                    <path
                      d="M6 8l4 4 4-4"
                      stroke="#4B5675"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
              <span className="text-[13px] leading-[14px] font-normal text-[#4B5675]">
                per page
              </span>
            </div>

            <div className="flex justify-center items-center gap-1 w-full md:w-auto">
              <span className="text-[#4B5675] text-[13px] mr-1 leading-[14px] font-normal">
                {(page - 1) * perPage + 1}-
                {Math.min(page * perPage, totalCount)} of {totalCount}
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
                      className={`px-[12px] py-[8px] rounded-[6px] text-[14px] leading-[14px] ${page === pageNum
                          ? "bg-[#F1F1F4] text-[#252F4A] font-semibold"
                          : "text-[#4B5675] hover:bg-[#F1F1F4]"
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                });
              })()}
              <BlackRight
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="w-5 h-5 text-[#4B5675] hover:text-[#4B5675] disabled:text-gray-300 cursor-pointer"
                disabled={page === totalPages || totalPages === 0}
              />
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071437] bg-opacity-50">
          <div className="bg-white rounded-[26px] w-[646px] max-w-md overflow-hidden px-[22px] pt-[28px] pb-[40px] mx-4">
            <div className="bg-[linear-gradient(121.72deg,_rgba(0,174,239,0.06)_0%,_rgba(0,127,196,0.06)_100%)] flex justify-between items-center p-[20px] rounded-[12px]">
              <h2 className="text-[18px] leading-[20px] font-medium text-[#071437]">
                Lead Details
              </h2>
              <Cross
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer"
              />
            </div>
            <div className="divide-y divide-gray-200 px-[20px]">
              {[
               
                ["List Id", selectedLead.listId],
                ["List Name", selectedLead.listName],
                ["TotalLeadCount", selectedLead.totalLeadCount],
              ].map(([label, value]) => (
                <div key={label} className="flex align-center py-[15px]">
                  <div className="w-1/3 text-[#252F4A] text-[14px] leading-[14px] font-meduim">
                    {label}
                  </div>
                  <div className="w-2/3 border-gray-200 pl-4 overflow-x-auto max-w-full whitespace-nowrap text-[#252F4A] font-medium text-[14px] leading-[14px]">
                    {value}
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
