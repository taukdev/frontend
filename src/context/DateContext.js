import React, { createContext, useContext, useState, useEffect } from 'react';

const DateContext = createContext();

export const useDateContext = () => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error('useDateContext must be used within a DateProvider');
  }
  return context;
};

export const DateProvider = ({ children }) => {
  // Get default dates (last 5 days from today)
  const getDefaultDates = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 4);
    return [startDate, endDate];
  };

  const [dateRange, setDateRange] = useState(getDefaultDates());
  const [startDate, endDate] = dateRange;
  const [selectedCampaigns, setSelectedCampaigns] = useState(() => {
    const saved = localStorage.getItem('selectedCampaigns');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return ["All"]; // Default to "All"
  });

  // Load dates from localStorage on mount
  useEffect(() => {
    const savedDates = localStorage.getItem('selectedDateRange');
    if (savedDates) {
      try {
        const parsedDates = JSON.parse(savedDates);
        // Convert string dates back to Date objects
        const convertedDates = parsedDates.map(dateStr => new Date(dateStr));
        if (convertedDates[0] && convertedDates[1] && !isNaN(convertedDates[0].getTime()) && !isNaN(convertedDates[1].getTime())) {
          setDateRange(convertedDates);
        }
      } catch (error) {
        console.error('Error parsing saved dates:', error);
      }
    }

    const savedCampaigns = localStorage.getItem('selectedCampaigns');
    if (savedCampaigns) {
      try {
        const parsedCampaigns = JSON.parse(savedCampaigns);
        if (Array.isArray(parsedCampaigns)) {
          setSelectedCampaigns(parsedCampaigns);
        }
      } catch (error) {
        console.error('Error parsing saved campaigns:', error);
      }
    }
  }, []);

  // Save dates to localStorage whenever they change
  useEffect(() => {
    if (startDate && endDate) {
      localStorage.setItem('selectedDateRange', JSON.stringify([startDate.toISOString(), endDate.toISOString()]));
    }
  }, [startDate, endDate]);

  const updateDateRange = (newStartDate, newEndDate) => {
    setDateRange([newStartDate, newEndDate]);
  };

  // Campaign selection persistence
  const updateSelectedCampaigns = (campaignNamesArray) => {
    setSelectedCampaigns(campaignNamesArray || []);
    try {
      localStorage.setItem('selectedCampaigns', JSON.stringify(campaignNamesArray || []));
    } catch (error) {
      console.error('Failed saving campaigns to localStorage:', error);
    }
  };

  const value = {
    dateRange,
    startDate,
    endDate,
    updateDateRange,
    selectedCampaigns,
    updateSelectedCampaigns,
  };

  return (
    <DateContext.Provider value={value}>
      {children}
    </DateContext.Provider>
  );
};
