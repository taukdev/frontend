import { createSlice } from '@reduxjs/toolkit';

// Get default dates (last 5 days from today)
const getDefaultDates = () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 4);
  return [startDate, endDate];
};

const initialState = {
  dateRange: getDefaultDates(),
  selectedCampaigns: ["All"],
  selectedUsers: ["All"],
  campaigns: [],
  users: [],
  loading: {
    campaigns: false,
    users: false,
  },
  error: {
    campaigns: null,
    users: null,
  }
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
    },
    setSelectedCampaigns: (state, action) => {
      state.selectedCampaigns = action.payload;
    },
    setSelectedUsers: (state, action) => {
      state.selectedUsers = action.payload;
    },
    setCampaigns: (state, action) => {
      state.campaigns = action.payload;
      state.loading.campaigns = false;
      state.error.campaigns = null;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
      state.loading.users = false;
      state.error.users = null;
    },
    setCampaignsLoading: (state, action) => {
      state.loading.campaigns = action.payload;
    },
    setUsersLoading: (state, action) => {
      state.loading.users = action.payload;
    },
    setCampaignsError: (state, action) => {
      state.error.campaigns = action.payload;
      state.loading.campaigns = false;
    },
    setUsersError: (state, action) => {
      state.error.users = action.payload;
      state.loading.users = false;
    },
    resetFilters: (state) => {
      state.selectedCampaigns = ["All"];
      state.selectedUsers = ["All"];
      state.dateRange = getDefaultDates();
    },
  },
});

export const {
  setDateRange,
  setSelectedCampaigns,
  setSelectedUsers,
  setCampaigns,
  setUsers,
  setCampaignsLoading,
  setUsersLoading,
  setCampaignsError,
  setUsersError,
  resetFilters,
} = filterSlice.actions;

export default filterSlice.reducer;
