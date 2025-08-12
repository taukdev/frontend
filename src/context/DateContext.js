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
    // Try to load dates from localStorage first
    const savedDateRange = localStorage.getItem('selectedDateRange');
    if (savedDateRange) {
      try {
        const parsedDates = JSON.parse(savedDateRange);
        if (Array.isArray(parsedDates) && parsedDates.length === 2) {
          const startDate = new Date(parsedDates[0]);
          const endDate = new Date(parsedDates[1]);
          // Check if dates are valid
          if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
            setDateRange([startDate, endDate]);
            return; // Exit early if we successfully loaded from localStorage
          }
        }
      } catch (error) {
        console.error('Error parsing saved date range:', error);
      }
    }
    
    // Fallback to default dates if localStorage is empty or invalid
    setDateRange(getDefaultDates());
    // Save default dates to localStorage
    localStorage.setItem(
      'selectedDateRange',
      JSON.stringify([
        getDefaultDates()[0].toISOString(),
        getDefaultDates()[1].toISOString()
      ])
    );

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
