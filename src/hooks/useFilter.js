import { useSelector, useDispatch } from 'react-redux';
import {
  setDateRange,
  setSelectedCampaigns,
  setSelectedUsers,
  resetFilters,
} from '../store/slices/filterSlice';

export const useFilter = () => {
  const dispatch = useDispatch();
  const filterState = useSelector((state) => state.filter);

  const updateDateRange = (startDate, endDate) => {
    dispatch(setDateRange([startDate, endDate]));
  };

  const updateSelectedCampaigns = (campaigns) => {
    dispatch(setSelectedCampaigns(campaigns));
  };

  const updateSelectedUsers = (users) => {
    dispatch(setSelectedUsers(users));
  };

  const resetAllFilters = () => {
    dispatch(resetFilters());
  };

  return {
    ...filterState,
    updateDateRange,
    updateSelectedCampaigns,
    updateSelectedUsers,
    resetAllFilters,
  };
};
